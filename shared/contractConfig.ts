export const MILESTONE_VAULT_CONFIG = {
  chainId: 421614,
  networkName: "Arbitrum Sepolia",
  deploymentAddress: "0x0ad4Bb05Ee71c831E45d1AF9873498E52B83b35C",
  tokenAddress: "0xe8aB63b408735df6DaC9DDf197AaCFF3b66e1Ce5",
  tokenSymbol: "pUSDC",
  tokenDecimals: 6,
  explorerBaseUrl: "https://sepolia.arbiscan.io",
  contractName: "MilestoneVault",
  abi: [
    { type: "function", name: "createProject", stateMutability: "nonpayable", inputs: [{ name: "projectId", type: "uint256" }, { name: "milestoneAmounts", type: "uint256[]" }], outputs: [] },
    { type: "function", name: "contribute", stateMutability: "nonpayable", inputs: [{ name: "projectId", type: "uint256" }, { name: "amount", type: "uint256" }], outputs: [] },
    { type: "function", name: "releaseMilestone", stateMutability: "nonpayable", inputs: [{ name: "projectId", type: "uint256" }, { name: "milestoneId", type: "uint256" }], outputs: [] },
    { type: "function", name: "token", stateMutability: "view", inputs: [], outputs: [{ name: "", type: "address" }] },
    { type: "event", name: "FundsReleased", anonymous: false, inputs: [{ indexed: true, name: "projectId", type: "uint256" }, { indexed: true, name: "milestoneId", type: "uint256" }, { indexed: true, name: "recipient", type: "address" }, { indexed: false, name: "amount", type: "uint256" }] },
    { type: "event", name: "ContributionReceived", anonymous: false, inputs: [{ indexed: true, name: "projectId", type: "uint256" }, { indexed: true, name: "funder", type: "address" }, { indexed: false, name: "amount", type: "uint256" }] },
  ],
  tokenAbi: [
    { type: "function", name: "faucet", stateMutability: "nonpayable", inputs: [], outputs: [] },
    { type: "function", name: "approve", stateMutability: "nonpayable", inputs: [{ name: "spender", type: "address" }, { name: "amount", type: "uint256" }], outputs: [{ name: "", type: "bool" }] },
    { type: "function", name: "balanceOf", stateMutability: "view", inputs: [{ name: "account", type: "address" }], outputs: [{ name: "", type: "uint256" }] },
    { type: "function", name: "decimals", stateMutability: "view", inputs: [], outputs: [{ name: "", type: "uint8" }] },
  ],
} as const;
