import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const projects = mysqlTable("projects", {
  id: int("id").autoincrement().primaryKey(),
  creatorId: int("creatorId").notNull(),
  title: varchar("title", { length: 180 }).notNull(),
  description: text("description").notNull(),
  category: mysqlEnum("category", ["DeFi", "Gaming", "DePIN", "Social", "Other"]).notNull(),
  goalUsdc: int("goalUsdc").notNull(),
  status: mysqlEnum("status", ["Active", "Completed", "Cancelled"]).default("Active").notNull(),
  chain: varchar("chain", { length: 80 }).default("Arbitrum Sepolia").notNull(),
  contractAddress: varchar("contractAddress", { length: 80 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const milestones = mysqlTable("milestones", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull(),
  position: int("position").notNull(),
  title: varchar("title", { length: 180 }).notNull(),
  description: text("description").notNull(),
  amountUsdc: int("amountUsdc").notNull(),
  proofUrl: varchar("proofUrl", { length: 500 }),
  proofDescription: text("proofDescription"),
  status: mysqlEnum("status", ["Pending", "Submitted", "Approved", "Released"]).default("Pending").notNull(),
  submittedAt: timestamp("submittedAt"),
  approvedAt: timestamp("approvedAt"),
  releasedAt: timestamp("releasedAt"),
});

export const contributions = mysqlTable("contributions", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull(),
  funderId: int("funderId").notNull(),
  amountUsdc: int("amountUsdc").notNull(),
  releasedUsdc: int("releasedUsdc").default(0).notNull(),
  txHash: varchar("txHash", { length: 120 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const proofReviews = mysqlTable("proofReviews", {
  id: int("id").autoincrement().primaryKey(),
  milestoneId: int("milestoneId").notNull(),
  reviewerType: mysqlEnum("reviewerType", ["AI", "Human"]).default("AI").notNull(),
  recommendation: mysqlEnum("recommendation", ["Approve", "Needs evidence", "Reject"]).notNull(),
  confidence: int("confidence").notNull(),
  rationale: text("rationale").notNull(),
  checksJson: text("checksJson").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const releases = mysqlTable("releases", {
  id: int("id").autoincrement().primaryKey(),
  milestoneId: int("milestoneId").notNull(),
  projectId: int("projectId").notNull(),
  amountUsdc: int("amountUsdc").notNull(),
  txHash: varchar("txHash", { length: 120 }).notNull(),
  network: varchar("network", { length: 80 }).default("Arbitrum Sepolia").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const notificationPreferences = mysqlTable("notificationPreferences", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  proofSubmitted: int("proofSubmitted").default(1).notNull(),
  milestoneApproved: int("milestoneApproved").default(1).notNull(),
  fundsReleased: int("fundsReleased").default(1).notNull(),
  contributionReceived: int("contributionReceived").default(1).notNull(),
});

export const notifications = mysqlTable("notifications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  type: mysqlEnum("type", ["proof_submitted", "milestone_approved", "funds_released", "contribution_received"]).notNull(),
  title: varchar("title", { length: 180 }).notNull(),
  body: text("body").notNull(),
  projectId: int("projectId"),
  milestoneId: int("milestoneId"),
  readAt: timestamp("readAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Project = typeof projects.$inferSelect;
export type Milestone = typeof milestones.$inferSelect;
export type Contribution = typeof contributions.$inferSelect;
export type ProofReview = typeof proofReviews.$inferSelect;
export type Release = typeof releases.$inferSelect;
export type Notification = typeof notifications.$inferSelect;
