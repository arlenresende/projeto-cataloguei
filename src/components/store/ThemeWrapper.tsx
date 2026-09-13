import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { CartProvider } from "@/components/providers/CartProvider";
import type { ThemeSegment, StoreThemeOverrides } from "@/lib/themes";

interface ThemeWrapperProps {
  segment: ThemeSegment;
  storeUrl?: string;
  overrides?: StoreThemeOverrides;
  children: React.ReactNode;
}

export function ThemeWrapper({
  segment,
  storeUrl,
  overrides,
  children,
}: ThemeWrapperProps) {
  const content = storeUrl ? (
    <CartProvider key={storeUrl} storeUrl={storeUrl}>
      {children}
    </CartProvider>
  ) : (
    children
  );

  return (
    <ThemeProvider segment={segment} overrides={overrides}>
      {content}
    </ThemeProvider>
  );
}
