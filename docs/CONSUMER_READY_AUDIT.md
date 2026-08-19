# ProofMesh consumer-ready audit

Date: 2026-08-19

## Scope

This audit covers the browser wallet path, Arbitrum Sepolia contract configuration, pUSDC funding and release flow, backend transaction persistence, authentication boundaries, and the authenticated workspace queries.

## Findings

| Area | Result | Evidence in code |
|---|---|---|
| Network | Ready for Arbitrum Sepolia | `client/src/lib/wallet.ts` switches to chain ID 421614 and adds the network when MetaMask does not know it. |
| Vault | Configured for the token-aware `MilestoneVault` | `shared/contractConfig.ts` points to `0x0ad4Bb05Ee71c831E45d1AF9873498E52B83b35C`. |
| Test token | Configured for pUSDC | `shared/contractConfig.ts` includes the deployed token address, six decimals, ERC-20 ABI, and faucet ABI. |
| Wallet | Browser connection and balance read are live | `connectWallet()` and `readConnectedWallet()` read the wallet address, Sepolia ETH balance, and pUSDC balance. |
| Funding | Live approval plus vault contribution | `contributeOnchain()` approves the vault, waits for approval, then calls `vault.contribute(projectId, amount)`. |
| Release | Live milestone release | `releaseOnchain()` calls `vault.releaseMilestone(projectId, milestoneIndex)` and the UI persists the confirmed hash. |
| Backend | Real hashes accepted and stored | `server/routers.ts` accepts optional `txHash` values and uses them instead of demo hashes. |
| Explorer links | Arbiscan Sepolia links | Contribution and release records use `arbiscanTxUrl()`. |
| Auth | Public browsing, protected mutations | Public project queries remain open. Project creation, funding, proof actions, approvals, and releases use protected procedures. |
| Workspace status | Explicit loading and error banner | Authenticated query state is surfaced above the workspace views. |

## User prerequisites

Use a browser wallet such as MetaMask. Switch or approve the automatic switch to Arbitrum Sepolia. Keep a small amount of Arbitrum Sepolia ETH for gas. Use the in-app faucet to request test pUSDC. The funding flow asks for an ERC-20 approval before the vault contribution. The application does not request a seed phrase or private key.

The application is testnet-only. Users should keep real assets out of the wallet used for the demo. A failed transaction should be retried only after checking the selected network, Sepolia ETH balance, and pUSDC balance.

## Validation

The project passes TypeScript checks, the Vitest suite with 10 tests, the production build, and desktop and mobile preview checks. The live browser flow still requires a user wallet signature because the sandbox has no personal wallet session.
