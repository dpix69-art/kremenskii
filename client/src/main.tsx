// client/src/main.tsx
import React from "react";
import { createRoot } from "react-dom/client";
import { Router } from "wouter";
// ВНУЖНО: у вашей версии wouter — ИМЕНОВАННЫЙ экспорт:
import { useHashLocation } from "wouter/use-hash-location";

import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Router hook={useHashLocation}>
      <App />
    </Router>
  </React.StrictMode>
);
