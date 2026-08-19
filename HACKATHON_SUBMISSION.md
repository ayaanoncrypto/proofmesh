# ProofMesh HackQuest submission

## Project intro

ProofMesh is a milestone-based funding platform for builders, grant programs, and communities. Funders pledge testnet pUSDC. Builders publish evidence. Approvers release escrowed capital only after a milestone passes review. Every confirmed transaction links to Arbiscan on Arbitrum Sepolia.

## Three-minute demo script

Start at `https://proofmesh.site/showcase`. Show the public project index, seeded projects, milestone states, and public stats. Explain that judges can inspect the product without signing in.

Open SignalGarden. Show funding progress, creator information, proof links, and the milestone timeline. Run the AI proof review after signing in. Explain that the review produces structured checks and a recommendation for the funder or designated approver.

Open the testnet wallet panel. Connect MetaMask. ProofMesh switches to Arbitrum Sepolia, shows Sepolia ETH and pUSDC balances, and provides a pUSDC faucet. Explain that the wallet must hold Sepolia ETH for gas and that the demo uses testnet assets only.

Enter a pledge amount and click Fund with pUSDC. Approve the ERC-20 allowance in the wallet, then confirm the vault contribution. Show the stored transaction hash and its Arbiscan link in the funder history.

For a creator flow, open the workspace and approve an eligible milestone. Click Release funds. Confirm the MilestoneVault transaction, show the persistent confirmation banner, and open the Arbiscan transaction link.

Open `/create`. Define a title, description, category, funding goal, and one to five milestones. Show the exact allocation check. With a connected wallet, the database project record is followed by the on-chain vault creation call.

Finish in `/dashboard`. Show the project ledger, activity stream, notification center, wallet panel, release ledger, and transaction links.

## Submission checklist

| Item | Status |
| --- | --- |
| Public showcase route works without authentication | Ready |
| Project categories and milestone states match the brief | Ready |
| Custom one-to-five milestone creation flow | Ready |
| Proof URL and proof description flow | Ready |
| Structured AI proof review | Ready |
| Approval and release flow | Ready |
| Real browser wallet connection | Ready on Arbitrum Sepolia |
| pUSDC balance and faucet | Ready on Arbitrum Sepolia |
| ERC-20 approval and vault contribution | Ready on Arbitrum Sepolia |
| MilestoneVault release transaction | Ready on Arbitrum Sepolia |
| Arbiscan links for confirmed transactions | Ready |
| Notifications and preference API | Ready |
| MilestoneVault.sol and TestUSDC.sol source | Ready |
| Live token-aware MilestoneVault deployment | Ready |
| Demo video | Record using the script above |

## Live contract configuration

Network: Arbitrum Sepolia

Chain ID: 421614

MilestoneVault: `0x0ad4Bb05Ee71c831E45d1AF9873498E52B83b35C`

pUSDC token: `0xe8aB63...Ce5`, use the exact address shown in `shared/contractConfig.ts` for wallet configuration.

## Consumer safety

ProofMesh is testnet-only for this submission. Keep real assets out of the demo wallet. The application never asks for a seed phrase or private key. Users need Sepolia ETH for gas and pUSDC for funding.
