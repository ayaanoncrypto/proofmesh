# ProofMesh

ProofMesh is a milestone-based project funding platform for builders who need capital and funders who need evidence. A project defines deliverables, contributors pledge USDC, creators submit proof URLs, AI produces a structured review, and approved milestones create a release record tied to the MilestoneVault contract.

## Why this entry is competitive

ProofMesh targets a concrete coordination problem: early-stage teams often receive funding before progress becomes easy to inspect. The product makes progress legible. The public showcase removes the login wall for judges, while the workspace shows the full pledge, proof, approval, and release loop.

The demo is designed around four judging signals: smart contract quality, product-market fit, innovation, and real problem solving. The UI presents a clear protocol loop and the backend stores an auditable release trail.

## Demo route

Open `/showcase` for the public judge experience. Open `/explore` for project browsing. Open `/create` for the authenticated project flow. Open `/dashboard` for the workspace view.

## Product architecture

The React frontend uses the ProofMesh blueprint visual system. The Express and tRPC backend handles authenticated mutations and public read queries. Drizzle models projects, milestones, contributions, proof reviews, releases, and notifications. `contracts/MilestoneVault.sol` contains the Solidity escrow contract. `shared/contractConfig.ts` exposes the ABI, Arbitrum Sepolia chain ID, and deployment address to the frontend.

AI review uses the server-side built-in LLM helper with structured JSON output. The review checks evidence specificity, link quality, deliverable fit, and reproducibility. Notifications are created as part of proof submission, contribution, approval, and release events.

## Demo data

Run the seeder after the database is available:

```bash
node scripts/seed-demo.mjs
```

The seeder adds SignalGarden, Transit Mesh, and Mosaic Social with milestones, pledges, proof URLs, approvals, releases, and activity records.

## Live contract deployment

The current app uses Arbitrum Sepolia-ready contract configuration and simulated release transaction logs. To qualify for the live buildathon submission, deploy `contracts/MilestoneVault.sol` to Arbitrum Sepolia, replace `deploymentAddress` in `shared/contractConfig.ts`, and connect the wallet flow to the contract methods `createProject`, `contribute`, and `releaseMilestone`. Test with a funded deployer and a separate funder wallet before submitting.

The deployment address intentionally starts as the zero address until a real wallet deploys the contract. No fake deployment is presented as live.

## Verification commands

```bash
pnpm check
pnpm test
pnpm build
```
