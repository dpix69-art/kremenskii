import React from "react";
import { createRoot } from "react-dom/client";
import { Router } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";

import { ContentProvider } from "@/content/ContentProvider"; // ← ДОБАВЛЕНО
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Router hook={useHashLocation}>
      <ContentProvider>         {/* ← ДОБАВЛЕНО */}
        <App />
      </ContentProvider>        {/* ← ДОБАВЛЕНО */}
    </Router>
  </React.StrictMode>
);
