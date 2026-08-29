"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, ShoppingBag, Menu, X, ChevronRight, Phone } from "lucide-react";
import { useState, useCallback } from "react";
import { useTheme } from "@/components/providers/ThemeProvider";
import { CartDrawer } from "./CartDrawer";

interface StoreHeaderCategory {
  name: string;
  slug: string;
}

interface StoreHeaderProps {
  name: string;
  storeUrl: string;
  logoUrl?: string | null;
  whatsapp?: string;
  categories?: (string | StoreHeaderCategory)[];
}

export function StoreHeader({
  name,
  storeUrl,
  logoUrl,
  whatsapp,
  categories = [],
}: StoreHeaderProps) {
  const { resolvedColors } = useTheme();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const q = searchQuery.trim();
      if (q) {
        router.push(`/${storeUrl}?q=${encodeURIComponent(q)}`);
      } else {
        router.push(`/${storeUrl}`);
      }
      setMobileOpen(false);
    },
    [searchQuery, storeUrl, router]
  );

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
          className={`flex items-center ${logoUrl ? "gap-0" : "gap-3"}`}
          aria-label={`${name} - Página inicial`}
        >
          <span
            className={`relative flex items-center justify-center overflow-hidden text-base font-extrabold ${
              logoUrl ? "h-14 w-36 rounded-2xl md:h-16 md:w-44" : "size-10 rounded-xl"
            }`}
            style={{
              backgroundColor: resolvedColors.primary,
              color: resolvedColors.secondary,
            }}
          >
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt={`Logo de ${name}`}
                fill
                className="bg-white object-contain p-2"
                sizes="(max-width: 768px) 144px, 176px"
              />
            ) : (
              name.charAt(0)
            )}
          </span>
          {!logoUrl ? (
            <span
              className="text-xl font-extrabold tracking-tight"
              style={{ color: resolvedColors.text }}
            >
              {name}
            </span>
          ) : null}
        </Link>

        {/* Search - desktop */}
        <form onSubmit={handleSearch} className="hidden flex-1 justify-center px-10 md:flex">
          <div className="relative w-full max-w-lg">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 size-[18px]"
              style={{ color: resolvedColors.text, opacity: 0.3 }}
            />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-11 w-full rounded-xl border pl-12 pr-4 text-sm font-medium outline-none transition-all focus:shadow-sm"
              style={{
                borderColor: resolvedColors.border,
                backgroundColor: resolvedColors.background,
                color: resolvedColors.text,
              }}
              placeholder="O que você procura?"
            />
          </div>
        </form>

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
            <div
              className="relative cursor-pointer rounded-xl p-2.5 transition-colors"
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
            </div>
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
          <div className="mx-auto flex max-w-6xl items-center gap-0 overflow-x-auto px-4">
            {categories.map((cat) => {
              const name = typeof cat === "string" ? cat : cat.name;
              const slug = typeof cat === "string" ? null : cat.slug;
              const href = slug
                ? `/${storeUrl}/categoria/${slug}`
                : `/${storeUrl}?category=${encodeURIComponent(name)}`;
              return (
                <Link
                  key={name}
                  href={href}
                  className="shrink-0 px-5 py-3 text-sm font-semibold transition-colors"
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
                  {name}
                </Link>
              );
            })}
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
            <form onSubmit={handleSearch} className="relative mb-5">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 size-[18px]"
                style={{ color: resolvedColors.text, opacity: 0.3 }}
              />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-11 w-full rounded-xl border pl-12 pr-4 text-sm font-medium outline-none"
                style={{
                  borderColor: resolvedColors.border,
                  backgroundColor: resolvedColors.background,
                  color: resolvedColors.text,
                }}
                placeholder="O que você procura?"
              />
            </form>
            {categories.length > 0 && (
              <nav className="flex flex-col gap-1">
                {categories.map((cat) => {
                  const name = typeof cat === "string" ? cat : cat.name;
                  const slug = typeof cat === "string" ? null : cat.slug;
                  const href = slug
                    ? `/${storeUrl}/categoria/${slug}`
                    : `/${storeUrl}?category=${encodeURIComponent(name)}`;
                  return (
                    <Link
                      key={name}
                      href={href}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-between rounded-xl px-4 py-3.5 text-sm font-semibold transition-colors"
                      style={{
                        color: resolvedColors.text,
                        backgroundColor: resolvedColors.background,
                      }}
                    >
                      {name}
                      <ChevronRight size={16} style={{ opacity: 0.3 }} />
                    </Link>
                  );
                })}
              </nav>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
