import { ThemeProvider } from "@/components/providers/ThemeProvider";
import type { ThemeSegment, StoreThemeOverrides } from "@/lib/themes";

interface ThemeWrapperProps {
  segment: ThemeSegment;
  overrides?: StoreThemeOverrides;
  children: React.ReactNode;
}

export function ThemeWrapper({
  segment,
  overrides,
  children,
}: ThemeWrapperProps) {
  return (
    <ThemeProvider segment={segment} overrides={overrides}>
      {children}
    </ThemeProvider>
  );
}
