# Project TODO

- [x] Define ProofMesh product architecture and judging strategy
- [x] Build blueprint-inspired visual design system and responsive app shell
- [x] Create public landing page with hero, live stats, and project/funding CTAs
- [x] Add project creation flow with exact categories and up to 5 milestones
- [x] Add project explorer with search, category filter, progress, milestone count, and exact project statuses
- [x] Add public project detail page with milestone timeline and funder list
- [x] Add milestone proof submission with URL and description
- [x] Add AI-assisted proof review with structured recommendation and reviewer rationale
- [x] Add milestone approval and release flow with exact milestone statuses
- [x] Add funder contribution flow with pledge amount and contribution history
- [x] Add contribution history with pledge amounts and milestone release status
- [x] Add creator dashboard with projects, funding progress, and milestone states
- [x] Add funder dashboard with funded projects, pledge totals, and release tracking
- [x] Add notification center for proof submissions, approvals, releases, and funding events
- [x] Add automated notification records and user notification preferences
- [x] Add MilestoneVault.sol contract source with milestone escrow and release functions
- [x] Add shared contract ABI and deployment address configuration for frontend access
- [x] Add contract call log and simulated on-chain release records
- [x] Add demo data seeder with realistic projects, milestones, funders, proofs, and activity
- [x] Add public showcase route accessible without authentication
- [x] Add loading, empty, error, and accessibility states across major flows
- [x] Add Vitest coverage for project, milestone, contribution, notification, AI review, and contract log behavior
- [x] Run type checks, tests, and visual verification at desktop and mobile sizes
- [x] Prepare pitch copy, demo script, README, and hackathon submission checklist
- [x] Document live Arbitrum deployment steps and required wallet/network configuration

- [x] Wire custom 1-5 milestone creation fields with title, description, proof URL, and USDC amount
- [x] Add exact API milestone counts and live project detail data to explorer cards
- [x] Add a dedicated public project detail route backed by live project data
- [x] Connect proof submission URL and description to the backend mutation
- [x] Connect AI proof review to the UI and surface structured recommendation and rationale
- [x] Connect approval and release actions to backend mutations and status transitions
- [x] Connect contribution amount input and show contribution history with release status
- [x] Add creator and funder dashboard lists with live project and pledge data
- [x] Add visible notification center backed by notification queries
- [x] Add notification preference model and UI
- [x] Expand demo seeder with proof reviews and notifications
- [x] Expand Vitest behavior coverage for core ProofMesh workflows
- [x] Run mobile-size visual verification
- [x] Add a demo script and hackathon submission checklist file

- [x] Add visible release ledger and contract call log backed by release records
- [x] Surface AI review rationale and checks in the project detail interface
- [x] Refresh project detail data after approval and release actions
- [x] Replace hardcoded contribution history with live pledges and release status
- [x] Add a dedicated funder dashboard with funded projects and release tracking
- [x] Add actual notification preference toggles wired to the preferences API

- [x] Bind the contract call log to live release records
- [x] Replace the project-detail funder list with live contribution records and per-pledge release status
- [x] Add a dedicated funder dashboard route with totals and release tracking
- [x] Hydrate notification preference toggles from the saved preferences query

- [x] Bind project-detail funders to live contribution data for every detail entry
- [x] Derive per-pledge release status from backend release data instead of placeholder labels

- [x] Store and update released USDC per contribution so project-detail pledge status is contribution-specific

- [x] Deploy MilestoneVault.sol to Arbitrum Sepolia
- [x] Verify the deployed contract and record the transaction and address
- [x] Update shared frontend contract configuration with the live address
- [x] Validate ProofMesh after the live contract configuration update

- [x] Prepare a clean final ProofMesh ZIP archive for external hosting
- [x] Validate the final archive contents and build metadata
- [x] Provide Vercel deployment steps and required environment variables

- [x] Rebuild the final ZIP excluding .manus and checkpoint artifacts
- [x] Validate the ZIP against a forbidden-path check
- [x] Clarify the exact Vercel limitation and recommended full-stack hosting path

- [x] Fix the missing patched dependency reference that breaks Vercel install
- [x] Validate Vercel-compatible install and production build
- [x] Prepare a corrected ZIP and GitHub replacement instructions

- [x] Validate the Vercel fix with a clean install outside the existing node_modules
- [x] Deliver the corrected Vercel ZIP and explicit GitHub replacement steps

- [x] Send the corrected Vercel ZIP to the user
- [x] Provide explicit GitHub replacement steps before retrying Vercel

- [x] Diagnose the attached deployment error
- [x] Apply and validate the required deployment fix
- [x] Update custom-domain guidance for proofmesh.site

- [x] Ensure the client source directory and client/index.html are present in the GitHub repository
- [x] Validate the Vercel build from the repository contents
- [x] Add proofmesh.site custom-domain instructions and routing guidance

- [x] Confirm GitHub contains client/index.html after the replacement upload
- [x] Confirm Vercel succeeds from the updated GitHub commit

- [x] Add a Vercel SPA fallback so /showcase and other client routes resolve directly
- [x] Validate the Vercel configuration and production build
- [x] Package the route fix and provide redeployment steps for proofmesh.site

- [x] Prepare HackQuest project intro copy
- [x] Create a ProofMesh logo asset for the submission form
- [x] Prepare a concise demo-video recording script and upload checklist

- [x] Produce a short ProofMesh demo video for HackQuest
- [x] Include the public showcase, proof review, funding flow, and Arbitrum Sepolia deployment story
- [x] Validate the MP4 and provide upload instructions

- [x] Audit current wallet, contract, funding, release, auth, and API behavior
- [x] Add real browser wallet connection on Arbitrum Sepolia
- [x] Add testnet USDC configuration, balance display, and faucet guidance
- [x] Add real MilestoneVault contribution transaction flow
- [x] Add real milestone release transaction flow with confirmation states
- [x] Add transaction history links to Arbiscan Sepolia
- [x] Harden authenticated workspace loading and error states
- [x] Add consumer-ready onboarding, network switching, and wallet safety copy
- [x] Add Vitest coverage for wallet and transaction state utilities
- [x] Run full typecheck, tests, production build, and responsive QA
- [x] Update regression tests for the new token-aware MilestoneVault deployment address
- [x] Document the wallet, contract, auth, and API audit findings
- [x] Add explicit pending and success UI states for milestone releases
- [x] Make every displayed transaction hash clickable on Arbiscan Sepolia
- [x] Add explicit loading and error states to authenticated workspaces
- [x] Expand testnet safety, approval, network switching, and recovery guidance
- [x] Expand Vitest coverage for wallet network switching and transaction behavior
- [x] Add persistent release success state and refresh modal data after release
- [x] Link project-detail fallback transaction hashes to Arbiscan
- [x] Add focused tests for contribution and release confirmation behavior
- [x] Refresh selected modal state after invalidated project data loads
- [x] Test contributeOnchain and releaseOnchain confirmation paths
- [x] Reset release success state when opening or closing project modals
- [x] Add direct tests for contributeOnchain and releaseOnchain

- [x] Guide Vercel frontend deployment for proofmesh.site
- [x] Verify the Vercel deployment and SPA routes after user login or manual steps
- [x] Push the latest ProofMesh source to the public GitHub repository and confirm the Vercel commit
- [x] Verify the user-reported origin push on the public GitHub main branch
- [x] Sync the latest checkpoint source to GitHub with user takeover when required
- [x] Check for GitHub Desktop or supported local GitHub tooling
- [x] Inspect the user-uploaded ZIP for complete ProofMesh source and forbidden secrets
- [x] Re-verify root, showcase, project detail, and create routes after the latest-source redeploy
- [x] Verify the latest-source Vercel deployment on all key production routes
- [x] Prepare the validated ZIP source for safe GitHub replacement
- [x] Use GitHub web folder upload or Management UI export because GitHub Desktop is unavailable
- [x] Fix Arbitrum Sepolia RPC rate-limit failure during wallet login
- [x] Add RPC fallback and wallet balance recovery messaging
- [x] Test wallet login and balance reads against the updated RPC path
- [ ] Push the RPC fallback fix to GitHub and verify Vercel redeploy
- [x] Add focused tests for first-RPC failure and second-RPC recovery
- [ ] Retest connectWallet and balance loading with a real Arbitrum Sepolia wallet
- [ ] Document the real-wallet verification result
