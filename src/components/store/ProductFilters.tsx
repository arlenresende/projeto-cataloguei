"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { SlidersHorizontal } from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

interface ProductFiltersProps {
  categories: string[];
  storeUrl: string;
}

const PRICE_RANGES = [
  { label: "Todos os preços", min: "", max: "" },
  { label: "Até R$ 50", min: "", max: "50" },
  { label: "R$ 50 – R$ 150", min: "50", max: "150" },
  { label: "R$ 150 – R$ 300", min: "150", max: "300" },
  { label: "Acima de R$ 300", min: "300", max: "" },
];

export function ProductFilters({ categories, storeUrl }: ProductFiltersProps) {
  const { resolvedColors } = useTheme();
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get("category") || "";
  const currentMin = searchParams.get("min") || "";
  const currentMax = searchParams.get("max") || "";

  const buildUrl = useCallback(
    (category: string, min: string, max: string) => {
      const params = new URLSearchParams();
      if (category) params.set("category", category);
      if (min) params.set("min", min);
      if (max) params.set("max", max);
      const qs = params.toString();
      return `/${storeUrl}${qs ? `?${qs}` : ""}`;
    },
    [storeUrl]
  );

  const handleCategoryChange = (value: string | null) => {
    if (!value) return;
    router.push(buildUrl(value === "__all__" ? "" : value, currentMin, currentMax));
  };

  const handlePriceChange = (value: string | null) => {
    if (!value) return;
    const range = PRICE_RANGES[Number(value)];
    router.push(buildUrl(currentCategory, range.min, range.max));
  };

  const currentPriceIdx = PRICE_RANGES.findIndex(
    (r) => r.min === currentMin && r.max === currentMax
  );

  const categoryLabel = currentCategory || "Todas as categorias";
  const priceLabel = currentPriceIdx >= 0 ? PRICE_RANGES[currentPriceIdx].label : "Todos os preços";

  const triggerStyle = {
    borderColor: resolvedColors.border,
    backgroundColor: resolvedColors.cardBg,
    color: currentCategory || currentPriceIdx > 0 ? resolvedColors.text : resolvedColors.text + "99",
  };

  return (
    <section
      className="py-8 md:py-12"
      style={{ backgroundColor: resolvedColors.background }}
    >
      <div className="mx-auto max-w-6xl px-4">
        <div
          className="rounded-2xl border p-5 md:p-6"
          style={{
            borderColor: resolvedColors.border,
            backgroundColor: resolvedColors.cardBg,
          }}
        >
          <div className="mb-4 flex items-center gap-2.5">
            <SlidersHorizontal
              size={18}
              style={{ color: resolvedColors.text, opacity: 0.6 }}
            />
            <h2
              className="text-base font-extrabold tracking-tight"
              style={{ color: resolvedColors.text }}
            >
              Encontre seu produto
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label
                className="mb-1.5 block text-xs font-bold uppercase tracking-wider"
                style={{ color: resolvedColors.text, opacity: 0.5 }}
              >
                Categoria
              </label>
              <Select value={currentCategory || "__all__"} onValueChange={handleCategoryChange}>
                <SelectTrigger style={triggerStyle}>
                  <span>{categoryLabel}</span>
                </SelectTrigger>
                <SelectContent
                  style={{
                    borderColor: resolvedColors.border,
                    backgroundColor: resolvedColors.cardBg,
                    color: resolvedColors.text,
                  }}
                >
                  <SelectItem value="__all__">Todas as categorias</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label
                className="mb-1.5 block text-xs font-bold uppercase tracking-wider"
                style={{ color: resolvedColors.text, opacity: 0.5 }}
              >
                Preço
              </label>
              <Select
                value={String(currentPriceIdx >= 0 ? currentPriceIdx : 0)}
                onValueChange={handlePriceChange}
              >
                <SelectTrigger style={triggerStyle}>
                  <span>{priceLabel}</span>
                </SelectTrigger>
                <SelectContent
                  style={{
                    borderColor: resolvedColors.border,
                    backgroundColor: resolvedColors.cardBg,
                    color: resolvedColors.text,
                  }}
                >
                  {PRICE_RANGES.map((range, i) => (
                    <SelectItem key={i} value={String(i)}>
                      {range.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
