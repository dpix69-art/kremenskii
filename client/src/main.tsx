import { createRoot } from "react-dom/client";
import { Router } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { ContentProvider } from "@/content/ContentProvider";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <ContentProvider>
    <Router hook={useHashLocation}>
      <App />
    </Router>
  </ContentProvider>
);
