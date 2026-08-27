"use client";

import Link from "next/link";
import { useTheme } from "@/components/providers/ThemeProvider";

interface PriceRange {
  label: string;
  subtitle: string;
  min?: number;
  max?: number;
}

interface PriceRangeNavProps {
  storeUrl: string;
}

const RANGES: PriceRange[] = [
  { label: "Até R$ 50", subtitle: "Acessórios", max: 50 },
  { label: "R$ 50 – R$ 150", subtitle: "Essenciais", min: 50, max: 150 },
  { label: "R$ 150 – R$ 300", subtitle: "Premium", min: 150, max: 300 },
  { label: "Acima de R$ 300", subtitle: "Top de linha", min: 300 },
];

export function PriceRangeNav({ storeUrl }: PriceRangeNavProps) {
  const { resolvedColors } = useTheme();

  return (
    <section
      className="py-10 md:py-14"
      style={{ backgroundColor: resolvedColors.secondary }}
    >
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-6 text-center">
          <h2
            className="text-xl font-extrabold tracking-tight md:text-2xl"
            style={{ color: resolvedColors.cardBg }}
          >
            Navegar por preço
          </h2>
          <p
            className="mt-1 text-sm font-medium"
            style={{ color: resolvedColors.cardBg, opacity: 0.6 }}
          >
            Encontre produtos dentro do seu orçamento
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {RANGES.map((range) => {
            const params = new URLSearchParams();
            if (range.min !== undefined) params.set("min", String(range.min));
            if (range.max !== undefined) params.set("max", String(range.max));

            return (
              <Link
                key={range.label}
                href={`/${storeUrl}?${params.toString()}`}
                className="group flex flex-col items-center gap-1 rounded-2xl border px-4 py-5 text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
                style={{
                  borderColor: resolvedColors.cardBg + "20",
                  backgroundColor: resolvedColors.cardBg + "10",
                }}
              >
                <span
                  className="text-sm font-bold transition-colors"
                  style={{ color: resolvedColors.cardBg }}
                >
                  {range.label}
                </span>
                <span
                  className="text-xs font-medium"
                  style={{ color: resolvedColors.cardBg, opacity: 0.5 }}
                >
                  {range.subtitle}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
