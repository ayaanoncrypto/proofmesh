# ProofMesh Vercel deployment

## Full-stack Vercel target

ProofMesh now includes Vercel-compatible serverless entrypoints at `api/trpc/[trpc].ts` and `api/oauth/callback.ts`. The Vercel build serves the React frontend from `dist/public`, routes `/api/trpc/*` to the tRPC function, routes `/api/oauth/callback` to the OAuth function, and sends non-API routes to the SPA entrypoint.

Use the Vercel project settings below:

| Setting | Value |
| --- | --- |
| Framework | Vite |
| Build command | `pnpm build` |
| Output directory | `dist/public` |
| Install command | `pnpm install --frozen-lockfile` |
| Root directory | repository root |

## Required Vercel production variables

Configure these server-side variables in Vercel. Never expose server-only values in `VITE_*` variables.

`DATABASE_URL`, `JWT_SECRET`, `OAUTH_SERVER_URL`, `OWNER_OPEN_ID`, `OWNER_NAME`, `BUILT_IN_FORGE_API_URL`, `BUILT_IN_FORGE_API_KEY`, `VITE_APP_ID`, `VITE_APP_TITLE`, `VITE_APP_LOGO`, `VITE_OAUTH_PORTAL_URL`, `VITE_FRONTEND_FORGE_API_URL`, `VITE_FRONTEND_FORGE_API_KEY`, `VITE_ANALYTICS_ENDPOINT`, and `VITE_ANALYTICS_WEBSITE_ID` are required by the managed ProofMesh runtime. Add any configured Arbitrum server-side values only when used by a backend function. Do not add a browser wallet private key to Vercel.

Update the OAuth provider callback allowlist to use the production URL:

`https://proofmesh.site/api/oauth/callback`

If the custom domain is not verified yet, use the assigned Vercel production domain during testing and update the callback allowlist before going live.

## Arbitrum Sepolia wallet configuration

The browser wallet uses chain ID `421614`, MilestoneVault `0x0ad4Bb05Ee71c831E45d1AF9873498E52B83b35C`, and test pUSDC from the configured token contract. If Rabby reports Routeme or public RPC rate limits, edit Arbitrum Sepolia in Rabby and set the RPC URL to `https://sepolia-rollup.arbitrum.io/rpc`, then reconnect.

## Three validation passes

Run the production build and TypeScript checks. Call `/api/trpc/public.stats` and `/api/trpc/public.projects` on the deployed origin. Test OAuth callback and session state in a browser. Then connect a test wallet on Arbitrum Sepolia, verify ETH and pUSDC reads, request test pUSDC, submit a contribution, submit proof, run AI review, approve the milestone, release funds, and confirm Arbiscan transaction links and database records.

## Important distinction

Vercel deployments before the serverless entrypoints were added were frontend-only previews. They did not provide `/api/trpc` or `/api/oauth/callback`. A deployment is not ship-ready until the deployed origin returns a valid tRPC response and completes the OAuth session flow.
