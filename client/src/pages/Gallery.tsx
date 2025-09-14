import Header from "@/components/Header";
import Breadcrumbs from "@/components/Breadcrumbs";
import SeriesIndex from "@/components/SeriesIndex";
import Footer from "@/components/Footer";
import { useContent } from "@/content/ContentProvider";

// import blueAbstractImage from "@assets/generated_images/Blue_abstract_color_field_53f088fd.png";
// import industrialSculptureImage from "@assets/generated_images/Industrial_sculpture_assemblage_2b04ef29.png";
// import gesturalPaintingImage from "@assets/generated_images/Gestural_earth_tone_painting_554103d6.png";
// import minimalistInstallationImage from "@assets/generated_images/White_minimalist_installation_e967bdd0.png";
// import digitalPrintImage from "@assets/generated_images/Digital_glitch_print_392d678b.png";

type SeriesCard = {
  title: string;
  slug: string;
  year: string;
  intro: string;
  artworkImages: string[];
  workCount: number;
};

export default function Gallery() {
  const { content } = useContent();

  // --- 1) Пробуем собрать серии из content.json ---
  const seriesFromJson: SeriesCard[] =
    (content?.series || []).map((s: any) => {
      // Берем до 3-х картинок:
      //  - если в JSON есть s.artworkImages — используем их,
      //  - иначе соберем первые изображения из работ s.works
      let imgs: any[] = [];
      if (Array.isArray(s.artworkImages) && s.artworkImages.length) {
        imgs = s.artworkImages;
      } else if (Array.isArray(s.works)) {
        // вытаскиваем первые картинки из работ
        const firstImages = s.works
          .map((w: any) => (Array.isArray(w.images) ? w.images[0] : w.images))
          .filter(Boolean)
          .slice(0, 3);
        imgs = firstImages;
      }

      const artworkImages = imgs
        .map((it: any) => {
          // поддержка форматов: строка, объект {src|url}, объект файла Vite
          if (typeof it === "string") return it;
          if (it && typeof it === "object") return it.src || it.url || "";
          return "";
        })
        .filter(Boolean)
        .map((p: string) => p.replace(/^\/+/, "")); // Pages-safe

      const workCount =
        typeof s.workCount === "number"
          ? s.workCount
          : Array.isArray(s.works)
          ? s.works.length
          : 0;

      return {
        title: s.title || s.slug || "Untitled series",
        slug: s.slug || "",
        year: String(s.year ?? ""),
        intro: s.intro || "",
        artworkImages,
        workCount,
      };
    }) || [];

  // --- 2) Фолбэк — твой прежний статический список (если JSON пуст) ---
  // const fallbackSeries: SeriesCard[] = [
  //   {
  //     title: "Farbkoerper",
  //     slug: "farbkoerper",
  //     year: "2022–",
  //     intro:
  //       "An ongoing exploration of color as physical form, investigating the materiality of pigment and its relationship to space and light.",
  //     artworkImages: [blueAbstractImage, gesturalPaintingImage, minimalistInstallationImage],
  //     workCount: 15,
  //   },
  //   {
  //     title: "Plywood-Gravel-Sand-Road-Dust (PGSRD)",
  //     slug: "pgsrd",
  //     year: "2021–",
  //     intro:
  //       "A series examining industrial and organic materials, their intersection in urban environments, and the traces they leave behind.",
  //     artworkImages: [industrialSculptureImage, digitalPrintImage, blueAbstractImage],
  //     workCount: 8,
  //   },
  //   {
  //     title: "Singles",
  //     slug: "singles",
  //     year: "2020–",
  //     intro:
  //       "Individual works that explore various media and concepts outside of larger series, unified by an interest in material experimentation.",
  //     artworkImages: [gesturalPaintingImage, minimalistInstallationImage, digitalPrintImage],
  //     workCount: 12,
  //   },
  //   {
  //     title: "Graphics",
  //     slug: "graphics",
  //     year: "2019–",
  //     intro:
  //       "Print-based works investigating digital and analog reproduction techniques, examining the transformation of images through various media.",
  //     artworkImages: [digitalPrintImage, industrialSculptureImage, blueAbstractImage],
  //     workCount: 6,
  //   },
  // ];

  const seriesData: SeriesCard[] =
    seriesFromJson.length > 0
      ? // если из JSON пришло меньше 3 картинок — аккуратно добавим фолбэки для красивой сетки
        seriesFromJson.map((s, i) => {
          if (s.artworkImages.length >= 3) return s;
          const pad = [
            blueAbstractImage,
            gesturalPaintingImage,
            industrialSculptureImage,
            digitalPrintImage,
            minimalistInstallationImage,
          ];
          return {
            ...s,
            artworkImages: [...s.artworkImages, ...pad].slice(0, 3),
          };
        })
      : fallbackSeries;

  const portfolioPdfUrl = (content?.contacts?.portfolioPdf ?? "files/portfolio.pdf").replace(
    /^\/+/,
    ""
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header берет имя из content.json */}
      <Header />

      <main className="section-py flex-1">
        <div className="site-container heading-gap-lg">
          <Breadcrumbs
            items={[
              { label: "Home", href: "#/", testId: "link-bc-home" },
              { label: "Gallery", testId: "text-bc-current" },
            ]}
          />
          <h1
            id="page-title"
            tabIndex={-1}
            className="text-type-h1 font-semibold text-foreground h1-spacing"
          >
            Gallery
          </h1>
        </div>

        <SeriesIndex series={seriesData} />
      </main>

      <Footer
              year={new Date().getFullYear()}
              portfolioPdfUrl={portfolioPdfUrl}
              socialLinks={socialLinks}
            />
    </div>
  );
}
