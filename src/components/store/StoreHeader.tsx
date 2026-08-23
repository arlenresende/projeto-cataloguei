"use client";

import Image from "next/image";
import { useTheme } from "@/components/providers/ThemeProvider";

interface StoreHeaderProps {
  name: string;
  description: string;
  logoUrl: string;
  bannerUrl: string;
}

export function StoreHeader({
  name,
  description,
  logoUrl,
  bannerUrl,
}: StoreHeaderProps) {
  const { resolvedColors } = useTheme();

  return (
    <div className="relative">
      <div className="relative h-48 md:h-64 w-full overflow-hidden">
        <Image
          src={bannerUrl}
          alt={`Banner de ${name}`}
          fill
          className="object-cover"
          priority
        />
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to top, ${resolvedColors.background}, transparent)`,
          }}
        />
      </div>
      <div className="relative max-w-5xl mx-auto px-4 -mt-12">
        <div className="flex items-end gap-4">
          <div
            className="relative size-24 rounded-xl overflow-hidden border-4 shadow-lg"
            style={{ borderColor: resolvedColors.cardBg }}
          >
            <Image
              src={logoUrl}
              alt={`Logo de ${name}`}
              fill
              className="object-cover"
            />
          </div>
          <div className="pb-1">
            <h1
              className="text-2xl md:text-3xl font-bold"
              style={{ color: resolvedColors.text }}
            >
              {name}
            </h1>
            <p
              className="text-sm md:text-base mt-1"
              style={{ color: resolvedColors.text, opacity: 0.7 }}
            >
              {description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
