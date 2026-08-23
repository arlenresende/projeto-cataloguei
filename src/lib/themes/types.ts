export const THEME_SEGMENTS = [
  "TECHNOLOGY",
  "FOOD",
  "FASHION",
  "HEALTH",
  "EDUCATION",
  "BEAUTY",
  "SPORTS",
  "MUSIC",
  "MINIMAL",
  "LUXURY",
  "NATURE",
  "KIDS",
  "PET",
  "AUTOMOTIVE",
  "ART",
] as const;

export type ThemeSegment = (typeof THEME_SEGMENTS)[number];

export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  text: string;
  accent: string;
  cardBg: string;
  border: string;
}

export interface ThemeFonts {
  heading: string;
  body: string;
}

export interface ThemeComponents {
  button: string;
  card: string;
  productCard: string;
}

export interface ThemeConfig {
  name: string;
  icon: string;
  colors: ThemeColors;
  fonts: ThemeFonts;
  components: ThemeComponents;
  background: string;
}

export interface StoreThemeOverrides {
  primaryColor?: string;
  secondaryColor?: string;
}

export interface ResolvedTheme {
  config: ThemeConfig;
  overrides: StoreThemeOverrides;
  resolvedColors: ThemeColors;
}
