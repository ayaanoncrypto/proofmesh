# GitHub and Vercel verification

## GitHub

Verified from the public repository page on 2026-08-19:

- Repository: `https://github.com/ayaanoncrypto/proofmesh`
- Branch: `main`
- Root commit shown: `5ad803e`, Upload complete ProofMesh source.
- Client directory commit shown: `cbf8980`, Upload complete ProofMesh source.
- `client/index.html` is visible in `https://github.com/ayaanoncrypto/proofmesh/tree/main/client`.

## Vercel

The local source passes `pnpm check`, `pnpm test`, and `pnpm build`. The public Vercel frontend URL previously reported by the user is `https://www.proofmesh.site/`. The repository includes `vercel.json` with SPA fallback guidance. Full-stack API and OAuth deployment remains supported through the validated Manus hosting path. Vercel is documented as a frontend preview path unless the backend is hosted separately.

## Demo video validation

The demo MP4 is rendered at `/home/ubuntu/proofmesh-proofmesh-demo.mp4` from verified ProofMesh screenshots. It uses H.264 video, yuv420p pixel format, 1280x720 output, and includes the root, public showcase, project detail, create flow, and funder views. Record voiceover or captions from `HACKATHON_SUBMISSION.md` before submitting if the HackQuest form requires narration.

## HackQuest upload checklist

1. Open the ProofMesh project page in HackQuest.
2. Paste the project intro from `HACKATHON_SUBMISSION.md`.
3. Upload `/home/ubuntu/webdev-static-assets/proofmesh-logo.png` as the project logo.
4. Upload `/home/ubuntu/proofmesh-proofmesh-demo.mp4` as the demo video.
5. Add `https://www.proofmesh.site/showcase` as the demo URL.
6. Add `https://github.com/ayaanoncrypto/proofmesh` as the source link.
7. Select Web3, Ethers, Node, React, and Solidity where the form allows those tags.
8. State that the live chain is Arbitrum Sepolia, Chain ID 421614, with testnet-only pUSDC.
