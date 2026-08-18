# ProofMesh Hackathon Submission

## One-line pitch

ProofMesh makes project funding milestone-native. Builders show evidence, funders see the trail, and capital releases against verified progress.

## Three-minute demo script

Start at `/showcase` without signing in. Point to the three seeded projects and the public stats. Explain that the judge sees the full funding loop without a login wall.

Open SignalGarden. Show the funding progress, category, creator label, and milestone timeline. Point to the proof URL on the submitted milestone. Explain that ProofMesh accepts GitHub, demo, and IPFS evidence.

Click Run AI proof review after signing in. Show the structured recommendation and confidence returned by the server-side review flow. Explain that the review is an assistant, not a replacement for a funder or designated approver.

Click Approve, then Release funds. Point to the generated transaction log and the Arbitrum Sepolia contract configuration. Explain that the current demo uses a database-backed release log until a real wallet deploys `MilestoneVault.sol`.

Open the funding panel. Enter a pledge amount and record the contribution. Show the pledge status in the funder view and the creator notification in the workspace.

Open `/create`. Enter a project title, description, category, goal, and three milestone records. Show the exact amount allocation check. Add a fourth or fifth milestone to demonstrate the one-to-five milestone constraint.

Finish in `/dashboard`. Show the project ledger, activity stream, notification center, release ledger, and notification preference action.

## Submission checklist

| Item | Status |
| --- | --- |
| Public showcase route works without authentication | Ready |
| Project categories match the brief | Ready |
| Milestone states match the brief | Ready |
| Project states match the brief | Ready |
| Custom one-to-five milestone creation flow | Ready |
| Proof URL and proof description flow | Ready |
| Structured AI review API | Ready |
| Approval and release mutation flow | Ready |
| Contribution amount input and pledge record | Ready |
| Notification center and preference API | Ready |
| MilestoneVault.sol source | Ready |
| Shared ABI and deployment address config | Ready |
| Demo seed script | Ready |
| Arbitrum Sepolia contract deployment | Wallet step required |
| Replace zero deployment address with live address | Wallet step required |
| Run `pnpm check`, `pnpm test`, and `pnpm build` | Run before submission |

## Final live-chain step

Deploy `contracts/MilestoneVault.sol` to Arbitrum Sepolia, update `shared/contractConfig.ts`, test with a deployer wallet and a separate funder wallet, then capture one real release transaction for the submission video.
