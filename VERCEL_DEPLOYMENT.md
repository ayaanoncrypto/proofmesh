# ProofMesh Hosting Guide

## Recommended path for the full app

Use the Manus Publish button for ProofMesh. The current project uses one Express server for the React frontend, tRPC API, Manus OAuth callback, database access, notification procedures, and server-side integrations. Manus Publish preserves this architecture and its managed environment variables.

Before publishing, create a checkpoint, then click Publish in the project management panel. Use `/showcase` as the public judge route after publishing.

## Vercel limitation

The current ZIP is not a direct full-stack Vercel deployment. Vercel does not run the existing Express listener as a normal long-running server in the same way as the validated Manus runtime. A complete Vercel migration requires moving the tRPC procedures and OAuth callback into Vercel Functions, changing the server entrypoint, updating the database connection strategy, and changing OAuth callback URLs.

## Fix for the current Vercel error

The prior log showed `Could not resolve entry module "client/index.html"`. The corrected source package includes the `client` directory and `client/index.html`. If Vercel still reports this error, confirm the GitHub repository root contains `client/index.html` before redeploying. Upload the complete source package, including the `client`, `contracts`, `drizzle`, `scripts`, `server`, and `shared` directories. Do not upload only root files.

The safest update method is GitHub Desktop. Add the extracted ProofMesh folder as the local repository, review that `client/index.html` appears in the changed files, commit the changes, and push to the `main` branch. Then redeploy the Vercel project.

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

## Custom domain: proofmesh.site

After a successful Vercel deployment, open Project Settings, choose Domains, and add `proofmesh.site`. Vercel will display the DNS records required for verification. At your domain registrar, add the exact records Vercel provides. Use the root domain record for `proofmesh.site` and add `www.proofmesh.site` only if you want the www address. Wait for DNS verification, then set the verified domain as the primary domain. Test both `https://proofmesh.site/showcase` and the root URL.

## Live contract

Network: Arbitrum Sepolia
Chain ID: 421614
MilestoneVault: `0x0ad4Bb05Ee71c831E45d1AF9873498E52B83b35C`
Token-aware vault deployment transaction: recorded in `contracts/testnet.deployment.json` and verified against the active configuration.
