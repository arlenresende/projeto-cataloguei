"use client";

import Link from "next/link";
import { Search, ShoppingBag, Menu, X, ChevronRight, Phone } from "lucide-react";
import { useState } from "react";
import { useTheme } from "@/components/providers/ThemeProvider";
import { CartDrawer } from "./CartDrawer";

interface StoreHeaderProps {
  name: string;
  storeUrl: string;
  whatsapp?: string;
  categories?: string[];
}

export function StoreHeader({ name, storeUrl, whatsapp, categories = [] }: StoreHeaderProps) {
  const { resolvedColors } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-50 border-b shadow-sm backdrop-blur-lg"
      style={{
        borderColor: resolvedColors.border,
        backgroundColor: resolvedColors.cardBg + "F5",
      }}
    >
      {/* Top bar */}
      <div className="mx-auto flex h-[68px] max-w-6xl items-center justify-between px-4 md:h-[76px]">
        {/* Logo */}
        <Link
          href={`/${storeUrl}`}
          className="flex items-center gap-3"
          aria-label={`${name} - Página inicial`}
        >
          <span
            className="flex size-10 items-center justify-center rounded-xl text-base font-extrabold"
            style={{
              backgroundColor: resolvedColors.primary,
              color: resolvedColors.secondary,
            }}
          >
            {name.charAt(0)}
          </span>
          <span
            className="text-xl font-extrabold tracking-tight"
            style={{ color: resolvedColors.text }}
          >
            {name}
          </span>
        </Link>

        {/* Search - desktop */}
        <div className="hidden flex-1 justify-center px-10 md:flex">
          <div className="relative w-full max-w-lg">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 size-[18px]"
              style={{ color: resolvedColors.text, opacity: 0.3 }}
            />
            <input
              className="h-11 w-full rounded-xl border pl-12 pr-4 text-sm font-medium outline-none transition-all focus:shadow-sm"
              style={{
                borderColor: resolvedColors.border,
                backgroundColor: resolvedColors.background,
                color: resolvedColors.text,
              }}
              placeholder="O que você procura?"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5">
          {whatsapp && (
            <a
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden rounded-xl p-2.5 transition-colors sm:block"
              style={{ color: resolvedColors.text, opacity: 0.7 }}
              aria-label="Fale conosco"
              title="Fale conosco"
            >
              <Phone size={22} />
            </a>
          )}
          <div
            className="mx-1 hidden h-5 w-px sm:block"
            style={{ backgroundColor: resolvedColors.border }}
          />
          <CartDrawer whatsapp={whatsapp || ""} storeName={name}>
            <button
              className="relative rounded-xl p-2.5 transition-colors"
              style={{ color: resolvedColors.text }}
              aria-label="Carrinho"
            >
              <ShoppingBag size={22} strokeWidth={2} />
              <span
                className="absolute right-0.5 top-0.5 flex size-[18px] items-center justify-center rounded-full text-[10px] font-bold"
                style={{
                  backgroundColor: resolvedColors.primary,
                  color: resolvedColors.secondary,
                }}
              >
                2
              </span>
            </button>
          </CartDrawer>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-xl p-2.5 md:hidden"
            style={{ color: resolvedColors.text }}
            aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Categories bar - desktop */}
      {categories.length > 0 && (
        <div
          className="hidden border-t md:block"
          style={{
            borderColor: resolvedColors.border,
            backgroundColor: resolvedColors.secondary,
          }}
        >
          <div className="mx-auto flex max-w-6xl items-center gap-0 px-4">
            {categories.map((cat) => (
              <Link
                key={cat}
                href={`/${storeUrl}?category=${encodeURIComponent(cat)}`}
                className="px-5 py-3 text-sm font-semibold transition-colors"
                style={{ color: resolvedColors.cardBg + "CC" }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.color = resolvedColors.primary;
                  (e.target as HTMLElement).style.backgroundColor = resolvedColors.secondary;
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.color = resolvedColors.cardBg + "CC";
                  (e.target as HTMLElement).style.backgroundColor = "transparent";
                }}
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
          style={{
            borderColor: resolvedColors.border,
            backgroundColor: resolvedColors.cardBg,
          }}
        >
          <div className="px-4 py-5">
            <div className="relative mb-5">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 size-[18px]"
                style={{ color: resolvedColors.text, opacity: 0.3 }}
              />
              <input
                className="h-11 w-full rounded-xl border pl-12 pr-4 text-sm font-medium outline-none"
                style={{
                  borderColor: resolvedColors.border,
                  backgroundColor: resolvedColors.background,
                  color: resolvedColors.text,
                }}
                placeholder="O que você procura?"
              />
            </div>
            {categories.length > 0 && (
              <nav className="flex flex-col gap-1">
                {categories.map((cat) => (
                  <Link
                    key={cat}
                    href={`/${storeUrl}?category=${encodeURIComponent(cat)}`}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between rounded-xl px-4 py-3.5 text-sm font-semibold transition-colors"
                    style={{
                      color: resolvedColors.text,
                      backgroundColor: resolvedColors.background,
                    }}
                  >
                    {cat}
                    <ChevronRight size={16} style={{ opacity: 0.3 }} />
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
