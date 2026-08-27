"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";

interface StoreHeroProps {
  name: string;
  description: string;
  bannerUrl: string;
  logoUrl: string;
}

export function StoreHero({ name, description, bannerUrl, logoUrl }: StoreHeroProps) {
  const { resolvedColors } = useTheme();

  return (
    <section className="relative overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: `linear-gradient(135deg, ${resolvedColors.primary}15 0%, ${resolvedColors.background} 50%, ${resolvedColors.primary}08 100%)`,
        }}
      />

      <div className="mx-auto max-w-6xl px-4 py-12 md:py-20">
        <div className="grid items-center gap-8 md:grid-cols-2">
          {/* Text */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div
                className="size-12 overflow-hidden rounded-xl"
                style={{ border: `2px solid ${resolvedColors.border}` }}
              >
                <Image
                  src={logoUrl}
                  alt={`Logo de ${name}`}
                  width={48}
                  height={48}
                  className="size-full object-cover"
                />
              </div>
              <span
                className="text-sm font-medium"
                style={{ color: resolvedColors.text, opacity: 0.6 }}
              >
                {name}
              </span>
            </div>
            <h1
              className="text-3xl font-bold leading-tight tracking-tight md:text-4xl lg:text-5xl"
              style={{ color: resolvedColors.text }}
            >
              {description}
            </h1>
            <p
              className="mt-4 text-base md:text-lg"
              style={{ color: resolvedColors.text, opacity: 0.6 }}
            >
              Confira nossos produtos e faça seu pedido pelo WhatsApp.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <a
                href="#produtos"
                className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90"
                style={{
                  backgroundColor: resolvedColors.primary,
                  color: resolvedColors.secondary,
                }}
              >
                Ver produtos
                <ArrowRight size={16} />
              </a>
            </div>
          </div>

          {/* Banner image */}
          <div className="relative hidden md:block">
            <div
              className="relative aspect-[4/3] overflow-hidden rounded-2xl"
              style={{ border: `1px solid ${resolvedColors.border}` }}
            >
              <Image
                src={bannerUrl}
                alt={`Banner de ${name}`}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
