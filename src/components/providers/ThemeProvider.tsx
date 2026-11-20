"use client";

import { createContext, useContext, useMemo } from "react";
import {
  type ThemeSegment,
  type ThemeConfig,
  type StoreThemeOverrides,
  type ThemeColors,
  getThemeConfig,
  resolveThemeColors,
} from "@/lib/themes";

function getSurfaceTextColor(hex: string) {
  const color = hex.replace("#", "");
  const expanded = color.length === 3 ? color.split("").map((digit) => digit + digit).join("") : color;
  const channels = [0, 2, 4].map((offset) => {
    const channel = parseInt(expanded.slice(offset, offset + 2), 16) / 255;
    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  const luminance = channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
  return luminance > 0.179 ? "#000000" : "#FFFFFF";
}

interface ThemeContextValue {
  segment: ThemeSegment;
  config: ThemeConfig;
  overrides: StoreThemeOverrides;
  resolvedColors: ThemeColors;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

interface ThemeProviderProps {
  segment: ThemeSegment;
  overrides?: StoreThemeOverrides;
  children: React.ReactNode;
}

export function ThemeProvider({
  segment,
  overrides = {},
  children,
}: ThemeProviderProps) {
  const value = useMemo<ThemeContextValue>(() => {
    const config = getThemeConfig(segment);
    const resolvedColors = resolveThemeColors(config, overrides);
    return { segment, config, overrides, resolvedColors };
  }, [segment, overrides]);

  return (
    <ThemeContext.Provider value={value}>
      <div
        style={{
          "--theme-primary": value.resolvedColors.primary,
          "--theme-on-primary": getSurfaceTextColor(value.resolvedColors.primary),
          "--theme-secondary": value.resolvedColors.secondary,
          "--theme-background": value.resolvedColors.background,
          "--theme-text": value.resolvedColors.text,
          "--theme-accent": value.resolvedColors.accent,
          "--theme-card-bg": value.resolvedColors.cardBg,
          "--theme-border": value.resolvedColors.border,
          background: value.resolvedColors.background,
          color: value.resolvedColors.text,
          fontFamily: "var(--font-manrope), system-ui, sans-serif",
        } as React.CSSProperties}
        className="min-h-screen"
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
