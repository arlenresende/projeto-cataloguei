"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";
import type { StoreBanner } from "@/types";

interface BannerCarouselProps {
  banners: StoreBanner[];
}

export function BannerCarousel({ banners }: BannerCarouselProps) {
  const { resolvedColors } = useTheme();
  const [current, setCurrent] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const total = banners.length;

  const goTo = useCallback(
    (index: number) => {
      if (transitioning) return;
      setTransitioning(true);
      setCurrent(index);
      setTimeout(() => setTransitioning(false), 400);
    },
    [transitioning]
  );

  const next = useCallback(() => goTo((current + 1) % total), [current, total, goTo]);
  const prev = useCallback(() => goTo((current - 1 + total) % total), [current, total, goTo]);

  useEffect(() => {
    if (total <= 1) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [total, next]);

  if (total === 0) return null;

  const banner = banners[current];
  const hasContent = banner.title || banner.description || banner.buttonText;

  return (
    <section className="relative overflow-hidden bg-[var(--theme-background)]">
      <div className="mx-auto max-w-6xl px-4 pt-6 pb-8 md:pt-8 md:pb-12">
        <div className="relative overflow-hidden rounded-2xl shadow-lg md:rounded-3xl">
          {/* Image */}
          <div className="relative aspect-[16/8] w-full md:aspect-[16/5.5]">
            <Image
              src={banner.image}
              alt={banner.title || "Banner"}
              fill
              className="object-cover transition-transform duration-700"
              style={{
                transform: transitioning ? "scale(1.02)" : "scale(1)",
              }}
              priority
              sizes="100vw"
            />
            {/* Overlay */}
            {hasContent && (
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(135deg, ${resolvedColors.secondary}E6 0%, ${resolvedColors.secondary}80 40%, transparent 70%)`,
                }}
              />
            )}
            {/* Bottom fade for image-only banners */}
            {!hasContent && (
              <div
                className="absolute inset-x-0 bottom-0 h-24"
                style={{
                  background: `linear-gradient(to top, ${resolvedColors.secondary}30, transparent)`,
                }}
              />
            )}
          </div>

          {/* Content */}
          {hasContent && (
            <div className="absolute inset-0 flex items-center">
              <div className="px-8 py-8 md:px-16 md:py-12">
                {banner.title && (
                  <h2
                    className="max-w-lg text-2xl font-extrabold leading-[1.1] tracking-tight md:text-4xl lg:text-5xl"
                    style={{ color: "#FFFFFF" }}
                  >
                    {banner.title}
                  </h2>
                )}
                {banner.description && (
                  <p
                    className="mt-4 max-w-md text-sm font-medium leading-relaxed md:text-base"
                    style={{ color: "#FFFFFFCC" }}
                  >
                    {banner.description}
                  </p>
                )}
                {banner.buttonText && (
                  <a
                    href={banner.buttonLink || "#"}
                    className="mt-6 inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-bold transition-all hover:gap-3 hover:shadow-lg"
                    style={{
                      backgroundColor: resolvedColors.primary,
                      color: resolvedColors.secondary,
                    }}
                  >
                    {banner.buttonText}
                    <ArrowRight size={16} />
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Arrows */}
        {total > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-6 top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-lg backdrop-blur-sm transition-all hover:scale-105 hover:bg-white md:left-8"
              style={{ color: resolvedColors.text }}
              aria-label="Banner anterior"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={next}
              className="absolute right-6 top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-lg backdrop-blur-sm transition-all hover:scale-105 hover:bg-white md:right-8"
              style={{ color: resolvedColors.text }}
              aria-label="Próximo banner"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        {/* Dots */}
        {total > 1 && (
          <div className="mt-5 flex items-center justify-center gap-2.5">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === current ? 28 : 8,
                  height: 8,
                  backgroundColor:
                    i === current
                      ? resolvedColors.primary
                      : resolvedColors.border,
                }}
                aria-label={`Banner ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
