# Netlify Deployment Guide (Current State)

## Can this project be uploaded to Netlify yet?

**Yes, partially.**

You can deploy the React frontend to Netlify right now.
However, the current "Generate Poster" flow still expects backend API routes unless the browser-renderer flow is wired into the UI.

## Current readiness matrix

- ✅ Static frontend hosting on Netlify
- ✅ SPA route fallback support (`netlify.toml`)
- ⚠️ Poster generation requires API unless Option B renderer is integrated into App flow
- ⚠️ Zero-server-cost end-to-end not complete yet

## Netlify setup steps

1. Connect repository and set frontend base directory to:
   - `wails-app/frontend`
2. Build command:
   - `npm run build`
3. Publish directory:
   - `dist`
4. Environment variable (recommended if using API backend):
   - `VITE_API_BASE_URL=https://your-api.example.com`

## Why generation may fail after deploy

The app currently calls backend endpoints (`/api/themes`, `/api/generate`, `/api/jobs/:id`).
If those endpoints are unavailable from Netlify site origin and no `VITE_API_BASE_URL` is configured, generation requests will fail.

## What to implement next for full browser-only mode

1. Wire `src/browser/renderer.ts` into `App.tsx` as a selectable generation path.
2. Add export/download UI using `exportCanvasToPng`.
3. Keep backend flow as optional "legacy/high-fidelity" mode.

