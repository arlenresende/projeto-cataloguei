"use client";

import { Truck } from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";

interface StoreCtaBannerProps {
  title: string;
  description: string;
  buttonText?: string;
  buttonLink?: string;
}

export function StoreCtaBanner({
  title,
  description,
  buttonText,
  buttonLink,
}: StoreCtaBannerProps) {
  const { resolvedColors } = useTheme();

  return (
    <section
      className="py-2"
      style={{ backgroundColor: resolvedColors.background }}
    >
      <div className="mx-auto max-w-6xl px-4">
        <div
          className="flex flex-col items-center gap-4 rounded-2xl px-6 py-8 text-center md:flex-row md:text-left md:py-10 md:px-10"
          style={{
            backgroundColor: resolvedColors.primary,
            color: resolvedColors.secondary,
          }}
        >
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-black/10">
            <Truck size={24} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-extrabold md:text-xl">{title}</h3>
            <p className="mt-1 text-sm font-medium opacity-70">{description}</p>
          </div>
          {buttonText && (
            <a
              href={buttonLink || "#"}
              className="shrink-0 rounded-xl bg-[var(--theme-secondary)] px-6 py-2.5 text-sm font-bold transition-all hover:shadow-lg"
              style={{ color: resolvedColors.primary }}
            >
              {buttonText}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
