"use client";

import Image from "next/image";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  storeUrl: string;
  whatsapp?: string;
}

export function ProductCard({ product, storeUrl, whatsapp }: ProductCardProps) {
  const { resolvedColors } = useTheme();

  const handleContact = (e: React.MouseEvent) => {
    e.preventDefault();
    if (whatsapp) {
      const message = encodeURIComponent(
        `Olá! Tenho interesse no produto: ${product.name}`
      );
      window.open(`https://wa.me/${whatsapp}?text=${message}`, "_blank");
    }
  };

  return (
    <Link
      href={`/${storeUrl}/product/${product.id}`}
      className="group block overflow-hidden rounded-xl border transition-all hover:-translate-y-0.5 hover:shadow-md"
      style={{
        backgroundColor: resolvedColors.cardBg,
        borderColor: resolvedColors.border,
      }}
    >
      {/* Image */}
      <div className="relative aspect-square w-full overflow-hidden">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        <p
          className="text-xs font-medium"
          style={{ color: resolvedColors.text, opacity: 0.5 }}
        >
          {product.category}
        </p>
        <h3
          className="mt-1 text-sm font-semibold leading-snug"
          style={{ color: resolvedColors.text }}
        >
          {product.name}
        </h3>
        <p
          className="mt-1 text-xs line-clamp-2"
          style={{ color: resolvedColors.text, opacity: 0.6 }}
        >
          {product.description}
        </p>

        <div className="mt-3 flex items-center justify-between">
          <span
            className="text-lg font-bold"
            style={{ color: resolvedColors.text }}
          >
            {product.price.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </span>
          {whatsapp && (
            <button
              onClick={handleContact}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-opacity hover:opacity-90"
              style={{
                backgroundColor: resolvedColors.primary,
                color: resolvedColors.secondary,
              }}
            >
              <MessageCircle size={14} />
              WhatsApp
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}
