import { and, desc, eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  contributions,
  milestones,
  notifications,
  notificationPreferences,
  projects,
  proofReviews,
  releases,
  users,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;
  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  const textFields = ["name", "email", "loginMethod"] as const;
  for (const field of textFields) {
    if (user[field] !== undefined) {
      values[field] = user[field] ?? null;
      updateSet[field] = user[field] ?? null;
    }
  }
  if (user.lastSignedIn !== undefined) {
    values.lastSignedIn = user.lastSignedIn;
    updateSet.lastSignedIn = user.lastSignedIn;
  }
  if (user.role !== undefined) {
    values.role = user.role;
    updateSet.role = user.role;
  } else if (user.openId === ENV.ownerOpenId) {
    values.role = "admin";
    updateSet.role = "admin";
  }
  values.lastSignedIn ??= new Date();
  updateSet.lastSignedIn ??= new Date();
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const rows = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return rows[0];
}

export async function listProjects() {
  const db = await getDb();
  if (!db) return [];
  const rows = await db.select({
    project: projects,
    creatorName: users.name,
    raisedUsdc: sql<number>`coalesce((select sum(${contributions.amountUsdc}) from ${contributions} where ${contributions.projectId} = ${projects.id}), 0)`,
    milestoneCount: sql<number>`(select count(*) from ${milestones} where ${milestones.projectId} = ${projects.id})`,
    releasedUsdc: sql<number>`coalesce((select sum(${releases.amountUsdc}) from ${releases} where ${releases.projectId} = ${projects.id}), 0)`,
  }).from(projects).leftJoin(users, eq(projects.creatorId, users.id)).orderBy(desc(projects.createdAt));
  return rows;
}

export async function getProjectById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const projectRows = await db.select({ project: projects, creatorName: users.name }).from(projects).leftJoin(users, eq(projects.creatorId, users.id)).where(eq(projects.id, id)).limit(1);
  if (!projectRows[0]) return null;
  const [projectMilestones, projectContributions, projectReleases] = await Promise.all([
    db.select().from(milestones).where(eq(milestones.projectId, id)).orderBy(milestones.position),
    db.select({ contribution: contributions, funderName: users.name }).from(contributions).leftJoin(users, eq(contributions.funderId, users.id)).where(eq(contributions.projectId, id)).orderBy(desc(contributions.createdAt)),
    db.select().from(releases).where(eq(releases.projectId, id)).orderBy(desc(releases.createdAt)),
  ]);
  return { ...projectRows[0], milestones: projectMilestones, contributions: projectContributions.map(item => ({ ...item, releaseStatus: item.contribution.releasedUsdc >= item.contribution.amountUsdc ? "Released" as const : item.contribution.releasedUsdc > 0 ? "Partially released" as const : "Pledged" as const })), releases: projectReleases };
}

export async function getStats() {
  const db = await getDb();
  if (!db) return { totalProjects: 0, fundsLocked: 0, milestonesCompleted: 0 };
  const [projectCount, funds, completed] = await Promise.all([
    db.select({ count: sql<number>`count(*)` }).from(projects),
    db.select({ total: sql<number>`coalesce(sum(${contributions.amountUsdc}), 0)` }).from(contributions),
    db.select({ count: sql<number>`count(*)` }).from(milestones).where(eq(milestones.status, "Released")),
  ]);
  return { totalProjects: Number(projectCount[0]?.count ?? 0), fundsLocked: Number(funds[0]?.total ?? 0), milestonesCompleted: Number(completed[0]?.count ?? 0) };
}

export async function createProject(input: { creatorId: number; title: string; description: string; category: "DeFi" | "Gaming" | "DePIN" | "Social" | "Other"; goalUsdc: number; chain?: string; milestones: Array<{ title: string; description: string; proofUrl?: string; amountUsdc: number }> }) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  const projectResult = await db.insert(projects).values({ creatorId: input.creatorId, title: input.title, description: input.description, category: input.category, goalUsdc: input.goalUsdc, chain: input.chain ?? "Arbitrum Sepolia" });
  const projectId = Number(projectResult[0].insertId);
  await db.insert(milestones).values(input.milestones.map((milestone, index) => ({ projectId, position: index + 1, ...milestone })));
  return getProjectById(projectId);
}

export async function getMilestoneWithProject(milestoneId: number) {
  const db = await getDb();
  if (!db) return null;
  const rows = await db.select({ milestone: milestones, project: projects }).from(milestones).innerJoin(projects, eq(milestones.projectId, projects.id)).where(eq(milestones.id, milestoneId)).limit(1);
  return rows[0] ?? null;
}

export async function submitProof(input: { milestoneId: number; proofUrl: string; proofDescription: string }) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.update(milestones).set({ proofUrl: input.proofUrl, proofDescription: input.proofDescription, status: "Submitted", submittedAt: new Date() }).where(eq(milestones.id, input.milestoneId));
  const rows = await db.select().from(milestones).where(eq(milestones.id, input.milestoneId)).limit(1);
  return rows[0];
}

export async function saveProofReview(input: { milestoneId: number; recommendation: "Approve" | "Needs evidence" | "Reject"; confidence: number; rationale: string; checksJson: string }) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.insert(proofReviews).values({ milestoneId: input.milestoneId, reviewerType: "AI", recommendation: input.recommendation, confidence: input.confidence, rationale: input.rationale, checksJson: input.checksJson });
  return db.select().from(proofReviews).where(eq(proofReviews.milestoneId, input.milestoneId)).orderBy(desc(proofReviews.createdAt)).limit(1);
}

export async function getNotificationPreferences(userId: number) {
  const db = await getDb();
  if (!db) return { proofSubmitted: 1, milestoneApproved: 1, fundsReleased: 1, contributionReceived: 1 };
  const rows = await db.select().from(notificationPreferences).where(eq(notificationPreferences.userId, userId)).limit(1);
  if (rows[0]) return rows[0];
  await db.insert(notificationPreferences).values({ userId });
  const created = await db.select().from(notificationPreferences).where(eq(notificationPreferences.userId, userId)).limit(1);
  return created[0];
}

export async function updateNotificationPreferences(userId: number, values: { proofSubmitted: number; milestoneApproved: number; fundsReleased: number; contributionReceived: number }) {
  const db = await getDb();
  if (!db) return values;
  await db.insert(notificationPreferences).values({ userId, ...values }).onDuplicateKeyUpdate({ set: values });
  return getNotificationPreferences(userId);
}

export async function listNotifications(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(notifications).where(eq(notifications.userId, userId)).orderBy(desc(notifications.createdAt)).limit(40);
}

export async function markNotificationRead(id: number, userId: number) {
  const db = await getDb();
  if (!db) return;
  await db.update(notifications).set({ readAt: new Date() }).where(and(eq(notifications.id, id), eq(notifications.userId, userId)));
}

export async function createNotification(input: { userId: number; type: "proof_submitted" | "milestone_approved" | "funds_released" | "contribution_received"; title: string; body: string; projectId?: number; milestoneId?: number }) {
  const db = await getDb();
  if (!db) return;
  await db.insert(notifications).values(input);
}

export async function listReleases() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(releases).orderBy(desc(releases.createdAt)).limit(20);
}

export async function listFunderContributions(funderId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select({ contribution: contributions, project: projects, releasedUsdc: sql<number>`coalesce((select sum(${releases.amountUsdc}) from ${releases} where ${releases.projectId} = ${projects.id}), 0)` }).from(contributions).innerJoin(projects, eq(contributions.projectId, projects.id)).where(eq(contributions.funderId, funderId)).orderBy(desc(contributions.createdAt));
}

export async function createContribution(input: { projectId: number; funderId: number; amountUsdc: number; txHash: string }) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  const result = await db.insert(contributions).values(input);
  return Number(result[0].insertId);
}

export async function releaseMilestone(input: { milestoneId: number; projectId: number; amountUsdc: number; txHash: string }) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.update(milestones).set({ status: "Released", releasedAt: new Date() }).where(eq(milestones.id, input.milestoneId));
  await db.insert(releases).values({ ...input, network: "Arbitrum Sepolia" });
  const projectContributions = await db.select().from(contributions).where(eq(contributions.projectId, input.projectId)).orderBy(contributions.id);
  let remaining = input.amountUsdc;
  for (const contribution of projectContributions) {
    if (remaining <= 0) break;
    const allocation = Math.min(remaining, contribution.amountUsdc - contribution.releasedUsdc);
    if (allocation > 0) {
      await db.update(contributions).set({ releasedUsdc: contribution.releasedUsdc + allocation }).where(eq(contributions.id, contribution.id));
      remaining -= allocation;
    }
  }
  return { txHash: input.txHash, status: "Released" as const };
}
