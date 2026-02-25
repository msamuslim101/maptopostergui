# Serverless Browser Feasibility (MapToPosterGUI)

## Quick verdict

**Yes — and if your goal is zero ongoing server cost, Option B (browser-first JS) should be the primary direction.**

The current app cannot run this way yet because it is desktop + local Python sidecar architecture.

## Current blockers in this repository

1. **Desktop process model:** Wails starts a bundled `python/server.exe` sidecar.
2. **Localhost coupling:** frontend targets `http://127.0.0.1:8000`.
3. **Python rendering engine:** OSMnx + matplotlib are backend/server oriented, not browser-native.

## Chosen direction: Option B (no server-cost architecture)

Build a browser-native renderer in TypeScript so poster generation happens entirely in the user’s browser.

### Target architecture

- **Data source:** OpenStreetMap vector/raster data requested directly from browser-compatible providers.
- **Renderer:** Canvas/WebGL/SVG pipeline in JS/TS.
- **Theme engine:** Reuse existing JSON theme definitions.
- **Export:** Client-side PNG export (`canvas.toBlob` / `toDataURL`).
- **Persistence:** Browser local storage / IndexedDB for presets and recent outputs.

### Cost implications

- **No app-owned rendering servers** (major cost saver).
- You may still have optional third-party map API usage costs depending on provider/traffic.
- If you stay on community/free endpoints, you must respect rate limits and fair-use policies.

## Is JS rewrite possible?

**Yes, practical and feasible.**

### Reusable from current project
- Theme JSON structure.
- Existing React/TypeScript UI and settings flows.

### Needs replacement/redesign
- OSMnx graph extraction flow.
- matplotlib cartographic styling and compositing.
- Font/layout parity tuning for print-quality output.

## Implementation plan (Option B-first)

1. **Extract shared theme schema**
   - Formalize and validate theme JSON in frontend TS types.
2. **Build browser map data adapter**
   - Provider abstraction (so you can swap map providers later).
3. **Create poster compositor in Canvas/WebGL**
   - Layers: background → water/parks/roads → gradient fades → labels.
4. **Client-only export**
   - High-DPI export with poster-size presets (18x24, A3, etc.).
5. **Quality parity pass**
   - Match 3-5 flagship themes to current Python output style.
6. **Remove hard backend dependency for web mode**
   - Keep Python path only as legacy desktop compatibility mode.

## Milestones (practical)

- **M1:** Browser prototype renders one city/theme and exports PNG.
- **M2:** 3 themes + portrait/landscape + text overlays.
- **M3:** Poster size presets + high-DPI export + performance tuning.
- **M4:** Public browser deployment without owned rendering backend.

## Progress started in this repository

- Frontend API base is now env-configurable (`VITE_API_BASE_URL`) to support web-hosted deployments.
- Added an experimental browser-side poster renderer scaffold (`wails-app/frontend/src/browser/renderer.ts`) as the Option B foundation.

## Recommendation

Given your requirement (**avoid server cost**), proceed with **Option B as the default roadmap** and treat the current Python backend as temporary legacy compatibility only.
