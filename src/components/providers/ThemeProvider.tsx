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
          "--theme-secondary": value.resolvedColors.secondary,
          "--theme-background": value.resolvedColors.background,
          "--theme-text": value.resolvedColors.text,
          "--theme-accent": value.resolvedColors.accent,
          "--theme-card-bg": value.resolvedColors.cardBg,
          "--theme-border": value.resolvedColors.border,
          background: value.config.background,
          color: value.resolvedColors.text,
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
