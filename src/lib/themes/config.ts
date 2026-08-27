import type { ThemeConfig, ThemeSegment } from "./types";

export const THEME_CONFIGS: Record<ThemeSegment, ThemeConfig> = {
  DEFAULT: {
    name: "Padrão",
    icon: "Store",
    colors: {
      primary: "#FFD400",
      secondary: "#0A0A0A",
      background: "#FFFFFF",
      text: "#0A0A0A",
      accent: "#FFD400",
      cardBg: "#FFFFFF",
      border: "#E8E8E3",
    },
    fonts: {
      heading: "Inter, sans-serif",
      body: "Inter, sans-serif",
    },
    components: {
      button: "rounded-lg font-semibold transition-colors",
      card: "rounded-xl border",
      productCard: "rounded-xl border overflow-hidden",
    },
    background: "#FFFFFF",
  },

  TECHNOLOGY: {
    name: "Tecnologia",
    icon: "Cpu",
    colors: {
      primary: "#2563EB",
      secondary: "#1E293B",
      background: "#0F172A",
      text: "#F8FAFC",
      accent: "#3B82F6",
      cardBg: "#1E293B",
      border: "#334155",
    },
    fonts: {
      heading: "Inter, sans-serif",
      body: "Inter, sans-serif",
    },
    components: {
      button: "rounded-lg font-semibold transition-colors",
      card: "rounded-xl border shadow-lg",
      productCard: "rounded-xl border shadow-lg overflow-hidden",
    },
    background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
  },

  FOOD: {
    name: "Alimentação",
    icon: "UtensilsCrossed",
    colors: {
      primary: "#EA580C",
      secondary: "#7C2D12",
      background: "#FFF7ED",
      text: "#431407",
      accent: "#F97316",
      cardBg: "#FFFFFF",
      border: "#FED7AA",
    },
    fonts: {
      heading: "Poppins, sans-serif",
      body: "Inter, sans-serif",
    },
    components: {
      button: "rounded-full font-semibold transition-colors",
      card: "rounded-2xl border shadow-sm",
      productCard: "rounded-2xl border shadow-sm overflow-hidden",
    },
    background: "linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)",
  },

  FASHION: {
    name: "Moda",
    icon: "Shirt",
    colors: {
      primary: "#BE185D",
      secondary: "#831843",
      background: "#FDF2F8",
      text: "#500724",
      accent: "#EC4899",
      cardBg: "#FFFFFF",
      border: "#FBCFE8",
    },
    fonts: {
      heading: "Playfair Display, serif",
      body: "Inter, sans-serif",
    },
    components: {
      button: "rounded-none font-medium uppercase tracking-wider transition-colors",
      card: "border shadow-sm",
      productCard: "border shadow-sm overflow-hidden",
    },
    background: "linear-gradient(135deg, #FDF2F8 0%, #FCE7F3 100%)",
  },

  HEALTH: {
    name: "Saúde",
    icon: "Heart",
    colors: {
      primary: "#059669",
      secondary: "#064E3B",
      background: "#ECFDF5",
      text: "#022C22",
      accent: "#10B981",
      cardBg: "#FFFFFF",
      border: "#A7F3D0",
    },
    fonts: {
      heading: "Inter, sans-serif",
      body: "Inter, sans-serif",
    },
    components: {
      button: "rounded-lg font-semibold transition-colors",
      card: "rounded-xl border shadow-sm",
      productCard: "rounded-xl border shadow-sm overflow-hidden",
    },
    background: "linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)",
  },

  EDUCATION: {
    name: "Educação",
    icon: "GraduationCap",
    colors: {
      primary: "#7C3AED",
      secondary: "#4C1D95",
      background: "#F5F3FF",
      text: "#2E1065",
      accent: "#8B5CF6",
      cardBg: "#FFFFFF",
      border: "#DDD6FE",
    },
    fonts: {
      heading: "Inter, sans-serif",
      body: "Inter, sans-serif",
    },
    components: {
      button: "rounded-lg font-semibold transition-colors",
      card: "rounded-xl border shadow-sm",
      productCard: "rounded-xl border shadow-sm overflow-hidden",
    },
    background: "linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 100%)",
  },

  BEAUTY: {
    name: "Beleza",
    icon: "Sparkles",
    colors: {
      primary: "#DB2777",
      secondary: "#831843",
      background: "#FDF2F8",
      text: "#500724",
      accent: "#F472B6",
      cardBg: "#FFFFFF",
      border: "#FBCFE8",
    },
    fonts: {
      heading: "Cormorant Garamond, serif",
      body: "Inter, sans-serif",
    },
    components: {
      button: "rounded-full font-medium transition-colors",
      card: "rounded-2xl border shadow-sm",
      productCard: "rounded-2xl border shadow-sm overflow-hidden",
    },
    background: "linear-gradient(135deg, #FDF2F8 0%, #FCE7F3 100%)",
  },

  SPORTS: {
    name: "Esportes",
    icon: "Dumbbell",
    colors: {
      primary: "#DC2626",
      secondary: "#7F1D1D",
      background: "#FEF2F2",
      text: "#450A0A",
      accent: "#EF4444",
      cardBg: "#FFFFFF",
      border: "#FECACA",
    },
    fonts: {
      heading: "Inter, sans-serif",
      body: "Inter, sans-serif",
    },
    components: {
      button: "rounded-lg font-bold uppercase tracking-wide transition-colors",
      card: "rounded-lg border-2 shadow-md",
      productCard: "rounded-lg border-2 shadow-md overflow-hidden",
    },
    background: "linear-gradient(135deg, #FEF2F2 0%, #FEE2E2 100%)",
  },

  MUSIC: {
    name: "Música",
    icon: "Music",
    colors: {
      primary: "#9333EA",
      secondary: "#581C87",
      background: "#FAF5FF",
      text: "#3B0764",
      accent: "#A855F7",
      cardBg: "#FFFFFF",
      border: "#E9D5FF",
    },
    fonts: {
      heading: "Inter, sans-serif",
      body: "Inter, sans-serif",
    },
    components: {
      button: "rounded-full font-semibold transition-colors",
      card: "rounded-xl border shadow-sm",
      productCard: "rounded-xl border shadow-sm overflow-hidden",
    },
    background: "linear-gradient(135deg, #FAF5FF 0%, #F3E8FF 100%)",
  },

  MINIMAL: {
    name: "Minimalista",
    icon: "Minus",
    colors: {
      primary: "#171717",
      secondary: "#404040",
      background: "#FAFAFA",
      text: "#171717",
      accent: "#525252",
      cardBg: "#FFFFFF",
      border: "#E5E5E5",
    },
    fonts: {
      heading: "Inter, sans-serif",
      body: "Inter, sans-serif",
    },
    components: {
      button: "rounded-none font-medium transition-colors",
      card: "border",
      productCard: "border overflow-hidden",
    },
    background: "#FAFAFA",
  },

  LUXURY: {
    name: "Luxo",
    icon: "Crown",
    colors: {
      primary: "#B45309",
      secondary: "#78350F",
      background: "#FFFBEB",
      text: "#451A03",
      accent: "#D97706",
      cardBg: "#FFFFFF",
      border: "#FDE68A",
    },
    fonts: {
      heading: "Playfair Display, serif",
      body: "Inter, sans-serif",
    },
    components: {
      button: "rounded-none font-medium uppercase tracking-widest transition-colors",
      card: "border shadow-lg",
      productCard: "border shadow-lg overflow-hidden",
    },
    background: "linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)",
  },

  NATURE: {
    name: "Natureza",
    icon: "Leaf",
    colors: {
      primary: "#15803D",
      secondary: "#14532D",
      background: "#F0FDF4",
      text: "#052E16",
      accent: "#22C55E",
      cardBg: "#FFFFFF",
      border: "#BBF7D0",
    },
    fonts: {
      heading: "Inter, sans-serif",
      body: "Inter, sans-serif",
    },
    components: {
      button: "rounded-full font-semibold transition-colors",
      card: "rounded-2xl border shadow-sm",
      productCard: "rounded-2xl border shadow-sm overflow-hidden",
    },
    background: "linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)",
  },

  KIDS: {
    name: "Infantil",
    icon: "Baby",
    colors: {
      primary: "#2563EB",
      secondary: "#7C3AED",
      background: "#EFF6FF",
      text: "#1E3A5F",
      accent: "#F59E0B",
      cardBg: "#FFFFFF",
      border: "#BFDBFE",
    },
    fonts: {
      heading: "Inter, sans-serif",
      body: "Inter, sans-serif",
    },
    components: {
      button: "rounded-full font-semibold transition-colors",
      card: "rounded-2xl border-2 shadow-sm",
      productCard: "rounded-2xl border-2 shadow-sm overflow-hidden",
    },
    background: "linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)",
  },

  PET: {
    name: "Pet",
    icon: "PawPrint",
    colors: {
      primary: "#D97706",
      secondary: "#92400E",
      background: "#FFFBEB",
      text: "#451A03",
      accent: "#F59E0B",
      cardBg: "#FFFFFF",
      border: "#FDE68A",
    },
    fonts: {
      heading: "Inter, sans-serif",
      body: "Inter, sans-serif",
    },
    components: {
      button: "rounded-full font-semibold transition-colors",
      card: "rounded-xl border shadow-sm",
      productCard: "rounded-xl border shadow-sm overflow-hidden",
    },
    background: "linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)",
  },

  AUTOMOTIVE: {
    name: "Automotivo",
    icon: "Car",
    colors: {
      primary: "#1F2937",
      secondary: "#111827",
      background: "#F9FAFB",
      text: "#111827",
      accent: "#EF4444",
      cardBg: "#FFFFFF",
      border: "#E5E7EB",
    },
    fonts: {
      heading: "Inter, sans-serif",
      body: "Inter, sans-serif",
    },
    components: {
      button: "rounded-lg font-bold uppercase tracking-wide transition-colors",
      card: "rounded-lg border shadow-md",
      productCard: "rounded-lg border shadow-md overflow-hidden",
    },
    background: "linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 100%)",
  },

  ART: {
    name: "Arte",
    icon: "Palette",
    colors: {
      primary: "#E11D48",
      secondary: "#9F1239",
      background: "#FFF1F2",
      text: "#4C0519",
      accent: "#FB7185",
      cardBg: "#FFFFFF",
      border: "#FECDD3",
    },
    fonts: {
      heading: "Playfair Display, serif",
      body: "Inter, sans-serif",
    },
    components: {
      button: "rounded-full font-medium transition-colors",
      card: "rounded-2xl border shadow-sm",
      productCard: "rounded-2xl border shadow-sm overflow-hidden",
    },
    background: "linear-gradient(135deg, #FFF1F2 0%, #FFE4E6 100%)",
  },
};

export function getThemeConfig(segment: ThemeSegment): ThemeConfig {
  return THEME_CONFIGS[segment];
}

export function resolveThemeColors(
  config: ThemeConfig,
  overrides: { primaryColor?: string; secondaryColor?: string }
) {
  return {
    ...config.colors,
    ...(overrides.primaryColor && { primary: overrides.primaryColor }),
    ...(overrides.secondaryColor && { secondary: overrides.secondaryColor }),
  };
}
