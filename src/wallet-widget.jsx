import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import WalletApp from "./WalletApp.jsx";

const mountEl = document.getElementById("wallet-widget-root");

if (mountEl) {
  createRoot(mountEl).render(
    <StrictMode>
      <WalletApp />
    </StrictMode>
  );
}
