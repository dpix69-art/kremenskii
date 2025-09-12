interface Exhibition {
  year: string;
  event: string;
}

interface StatementPageProps {
  portraitImageUrl: string;
  statement: string[];
  exhibitions: Exhibition[];
  portraitPosition?: 'left' | 'right';
  email?: string;
}

export default function StatementPage({
  portraitImageUrl,
  statement,
  exhibitions,
  portraitPosition = 'left',
  email = 'hi@example.art'
}: StatementPageProps) {
  const downloadPressKit = () => {
    // Analytics event
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'press_kit_open', {
        method: 'statement_page'
      });
    }
    // Trigger download or open press kit page
    const link = document.createElement('a');
    link.href = '/files/press-kit.pdf';
    link.download = 'artist-press-kit.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      // Analytics event
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'copy_email', {
          method: 'statement_page'
        });
      }
      // Could add toast notification here
    } catch (err) {
      console.error('Failed to copy email:', err);
    }
  };
  return (
    <div className="w-full py-12 pt-[0px] pb-[0px]">
      <div className="site-container">
        {/* Portrait and Statement */}
        <div className="grid-12 mb-16">
          {/* Portrait Image */}
          <div className={`col-span-12 lg:col-span-5 space-y-4 ${portraitPosition === 'right' ? 'lg:order-2' : 'lg:order-1'}`}>
            <div className="aspect-[4/5] overflow-hidden rounded-md bg-muted">
              <img
                src={portraitImageUrl}
                alt="Artist portrait"
                className="w-full h-full object-cover"
                data-testid="img-artist-portrait"
              />
            </div>
          </div>

          {/* Statement Text */}
          <div className={`col-span-12 lg:col-span-7 space-y-6 ${portraitPosition === 'right' ? 'lg:order-1' : 'lg:order-2'}`}>
            <h1 
              id="page-title"
              tabIndex={-1}
              className="text-type-h1 font-semibold text-foreground"
            >
              Statement
            </h1>
            <div className="prose prose-lg max-w-none">
              {statement.map((paragraph, index) => (
                <p key={index} className="text-type-body text-foreground leading-relaxed mb-6">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Selected Exhibitions */}
        <div className="space-y-8">
          <h2 className="text-type-h2 font-semibold text-foreground">
            Selected Exhibitions & Performances
          </h2>
          <div className="space-y-4">
            {exhibitions.map((exhibition, index) => (
              <div key={index} className="flex flex-col sm:flex-row sm:gap-8" data-testid={`exhibition-${index}`}>
                <div className="text-type-body text-muted-foreground font-medium min-w-[4rem]">
                  {exhibition.year}
                </div>
                <div className="text-type-body text-foreground">
                  {exhibition.event}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Press & Contact */}
        {/* <div className="grid-12 pt-8 border-t border-border">
          <div className="col-span-12 lg:col-span-6 space-y-4">
            <h2 className="text-type-h2 font-semibold text-foreground">Press</h2>
            <p className="text-type-body text-muted-foreground">
              Statement PDF + high-resolution press images
            </p>
            <button
              onClick={downloadPressKit}
              className="text-type-body text-foreground underline hover:text-muted-foreground transition-colors"
              data-testid="button-press-kit"
            >
              Download press kit
            </button>
          </div>
          
          <div className="col-span-12 lg:col-span-6 space-y-4">
            <h2 className="text-type-h2 font-semibold text-foreground">Contact</h2>
            <button
              onClick={copyEmail}
              className="text-type-body text-foreground underline hover:text-muted-foreground transition-colors"
              data-testid="button-copy-email-statement"
            >
              {email}
            </button>
          </div>
        </div> */}
      </div>
    </div>
  );
}