import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ContactsPageProps {
  email: string;
  city: string;
  country: string;
  introText?: string;
  openToText?: string;
}

export default function ContactsPage({
  email,
  city,
  country,
  introText = "Idea? Please write me an email.",
  openToText = "Open for exhibitions, collaborations and commissions."
}: ContactsPageProps) {
  const [emailCopied, setEmailCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setEmailCopied(true);
      // Analytics event
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'copy_email', {
          method: 'contact_page'
        });
      }
      setTimeout(() => setEmailCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy email:', err);
    }
  };

  const downloadPortfolio = () => {
    // Analytics event
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'download_portfolio', {
        bytes: 2400000, // 2.4 MB
        version: 'v2025.1'
      });
    }
    // Trigger download
    const link = document.createElement('a');
    link.href = '/files/kremenskii-portfolio.pdf';
    link.download = 'kremenskii-portfolio.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full">
      <div className="site-container">
        <div className="space-y-12">
          {/* First Row: Intro and Email */}
          <div className="grid-12">
            {/* Intro */}
            <div className="col-span-12 lg:col-span-6 space-y-6">
              <p className="text-lg text-foreground leading-relaxed">
                {introText}
              </p>
            </div>

            {/* Email & Portfolio */}
            <div className="col-span-12 lg:col-span-6 space-y-4">
              <h2 className="text-xl font-medium text-foreground">Email</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    onClick={copyEmail}
                    className="flex items-center gap-2 text-base"
                    data-testid="button-copy-email"
                  >
                    <span>{email}</span>
                    {emailCopied ? (
                      <Check size={16} className="text-green-600" />
                    ) : (
                      <Copy size={16} />
                    )}
                  </Button>
                  {emailCopied && (
                    <span className="text-sm text-muted-foreground">Email copied!</span>
                  )}
                </div>
                <div>
                  <Button
                    variant="default"
                    onClick={downloadPortfolio}
                    className="text-base"
                    data-testid="button-download-portfolio"
                  >
                    Download portfolio (PDF, 16.3 MB)
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Second Row: Location and Opportunities */}
          <div className="grid-12">
            {/* Location */}
            <div className="col-span-12 lg:col-span-6 space-y-4">
              <h2 className="text-xl font-medium text-foreground">Location</h2>
              <div className="text-base text-foreground">
                <p>{city}, {country}</p>
              </div>
            </div>

            {/* Opportunities */}
            <div className="col-span-12 lg:col-span-6 space-y-4">
              <h2 className="text-xl font-medium text-foreground">Opportunities</h2>
              <p className="text-base text-foreground leading-relaxed">
                {openToText}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}