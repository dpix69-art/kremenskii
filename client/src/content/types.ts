/**
 * Type definitions for content.json
 * Single source of truth for all content structure.
 */

export interface SiteConfig {
  artistName: string;
  role: string;
  statement: string;
  homeFeatured?: { series: string; work: string }[];
}

export interface NavItem {
  label: string;
  href: string;
}

export interface WorkImage {
  url: string;
  role?: "main" | "detail" | "angle" | "installation-view";
}

export interface SaleInfo {
  availability: "available" | "sold" | "reserved" | "not_for_sale";
  price?: {
    mode: "fixed" | "on_request";
    amount?: number;
    currency?: string;
  };
  notes?: string;
}

export interface Work {
  slug: string;
  title: string;
  year: number | string;
  technique?: string;
  medium?: string;
  dimensions?: string;
  images: (string | WorkImage)[];
  sale?: SaleInfo;
  about?: string[];
}

export interface Series {
  slug: string;
  title: string;
  year: string | number;
  intro: string | string[];
  artworkImages?: string[];
  works: Work[];
}

export interface SoundProject {
  slug: string;
  title: string;
  year: number | string;
  platform?: string;
  pageUrl?: string;
  summary?: string;
  cover?: string;
  embed?: string;
  video?: string;
  location?: string;
  tracks?: { title: string; duration?: string }[];
  meta?: {
    label?: string;
    platforms?: string[];
  };
  photos?: (string | { url: string; alt?: string })[];
  bodyBlocks?: (string | { type: string; text: string })[];
  about?: string[];
}

export interface Exhibition {
  year: string | number;
  event: string;
}

export interface StatementData {
  portrait?: string;
  paragraphs: string[];
  pressKitPdf?: string;
  exhibitions?: Exhibition[];
}

export interface ContactsData {
  email: string;
  city?: string;
  country?: string;
  introText?: string;
  openToText?: string;
  portfolioPdf?: string;
  socials?: { label: string; href: string }[];
}

export interface FooterData {
  legal?: string;
  copyright?: string;
}

export interface ImpressumData {
  paragraphs?: string[];
}

export interface ContentData {
  site: SiteConfig;
  nav: NavItem[];
  series: Series[];
  sounds: SoundProject[];
  statement: StatementData;
  contacts: ContactsData;
  footer?: FooterData;
  impressum?: ImpressumData;
}