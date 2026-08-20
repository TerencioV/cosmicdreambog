import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import JourneyApp from "./JourneyApp.jsx";

const mountEl = document.getElementById("wallet-widget-root");

if (mountEl) {
  createRoot(mountEl).render(
    <StrictMode>
      <JourneyApp />
    </StrictMode>
  );
}
