export const MILESTONE_VAULT_CONFIG = {
  chainId: 421614,
  networkName: "Arbitrum Sepolia",
  deploymentAddress: "0xCcae743386E01c8c2354c32C1676aE97e1938834",
  contractName: "MilestoneVault",
  abi: [
    { type: "function", name: "createProject", stateMutability: "nonpayable", inputs: [{ name: "projectId", type: "uint256" }, { name: "milestoneAmounts", type: "uint256[]" }], outputs: [] },
    { type: "function", name: "contribute", stateMutability: "payable", inputs: [{ name: "projectId", type: "uint256" }], outputs: [] },
    { type: "function", name: "releaseMilestone", stateMutability: "nonpayable", inputs: [{ name: "projectId", type: "uint256" }, { name: "milestoneId", type: "uint256" }], outputs: [] },
    { type: "event", name: "FundsReleased", anonymous: false, inputs: [{ indexed: true, name: "projectId", type: "uint256" }, { indexed: true, name: "milestoneId", type: "uint256" }, { indexed: false, name: "amount", type: "uint256" }] },
  ],
} as const;
