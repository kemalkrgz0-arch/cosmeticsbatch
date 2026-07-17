import type { CSSProperties } from "react";
import type { ProductCategory } from "./decoder/types";

export interface BrandTheme {
  primary: string;
  primaryDark: string;
  accent: string;
  cta: string;
  ctaHover: string;
  background: string;
  surface: string;
  text: string;
  mutedText: string;
  border: string;
  heroOverlay: string;
  heroImage?: string;
  mobileHeroImage?: string;
  focalPosition: string;
  mobileFocalPosition: string;
}

const BASE: BrandTheme = {
  primary: "#43533d",
  primaryDark: "#293326",
  accent: "#718168",
  cta: "#43533d",
  ctaHover: "#293326",
  background: "#f5f1e9",
  surface: "#fffdf9",
  text: "#22251f",
  mutedText: "#60665d",
  border: "#dfe1d8",
  heroOverlay: "linear-gradient(90deg, rgba(247,243,235,.98) 0%, rgba(247,243,235,.88) 48%, rgba(247,243,235,.35) 100%)",
  focalPosition: "70% 50%",
  mobileFocalPosition: "70% 50%",
};

const CATEGORY: Partial<Record<ProductCategory, Partial<BrandTheme>>> = {
  perfume: { primary: "#4b4036", primaryDark: "#2c251f", accent: "#91765e", background: "#f5eee6" },
  makeup: { primary: "#493a3c", primaryDark: "#2b2224", accent: "#8c686c", background: "#f5eded" },
  haircare: { primary: "#3f4b45", primaryDark: "#26302b", accent: "#6d8176", background: "#eef3ef" },
  suncare: { primary: "#5a4a2d", primaryDark: "#342a19", accent: "#9b7d42", background: "#faf2dd" },
};

export function getBrandTheme(category: ProductCategory, override?: Partial<BrandTheme>): BrandTheme {
  return { ...BASE, ...CATEGORY[category], ...override };
}

export type BrandThemeStyle = CSSProperties & Record<`--brand-${string}`, string>;

export function brandThemeStyle(theme: BrandTheme): BrandThemeStyle {
  return {
    "--brand-primary": theme.primary,
    "--brand-primary-dark": theme.primaryDark,
    "--brand-accent": theme.accent,
    "--brand-cta": theme.cta,
    "--brand-cta-hover": theme.ctaHover,
    "--brand-background": theme.background,
    "--brand-surface": theme.surface,
    "--brand-text": theme.text,
    "--brand-muted": theme.mutedText,
    "--brand-border": theme.border,
    "--brand-overlay": theme.heroOverlay,
    "--brand-focal": theme.focalPosition,
    "--brand-mobile-focal": theme.mobileFocalPosition,
  };
}
