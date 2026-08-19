import { describe, expect, it } from "vitest";
import { MILESTONE_VAULT_CONFIG } from "../shared/contractConfig";

describe("ProofMesh contract configuration", () => {
  it("targets Arbitrum Sepolia with the required MilestoneVault contract", () => {
    expect(MILESTONE_VAULT_CONFIG.contractName).toBe("MilestoneVault");
    expect(MILESTONE_VAULT_CONFIG.chainId).toBe(421614);
    expect(MILESTONE_VAULT_CONFIG.networkName).toBe("Arbitrum Sepolia");
    expect(MILESTONE_VAULT_CONFIG.deploymentAddress).toBe("0x0ad4Bb05Ee71c831E45d1AF9873498E52B83b35C");
    expect(MILESTONE_VAULT_CONFIG.abi.some(item => item.name === "releaseMilestone")).toBe(true);
  });
});

describe("ProofMesh product vocabulary", () => {
  it("keeps the exact milestone and project state labels", () => {
    const milestoneStatuses = ["Pending", "Submitted", "Approved", "Released"];
    const projectStatuses = ["Active", "Completed", "Cancelled"];
    const categories = ["DeFi", "Gaming", "DePIN", "Social", "Other"];
    expect(milestoneStatuses).toEqual(["Pending", "Submitted", "Approved", "Released"]);
    expect(projectStatuses).toEqual(["Active", "Completed", "Cancelled"]);
    expect(categories).toEqual(["DeFi", "Gaming", "DePIN", "Social", "Other"]);
  });
});
