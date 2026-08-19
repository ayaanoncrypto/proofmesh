# ProofMesh production failure audit

## Root cause

The live Vercel deployment serves the Vite frontend only. ProofMesh expects the React client, Express server, tRPC API, OAuth callback, database, notifications, and server-side integrations to run behind the same origin.

The frontend calls `/api/trpc` with credentials. Login also redirects to `/api/oauth/callback` on the current site origin. A static Vercel build does not provide these Express routes. As a result, the page shell and public seeded fallback content render, but authenticated workspace queries, project creation, proof submission, AI review, approval, release persistence, and notification flows fail after login.

The browser wallet RPC rate-limit issue is separate. The wallet helper now reads native and pUSDC balances through two Arbitrum Sepolia RPC endpoints, with recovery after the first endpoint fails. That fix is present in GitHub commit `6c77180` and Vercel production deployment `4vYUiEbSzAisH62riJZu8oeQnMk5`.

## Correct production architecture

ProofMesh must run through the managed full-stack runtime, where the Express server serves both the built React client and `/api/trpc` and `/api/oauth/callback`. The existing Manus project already has this architecture, managed database, authentication, secrets, and server integrations. The correct final deployment action is the project Management UI Publish flow, not a static Vercel frontend-only deployment.

## User-visible impact

The existing Vercel URL remains useful as a visual frontend preview. It is not a complete consumer deployment. A functional production release requires the full-stack host and a domain pointed to that deployment. No wallet seed phrase or private key is required for the fix.
