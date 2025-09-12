// client/src/main.tsx
import React from "react";
import { createRoot } from "react-dom/client";
import { Router } from "wouter";
import { useHashLocation } from "wouter/use-hash-location"; // ← ИМЕНОВАННЫЙ импорт

import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Router hook={useHashLocation}>
      <ContentProvider>
        <App />
      </ContentProvider>
    </Router>
  </React.StrictMode>
);
