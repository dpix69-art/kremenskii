import { createRoot } from "react-dom/client";
import { ContentProvider } from "@/content/ContentProvider";
import App from "./App";
import "./index.css";

// No more hash routing — use browser history for SEO
// wouter uses browser location by default
createRoot(document.getElementById("root")!).render(
  <ContentProvider>
    <App />
  </ContentProvider>
);
