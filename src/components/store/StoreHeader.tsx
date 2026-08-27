"use client";

import Link from "next/link";
import { Search, ShoppingBag, Menu, X, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useTheme } from "@/components/providers/ThemeProvider";
import { cn } from "@/lib/utils";

interface StoreHeaderProps {
  name: string;
  storeUrl: string;
  categories?: string[];
}

export function StoreHeader({ name, storeUrl, categories = [] }: StoreHeaderProps) {
  const { resolvedColors } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-50 border-b backdrop-blur-md"
      style={{
        borderColor: resolvedColors.border,
        backgroundColor: resolvedColors.cardBg + "E6",
      }}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 md:h-16">
        {/* Logo */}
        <Link
          href={`/${storeUrl}`}
          className="flex items-center gap-2.5"
          aria-label={`${name} - Página inicial`}
        >
          <span
            className="flex size-8 items-center justify-center rounded-lg text-sm font-bold"
            style={{
              backgroundColor: resolvedColors.primary,
              color: resolvedColors.secondary,
            }}
          >
            {name.charAt(0)}
          </span>
          <span
            className="text-base font-bold"
            style={{ color: resolvedColors.text }}
          >
            {name}
          </span>
        </Link>

        {/* Search - desktop */}
        <div className="hidden flex-1 justify-center md:flex">
          <div className="relative w-full max-w-sm">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 size-4"
              style={{ color: resolvedColors.text, opacity: 0.4 }}
            />
            <input
              className="h-9 w-full rounded-lg border pl-10 pr-4 text-sm outline-none transition-colors"
              style={{
                borderColor: resolvedColors.border,
                backgroundColor: resolvedColors.background,
                color: resolvedColors.text,
              }}
              placeholder="Buscar produtos..."
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            className="relative rounded-lg p-2 transition-colors"
            style={{ color: resolvedColors.text }}
            aria-label="Carrinho"
          >
            <ShoppingBag size={20} />
            <span
              className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full text-[10px] font-bold"
              style={{
                backgroundColor: resolvedColors.primary,
                color: resolvedColors.secondary,
              }}
            >
              0
            </span>
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-lg p-2 md:hidden"
            style={{ color: resolvedColors.text }}
            aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Categories bar - desktop */}
      {categories.length > 0 && (
        <div
          className="hidden border-t md:block"
          style={{ borderColor: resolvedColors.border }}
        >
          <div className="mx-auto flex max-w-6xl items-center gap-6 px-4 py-2">
            {categories.map((cat) => (
              <Link
                key={cat}
                href={`/${storeUrl}?category=${encodeURIComponent(cat)}`}
                className="text-xs font-medium transition-colors hover:opacity-100"
                style={{ color: resolvedColors.text, opacity: 0.6 }}
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="border-t md:hidden"
          style={{ borderColor: resolvedColors.border }}
        >
          <div className="px-4 py-3">
            <div className="relative mb-3">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 size-4"
                style={{ color: resolvedColors.text, opacity: 0.4 }}
              />
              <input
                className="h-9 w-full rounded-lg border pl-10 pr-4 text-sm outline-none"
                style={{
                  borderColor: resolvedColors.border,
                  backgroundColor: resolvedColors.background,
                  color: resolvedColors.text,
                }}
                placeholder="Buscar produtos..."
              />
            </div>
            {categories.length > 0 && (
              <nav className="flex flex-col gap-1">
                {categories.map((cat) => (
                  <Link
                    key={cat}
                    href={`/${storeUrl}?category=${encodeURIComponent(cat)}`}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors"
                    style={{ color: resolvedColors.text }}
                  >
                    {cat}
                    <ChevronRight size={16} style={{ opacity: 0.4 }} />
                  </Link>
                ))}
              </nav>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
