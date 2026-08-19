export const MILESTONE_STATUSES = ["Pending", "Submitted", "Approved", "Released"] as const;
export type MilestoneStatus = typeof MILESTONE_STATUSES[number];

export function calculateFundingProgress(raisedUsdc: number, goalUsdc: number) {
  if (goalUsdc <= 0) return 0;
  return Math.min(100, Math.round((raisedUsdc / goalUsdc) * 100));
}

export function nextMilestoneStatus(status: MilestoneStatus): MilestoneStatus {
  if (status === "Pending") return "Submitted";
  if (status === "Submitted") return "Approved";
  if (status === "Approved") return "Released";
  return "Released";
}

export function makeReleaseLog(projectId: number, milestoneId: number, amountUsdc: number) {
  return { projectId, milestoneId, amountUsdc, network: "Arbitrum Sepolia", txHash: `0xrelease-${projectId}-${milestoneId}-${amountUsdc}` };
}

export function defaultNotificationPreferences() {
  return { proofSubmitted: 1, milestoneApproved: 1, fundsReleased: 1, contributionReceived: 1 } as const;
}
