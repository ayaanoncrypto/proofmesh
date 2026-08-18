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

- [ ] Diagnose the attached deployment error
- [ ] Apply and validate the required deployment fix
- [ ] Update custom-domain guidance for proofmesh.site

- [ ] Ensure the client source directory and client/index.html are present in the GitHub repository
- [ ] Validate the Vercel build from the repository contents
- [ ] Add proofmesh.site custom-domain instructions and routing guidance
