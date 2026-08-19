import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { invokeLLM } from "./_core/llm";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import {
  createContribution,
  createNotification,
  createProject,
  getProjectById,
  getStats,
  getNotificationPreferences,
  updateNotificationPreferences,
  listNotifications,
  listProjects,
  listFunderContributions,
  listReleases,
  markNotificationRead,
  releaseMilestone,
  saveProofReview,
  submitProof,
  getMilestoneWithProject,
} from "./db";

const categories = ["DeFi", "Gaming", "DePIN", "Social", "Other"] as const;
const milestoneStatuses = ["Pending", "Submitted", "Approved", "Released"] as const;

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  public: router({
    stats: publicProcedure.query(() => getStats()),
    projects: publicProcedure.input(z.object({ search: z.string().optional(), category: z.enum(categories).optional() }).optional()).query(async ({ input }) => {
      const rows = await listProjects();
      return rows.filter(({ project }) => (!input?.category || project.category === input.category) && (!input?.search || `${project.title} ${project.description}`.toLowerCase().includes(input.search.toLowerCase())));
    }),
    project: publicProcedure.input(z.object({ id: z.number().int().positive() })).query(({ input }) => getProjectById(input.id)),
  }),
  project: router({
    create: protectedProcedure.input(z.object({ title: z.string().min(3).max(180), description: z.string().min(20), category: z.enum(categories), goalUsdc: z.number().int().positive(), chain: z.string().default("Arbitrum Sepolia"), milestones: z.array(z.object({ title: z.string().min(2).max(180), description: z.string().min(5), proofUrl: z.string().url().optional(), amountUsdc: z.number().int().positive() })).min(1).max(5) })).mutation(({ ctx, input }) => createProject({ creatorId: ctx.user.id, ...input })),
    contribute: protectedProcedure.input(z.object({ projectId: z.number().int().positive(), amountUsdc: z.number().int().positive() })).mutation(async ({ ctx, input }) => {
      const txHash = `0xproofmesh-demo-${Date.now().toString(16)}`;
      const contributionId = await createContribution({ ...input, funderId: ctx.user.id, txHash });
      const project = await getProjectById(input.projectId);
      if (project) await createNotification({ userId: project.project.creatorId, type: "contribution_received", title: "New funding pledge", body: `${ctx.user.name ?? "A funder"} pledged ${input.amountUsdc} USDC to ${project.project.title}.`, projectId: input.projectId });
      return { contributionId, txHash };
    }),
    submitProof: protectedProcedure.input(z.object({ milestoneId: z.number().int().positive(), proofUrl: z.string().url(), proofDescription: z.string().min(10) })).mutation(async ({ ctx, input }) => {
      const milestone = await submitProof(input);
      if (!milestone) throw new Error("Milestone not found");
      const project = await getProjectById(milestone.projectId);
      if (project) {
        await createNotification({ userId: project.project.creatorId, type: "proof_submitted", title: "Proof submitted", body: `Proof is ready for review on milestone ${milestone.position} of ${project.project.title}.`, projectId: project.project.id, milestoneId: milestone.id });
      }
      return milestone;
    }),
    reviewProof: protectedProcedure.input(z.object({ milestoneId: z.number().int().positive() })).mutation(async ({ input }) => {
      const context = await getMilestoneWithProject(input.milestoneId);
      if (!context) throw new Error("Milestone not found");
      const prompt = `Review a milestone proof for ProofMesh. Project: ${context.project.title}. Milestone: ${context.milestone.title}. Description: ${context.milestone.description}. Proof URL: ${context.milestone.proofUrl ?? "missing"}. Proof description: ${context.milestone.proofDescription ?? "missing"}. Return a concise decision using evidence specificity, link quality, deliverable fit, and reproducibility.`;
      const response = await invokeLLM({ model: "gpt-5-mini", messages: [{ role: "system", content: "You are ProofMesh Review Engine. Return JSON only." }, { role: "user", content: prompt }], response_format: { type: "json_schema", json_schema: { name: "proof_review", strict: true, schema: { type: "object", properties: { recommendation: { type: "string", enum: ["Approve", "Needs evidence", "Reject"] }, confidence: { type: "integer", minimum: 0, maximum: 100 }, rationale: { type: "string" }, checks: { type: "array", items: { type: "string" } } }, required: ["recommendation", "confidence", "rationale", "checks"], additionalProperties: false } } } });
      const raw = response.choices[0]?.message.content;
      const content = typeof raw === "string" ? raw : "{}";
      const parsed = JSON.parse(content) as { recommendation: "Approve" | "Needs evidence" | "Reject"; confidence: number; rationale: string; checks: string[] };
      const result = await saveProofReview({ milestoneId: input.milestoneId, recommendation: parsed.recommendation, confidence: parsed.confidence, rationale: parsed.rationale, checksJson: JSON.stringify(parsed.checks) });
      return result[0];
    }),
    approveMilestone: protectedProcedure.input(z.object({ milestoneId: z.number().int().positive() })).mutation(async ({ input }) => {
      const context = await getMilestoneWithProject(input.milestoneId);
      if (!context) throw new Error("Milestone not found");
      const database = await (await import("./db")).getDb();
      if (!database) throw new Error("Database unavailable");
      const { milestones } = await import("../drizzle/schema");
      const { eq } = await import("drizzle-orm");
      await database.update(milestones).set({ status: "Approved", approvedAt: new Date() }).where(eq(milestones.id, input.milestoneId));
      return { status: "Approved" as const };
    }),
    releaseMilestone: protectedProcedure.input(z.object({ milestoneId: z.number().int().positive(), projectId: z.number().int().positive(), amountUsdc: z.number().int().positive() })).mutation(async ({ input }) => {
      const txHash = `0xrelease-${Date.now().toString(16)}`;
      const release = await releaseMilestone({ ...input, txHash });
      const project = await getProjectById(input.projectId);
      if (project) await createNotification({ userId: project.project.creatorId, type: "funds_released", title: "Milestone funds released", body: `${input.amountUsdc} USDC released on Arbitrum Sepolia.`, projectId: input.projectId, milestoneId: input.milestoneId });
      return release;
    }),
  }),
  dashboard: router({
    funder: protectedProcedure.query(({ ctx }) => listFunderContributions(ctx.user.id)),
    releases: protectedProcedure.query(() => listReleases()),
  }),
  notifications: router({
    list: protectedProcedure.query(({ ctx }) => listNotifications(ctx.user.id)),
    preferences: protectedProcedure.query(({ ctx }) => getNotificationPreferences(ctx.user.id)),
    updatePreferences: protectedProcedure.input(z.object({ proofSubmitted: z.number().int().min(0).max(1), milestoneApproved: z.number().int().min(0).max(1), fundsReleased: z.number().int().min(0).max(1), contributionReceived: z.number().int().min(0).max(1) })).mutation(({ ctx, input }) => updateNotificationPreferences(ctx.user.id, input)),
    markRead: protectedProcedure.input(z.object({ id: z.number().int().positive() })).mutation(({ ctx, input }) => markNotificationRead(input.id, ctx.user.id)),
  }),
});

export type AppRouter = typeof appRouter;
