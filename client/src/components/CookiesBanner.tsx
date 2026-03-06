import { useState, useEffect } from "react";

export default function CookiesBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem("cookies-accepted")) {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border px-4 py-3 flex items-center justify-center gap-4 text-type-small text-muted-foreground">
      <span>This site uses essential cookies only.</span>
      <button
        onClick={() => {
          localStorage.setItem("cookies-accepted", "1");
          setVisible(false);
        }}
        className="px-4 py-1.5 bg-foreground text-background rounded-sm text-type-small font-medium hover:opacity-85 transition-opacity"
      >
        Accept
      </button>
    </div>
  );
}
