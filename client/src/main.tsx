import { hydrateRoot, createRoot } from "react-dom/client";
import { ContentProvider } from "@/content/ContentProvider";
import App from "./App";
import "./index.css";

const root = document.getElementById("root")!;

// If the root has pre-rendered HTML, hydrate (preserves SEO content until React takes over).
// Otherwise, fresh render (dev mode).
const app = (
  <ContentProvider>
    <App />
  </ContentProvider>
);

if (root.children.length > 0) {
  hydrateRoot(root, app);
} else {
  createRoot(root).render(app);
}