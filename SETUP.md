# Wallet Integration Setup (Glyph + RainbowKit)

## What changed
- `index.html` — the invisible "Connect Wallet" hotspot button now opens a RainbowKit
  connect modal (offering Glyph's embedded wallet plus MetaMask, Coinbase Wallet,
  WalletConnect, etc.) instead of talking to `window.ethereum` directly.
- `src/WalletApp.jsx` — the actual wallet logic: sets up wagmi + RainbowKit + Glyph,
  and on a successful connection, switches the session to ApeChain, saves the wallet
  to `sessionStorage` under `cosmicDreamWallet`, and redirects to `journey.html` —
  same behavior as the old code, just wired through the new libraries.
- `src/wallet-widget.jsx` — mounts the above into `<div id="wallet-widget-root">`.
- `package.json`, `vite.config.js` — new build tooling. This site now needs a build
  step (it didn't before).

## Known gap — not yet handled
`journey.html` still checks `window.ethereum` directly for wallet status,
reconnect, and disconnect. That only works for browser-extension wallets, not
Glyph's embedded wallet. It needs the same wagmi-based treatment as `index.html`
before Glyph users can be recognized there. Flagging this so it isn't
forgotten — happy to do this next.

## Run it locally
```bash
npm install
npm run dev
```
Open the URL it prints (usually http://localhost:5173).

## Build for production
```bash
npm run build
```
This outputs static files to `dist/`.

## Deploy on Vercel
1. Push this folder to your GitHub repo (`TerencioV/cosmicdreambog`), replacing
   the old files.
2. In Vercel's project settings for this repo:
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. Redeploy.

## Credentials used
- Reown/WalletConnect Cloud Project ID: `e9304fee8b4533fd07f744a448681895`
  (hardcoded in `src/WalletApp.jsx` — fine for a project ID, it's not secret,
  but you can move it to a Vite env var later if you prefer).
- Glyph: no separate app ID/dashboard registration is required for this basic
  setup — `glyphConnectorDetails` ships built into the `@use-glyph/sdk-react`
  package itself.

## I could not test-build this here
This sandbox's network policy blocks npm's registry, so `npm install` /
`npm run build` could not be run and verified in this session. The code was
written by cross-referencing Yuga Labs' own official RainbowKit example
(https://github.com/yuga-labs/glyph-sdk-react/tree/main/examples/rainbowkit),
but please run `npm install && npm run build` locally (e.g. in VS Code) before
deploying, and let me know if anything errors — I'll fix it from the error
message.
