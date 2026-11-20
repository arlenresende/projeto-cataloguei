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
      const params = new URLSearchParams(searchParams.toString());
      params.delete("category");
      params.delete("min");
      params.delete("max");
      if (category) params.set("category", category);
      if (min) params.set("min", min);
      if (max) params.set("max", max);
      const qs = params.toString();
      return `/${storeUrl}${qs ? `?${qs}` : ""}`;
    },
    [storeUrl, searchParams]
  );

  const handleCategoryChange = (value: string | null) => {
    if (!value) return;
    router.push(buildUrl(value === "__all__" ? "" : value, currentMin, currentMax), { scroll: false });
  };

  const handlePriceChange = (value: string | null) => {
    if (!value) return;
    const range = PRICE_RANGES[Number(value)];
    router.push(buildUrl(currentCategory, range.min, range.max), { scroll: false });
  };

  const currentPriceIdx = PRICE_RANGES.findIndex(
    (r) => r.min === currentMin && r.max === currentMax
  );

  const categoryLabel = currentCategory || "Todas as categorias";
  const priceLabel = currentPriceIdx >= 0 ? PRICE_RANGES[currentPriceIdx].label : "Todos os preços";

  const triggerStyle = {
    borderColor: resolvedColors.border,
    backgroundColor: resolvedColors.cardBg,
    color: resolvedColors.text,
  };

  return (
    <div
      role="group"
      aria-label="Filtrar produtos"
      className="mb-5 flex items-center gap-2 border-b pb-5 md:gap-3"
      style={{ borderColor: resolvedColors.border }}
    >
      <span className="hidden shrink-0 items-center gap-2 text-sm font-medium sm:flex" style={{ color: resolvedColors.text }}>
        <SlidersHorizontal size={16} aria-hidden="true" />
        Filtrar
      </span>
      <div className="min-w-0 flex-1 sm:max-w-64">
        <Select value={currentCategory || "__all__"} onValueChange={handleCategoryChange}>
          <SelectTrigger aria-label="Categoria" className="gap-2 px-3 font-medium focus-visible:ring-2 focus-visible:ring-current" style={triggerStyle}>
            <span className="truncate">
            <span className="sm:hidden">{currentCategory || "Categorias"}</span>
            <span className="hidden sm:inline">{categoryLabel}</span>
          </span>
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

      <div className="min-w-0 flex-1 sm:max-w-56">
        <Select
          value={String(currentPriceIdx >= 0 ? currentPriceIdx : 0)}
          onValueChange={handlePriceChange}
        >
          <SelectTrigger aria-label="Preço" className="gap-2 px-3 font-medium focus-visible:ring-2 focus-visible:ring-current" style={triggerStyle}>
            <span className="truncate">{priceLabel}</span>
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
  );
}
