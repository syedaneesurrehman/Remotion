# Inflation – Remotion motion graphics

30-second, 1080p/30fps motion graphic about inflation.

- `npm start` – open Remotion Studio
- `npm run build` – render to `out/inflation.mp4`

The rendered video is committed at `out/inflation.mp4`. Chart and price figures are approximate/illustrative.

## Financial Literacy (60s, 9:16)

Vertical 1080x1920 / 30fps motion graphic synced to `voiceover/voiceover.mp3` (a copy lives in `public/`).

- `npm start` – open Remotion Studio and pick the `FinancialLiteracy` composition
- `npm run build:fl` – render to `out/financial-literacy.mp4`

Scenes (timed from `voiceover/voiceover.srt`): Hook, 4 money moves, 50/30/20 donut, safety net & debt, compound interest chart, CTA. Captions come from `src/fl/captions.ts`; a mint circle wipe covers each scene change. Chart figures are illustrative, and `@YourChannel` in the CTA is a placeholder. The narration is a placeholder espeak-ng voice; replace `public/voiceover.mp3` with a real recording and update scene start times in `src/FinancialLiteracy.tsx` and `src/fl/captions.ts` if the pacing changes.
