import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export default function CookiesBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already accepted cookies
    const cookiesAccepted = localStorage.getItem('cookies-accepted');
    if (!cookiesAccepted) {
      // Show banner after a brief delay for better UX
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookies-accepted', 'true');
    setIsVisible(false);
  };

  const rejectCookies = () => {
    localStorage.setItem('cookies-accepted', 'false');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-t border-border z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1">
            <p className="text-sm text-foreground">
              This website uses essential cookies to ensure proper functionality. No tracking or marketing cookies are used.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={rejectCookies}
              data-testid="button-reject-cookies"
            >
              Reject
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={acceptCookies}
              data-testid="button-accept-cookies"
            >
              Accept
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={rejectCookies}
              className="shrink-0"
              data-testid="button-close-cookies"
            >
              <X size={16} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}