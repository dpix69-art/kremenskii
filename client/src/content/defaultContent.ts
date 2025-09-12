const defaultContent = {
  site: {
    artistName: "Dmitrii Kremenskii",
    role: "artist",
    statement:
      "My practice investigates the intersection of material and meaning, exploring how physical substances carry cultural and emotional weight beyond their immediate visual properties.",
  },
  nav: [
    { label: "Gallery", href: "#/gallery" },
    { label: "Sounds", href: "#/sounds" },
    { label: "Statement", href: "#/statement" },
    { label: "Contacts", href: "#/contacts" },
  ],
  contacts: {
    email: "hi@kremenskii.art",
    city: "Stuttgart",
    country: "Germany",
    introText: "If you have an idea or proposal, please write an email.",
    openToText: "Open for exhibitions, collaborations and commissions. Please email.",
    portfolioPdf: "files/portfolio.pdf",
    socials: [
      { label: "Instagram", href: "https://instagram.com/artist" },
      { label: "Soundcloud", href: "https://soundcloud.com/artist" },
      { label: "Bandcamp", href: "https://artist.bandcamp.com" },
    ],
  },
  statement: {
    portrait: "images/kremenskii.png",
    paragraphs: [
      "Artist statement paragraph 1.",
      "Artist statement paragraph 2."
    ],
    pressKitPdf: "files/press-kit.pdf",
    exhibitions: [
      { year: "2024", event: "Material Traces, Contemporary Art Gallery, Berlin" },
      { year: "2023", event: "Substance and Surface, Museum of Modern Art, Vienna" },
    ],
  },
  series: [],
  sounds: [],
  footer: {
    legal: "No reproduction without written permission.",
    copyright: "2025 © Dmitrii Kremenskii. All rights reserved.",
  },
};

export default defaultContent;
