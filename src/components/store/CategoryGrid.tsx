"use client";

import Link from "next/link";
import { Cpu, Keyboard, Package } from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";

interface Category {
  name: string;
  count: number;
}

interface CategoryGridProps {
  categories: Category[];
  storeUrl: string;
}

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  "Eletrônicos": Cpu,
  "Acessórios": Package,
  "Periféricos": Keyboard,
};

export function CategoryGrid({ categories, storeUrl }: CategoryGridProps) {
  const { resolvedColors } = useTheme();

  if (categories.length === 0) return null;

  return (
    <section className="py-10 md:py-14">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2
              className="text-xl font-extrabold tracking-tight md:text-2xl"
              style={{ color: resolvedColors.text }}
            >
              Compre por categoria
            </h2>
            <p
              className="mt-1 text-sm font-medium"
              style={{ color: resolvedColors.text, opacity: 0.5 }}
            >
              Encontre exatamente o que precisa
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {categories.map((cat) => {
            const Icon = CATEGORY_ICONS[cat.name] || Package;
            return (
              <Link
                key={cat.name}
                href={`/${storeUrl}?category=${encodeURIComponent(cat.name)}`}
                className="group flex flex-col items-center gap-3 rounded-2xl border p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
                style={{
                  borderColor: resolvedColors.border,
                  backgroundColor: resolvedColors.cardBg,
                }}
              >
                <span
                  className="flex size-12 items-center justify-center rounded-2xl transition-all duration-200 group-hover:scale-110"
                  style={{
                    backgroundColor: resolvedColors.primary + "18",
                    color: resolvedColors.text,
                  }}
                >
                  <Icon size={22} strokeWidth={2} />
                </span>
                <div className="text-center">
                  <span
                    className="text-sm font-bold"
                    style={{ color: resolvedColors.text }}
                  >
                    {cat.name}
                  </span>
                  <p
                    className="mt-0.5 text-xs font-medium"
                    style={{ color: resolvedColors.text, opacity: 0.4 }}
                  >
                    {cat.count} {cat.count === 1 ? "item" : "itens"}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
