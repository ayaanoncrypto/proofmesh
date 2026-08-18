# ProofMesh Hosting Guide

## Recommended path for the full app

Use the Manus Publish button for ProofMesh. The current project uses one Express server for the React frontend, tRPC API, Manus OAuth callback, database access, notification procedures, and server-side integrations. Manus Publish preserves this architecture and its managed environment variables.

Before publishing, create a checkpoint, then click Publish in the project management panel. Use `/showcase` as the public judge route after publishing.

## Vercel limitation

The current ZIP is not a direct full-stack Vercel deployment. Vercel does not run the existing Express listener as a normal long-running server in the same way as the validated Manus runtime. A complete Vercel migration requires moving the tRPC procedures and OAuth callback into Vercel Functions, changing the server entrypoint, updating the database connection strategy, and changing OAuth callback URLs.

## Vercel frontend preview

Use Vercel for a frontend-only preview after connecting the API to a separately hosted backend.

1. Import the repository into GitHub, GitLab, or Bitbucket.
2. Create a Vercel project from the repository.
3. Set the framework preset to Vite.
4. Set the build command to `pnpm build`.
5. Set the output directory to `dist/public`.
6. Configure the frontend variables used by the client, including `VITE_APP_ID`, `VITE_OAUTH_PORTAL_URL`, `VITE_FRONTEND_FORGE_API_URL`, `VITE_FRONTEND_FORGE_API_KEY`, `VITE_ANALYTICS_ENDPOINT`, and `VITE_ANALYTICS_WEBSITE_ID`.
7. Point the frontend API base URL to the separately hosted ProofMesh backend.
8. Do not place `DATABASE_URL`, `JWT_SECRET`, `BUILT_IN_FORGE_API_KEY`, `ARBITRUM_SEPOLIA_PRIVATE_KEY`, or other server-only secrets in Vercel frontend variables.

## Live contract

Network: Arbitrum Sepolia
Chain ID: 421614
MilestoneVault: `0xCcae743386E01c8c2354c32C1676aE97e1938834`
Deployment transaction: `0x027f0c1a48858a18406ac28936ab2a40677ec5cc86d56b4730396974c3eb4984`
