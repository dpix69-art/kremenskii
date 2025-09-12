import { Link } from "wouter";

interface Series {
  title: string;
  slug: string;
  year: string;
  intro: string;
  artworkImages: string[];
  workCount: number;
}

interface SeriesIndexProps {
  series: Series[];
}

export default function SeriesIndex({ series }: SeriesIndexProps) {
  return (
    <section className="w-full">
      <div className="site-container">
        <div className="block-gap">
          {series.map((seriesItem) => (
            <Link key={seriesItem.slug} href={`/gallery/${seriesItem.slug}`}>
                <article 
                  className="group cursor-pointer"
                  data-testid={`series-${seriesItem.slug}`}
                >
                <div className="grid-12">
                  <div className="col-span-12 lg:col-span-6 block-gap">
                    <div>
                      <span className="text-type-small text-muted-foreground uppercase tracking-wide">
                        Series
                      </span>
                      <h2 className="text-type-h2 font-semibold text-foreground h2-spacing">
                        {seriesItem.title}
                      </h2>
                      <p className="text-type-body text-muted-foreground">{seriesItem.year}</p>
                    </div>
                    <p className="text-type-body text-foreground leading-relaxed w-1/2">
                      {seriesItem.intro}
                    </p>
                    <div>
                      <p className="text-type-small text-muted-foreground" style={{marginBottom: 'var(--paragraph-gap)'}}>
                        {seriesItem.workCount} {seriesItem.workCount === 1 ? 'work' : 'works'}
                      </p>
                      {/* Additional small images */}
                      {seriesItem.artworkImages && seriesItem.artworkImages.length > 1 && (
                        <div className="flex gap-2">
                          {seriesItem.artworkImages.slice(1, 3).map((imageUrl, index) => (
                            <div key={index} className="w-[100px] h-[100px] overflow-hidden rounded-md bg-muted flex-shrink-0">
                              <img
                                src={imageUrl}
                                alt={`${seriesItem.title} artwork ${index + 2}`}
                                className="w-full h-full object-cover"
                                data-testid={`img-series-${seriesItem.slug}-${index + 1}`}
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-span-12 lg:col-span-6">
                    {seriesItem.artworkImages && seriesItem.artworkImages.length > 0 ? (
                      <div className="aspect-[4/5] overflow-hidden rounded-md bg-muted">
                        <img
                          src={seriesItem.artworkImages[0]}
                          alt={`${seriesItem.title} series preview`}
                          className="w-full h-full object-cover"
                          data-testid={`img-series-${seriesItem.slug}-main`}
                        />
                      </div>
                    ) : (
                      <div className="aspect-[4/5] overflow-hidden rounded-md bg-muted">
                        <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
                          No images available
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                </article>
              </Link>
          ))}
        </div>
      </div>
    </section>
  );
}