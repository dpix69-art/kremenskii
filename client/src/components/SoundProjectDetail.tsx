interface Track {
  title: string;
  duration: string;
  externalLink?: string;
}

interface SoundProjectDetailProps {
  title: string;
  year: string;
  location: {
    city: string;
    country: string;
    institution: string;
  };
  coverImageUrl: string;
  bodyBlocks: Array<{
    type: 'h2' | 'p';
    text: string;
  }>;
  tracks: Track[];
  meta?: {
    label?: string;
    platforms?: string[];
  };
  embeddedPlayerUrl?: string;
}

export default function SoundProjectDetail({
  title,
  year,
  location,
  coverImageUrl,
  bodyBlocks,
  tracks,
  meta,
  embeddedPlayerUrl
}: SoundProjectDetailProps) {
  const handlePlaySound = (trackTitle: string) => {
    // Analytics event
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'play_sound', {
        project: title,
        track: trackTitle
      });
    }
  };
  return (
    <div className="w-full py-12">
      <div className="site-container">
        <div className="space-y-12">
          {/* Header */}
          <div className="space-y-6">
            <h1 
              id="project-title"
              tabIndex={-1}
              className="text-type-h1 font-semibold text-foreground leading-tight"
            >
              {title}
            </h1>
            <div className="space-y-2">
              <p className="text-type-body text-foreground">{year}</p>
              <p className="text-type-body text-muted-foreground">
                {location.institution}, {location.city}, {location.country}
              </p>
            </div>
          </div>

          {/* Embedded Player - First */}
          {embeddedPlayerUrl && (
            <div className="space-y-4">
              <h3 className="text-type-h3 font-medium text-foreground">Listen</h3>
              <div className="aspect-[16/9] overflow-hidden rounded-md bg-muted">
                <iframe
                  src={embeddedPlayerUrl.replace('auto_play=true', 'auto_play=false')}
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  allow="fullscreen"
                  title={`${title} audio player`}
                  data-testid="audio-player"
                  className="w-full h-full"
                />
              </div>
            </div>
          )}

          {/* Track List - Second */}
          {tracks.length > 0 && (
            <div className="space-y-6">
              <h3 className="text-type-h3 font-medium text-foreground">Tracks</h3>
              <div className="space-y-3">
                {tracks.map((track, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between py-3"
                    data-testid={`track-${index}`}
                  >
                    <div className="flex-1">
                      {track.externalLink ? (
                        <a
                          href={track.externalLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => handlePlaySound(track.title)}
                          className="text-type-body text-foreground hover:text-muted-foreground transition-colors"
                        >
                          {track.title}
                        </a>
                      ) : (
                        <span className="text-type-body text-foreground">{track.title}</span>
                      )}
                    </div>
                    <span className="text-type-small text-muted-foreground font-mono">
                      {track.duration}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cover Image - Third */}
          <div className="aspect-video overflow-hidden rounded-md bg-muted">
            <img
              src={coverImageUrl}
              alt={`${title} cover image`}
              className="w-full h-full object-cover"
              data-testid="img-project-cover"
            />
          </div>

          {/* Content Blocks - Fourth */}
          <div className="prose prose-lg max-w-none space-y-6">
            {bodyBlocks.map((block, index) => {
              if (block.type === 'h2') {
                return (
                  <h2 key={index} className="text-type-h2 font-semibold text-foreground mt-8 mb-4">
                    {block.text}
                  </h2>
                );
              }
              return (
                <p key={index} className="text-type-body text-foreground leading-relaxed">
                  {block.text}
                </p>
              );
            })}
          </div>

          {/* Meta Information */}
          {meta && (meta.label || meta.platforms) && (
            <div className="space-y-4 pt-8">
              {meta.label && (
                <div>
                  <span className="text-type-small text-muted-foreground">Label: </span>
                  <span className="text-type-small text-foreground">{meta.label}</span>
                </div>
              )}
              {meta.platforms && meta.platforms.length > 0 && (
                <div>
                  <span className="text-type-small text-muted-foreground">Available on: </span>
                  {meta.platforms.map((platform, index) => {
                    const platformUrls: Record<string, string> = {
                      'Bandcamp': 'https://artist.bandcamp.com',
                      'SoundCloud': 'https://soundcloud.com/artist'
                    };
                    
                    return (
                      <span key={platform}>
                        {index > 0 && <span className="text-type-small text-muted-foreground">, </span>}
                        <a
                          href={platformUrls[platform] || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-type-small text-foreground underline hover:text-muted-foreground transition-colors"
                          data-testid={`link-platform-${platform.toLowerCase()}`}
                        >
                          {platform}
                        </a>
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}