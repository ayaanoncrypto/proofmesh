import { describe, expect, it } from "vitest";
import { calculateFundingProgress, defaultNotificationPreferences, makeReleaseLog, nextMilestoneStatus } from "../shared/workflow";

describe("ProofMesh funding workflow", () => {
  it("calculates capped funding progress", () => {
    expect(calculateFundingProgress(16800, 24000)).toBe(70);
    expect(calculateFundingProgress(30000, 24000)).toBe(100);
    expect(calculateFundingProgress(0, 0)).toBe(0);
  });

  it("moves a milestone through the exact release states", () => {
    expect(nextMilestoneStatus("Pending")).toBe("Submitted");
    expect(nextMilestoneStatus("Submitted")).toBe("Approved");
    expect(nextMilestoneStatus("Approved")).toBe("Released");
    expect(nextMilestoneStatus("Released")).toBe("Released");
  });

  it("creates an Arbitrum Sepolia release log", () => {
    expect(makeReleaseLog(7, 2, 8400)).toEqual({ projectId: 7, milestoneId: 2, amountUsdc: 8400, network: "Arbitrum Sepolia", txHash: "0xrelease-7-2-8400" });
  });

  it("defaults every automated notification channel to enabled", () => {
    expect(defaultNotificationPreferences()).toEqual({ proofSubmitted: 1, milestoneApproved: 1, fundsReleased: 1, contributionReceived: 1 });
  });
});
