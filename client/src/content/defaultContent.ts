const defaultContent = {
  site: {
    artistName: "Dmitrii Kremenskii",
    role: "artist",
    statement:
      "I record experience; I do not release it. Whether loss, fear, or elevation, an event remains in me as structure. I return to it and translate it into action: pressure, abrasion, layering, frequency. Material becomes the site where that action is registered.",
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
    introText: "Idea? Please write me an email.",
    openToText: "Open for exhibitions, collaborations and commissions.",
    portfolioPdf: "files/kremenskii-portfolio.pdf",
    socials: [
      { label: "Instagram", href: "https://www.instagram.com/dmitrii.kremenskii.art" },
      { label: "Soundcloud", href: "https://soundcloud.com/dmitrii-kremenskii" },
      { label: "Bandcamp", href: "https://kremenskii.bandcamp.com/" },
    ],
  },
  statement: {
    portrait: "images/kremenskii.png",
    paragraphs: [
      "I do not seek relief through expression or catharsis.",
      "Each work stands as a document: this is what the encounter looked like. If a viewer recognizes their own tension and decides to face it, that is a welcomed but optional consequence."
    ],
    pressKitPdf: "files/press-kit.pdf",
    exhibitions: [
      { "year": "2024", "event": "Sand & Sieb im Kontrast, Elsiens Art Gallery, Stuttgart" },
      { "year": "2024", "event": "Rolle Vorwärts, live performance music event series in Stuttgart" },
      { "year": "2022", "event": "OFFEN FÜR NEUES, Elsiens Art Gallery, Stuttgart" }
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
