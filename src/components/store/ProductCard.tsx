"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Eye, MessageCircle } from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";
import { buildProductImageAlt } from "@/lib/seo";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  storeUrl: string;
  whatsapp?: string;
}

export function ProductCard({ product, storeUrl, whatsapp }: ProductCardProps) {
  const { resolvedColors } = useTheme();
  const images =
    product.images?.length
      ? product.images
      : product.imageUrl
        ? [product.imageUrl]
        : ["/placeholder-product.svg"];
  const [imgIndex, setImgIndex] = useState(0);
  const hasMultiple = images.length > 1;
  const comparePrice = product.compareAtPrice || product.originalPrice;
  const discount =
    comparePrice && comparePrice > product.price
      ? Math.round(
          ((comparePrice - product.price) / comparePrice) * 100
        )
      : null;

  const nextImg = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setImgIndex((i) => (i + 1) % images.length);
  };

  const prevImg = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setImgIndex((i) => (i - 1 + images.length) % images.length);
  };

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.preventDefault();
    if (whatsapp) {
      const message = encodeURIComponent(
        `Olá! Tenho interesse no produto: ${product.name}`
      );
      window.open(`https://wa.me/${whatsapp}?text=${message}`, "_blank");
    }
  };

  return (
    <article
      className="group overflow-hidden rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
      style={{
        backgroundColor: resolvedColors.cardBg,
        borderColor: resolvedColors.border,
      }}
    >
      {/* Image — clickable */}
      <Link
        href={`/${storeUrl}/product/${product.slug || product.id}`}
        className="relative block aspect-[4/3] w-full overflow-hidden"
      >
        <Image
          src={images[imgIndex]}
          alt={buildProductImageAlt({
            productName: product.name,
            brand: product.brand,
            category: product.category,
            position: hasMultiple ? imgIndex + 1 : undefined,
          })}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        {discount && (
          <span
            className="absolute left-3 top-3 z-10 rounded-lg px-2.5 py-1 text-xs font-bold shadow-sm"
            style={{
              backgroundColor: resolvedColors.primary,
              color: resolvedColors.secondary,
            }}
          >
            -{discount}%
          </span>
        )}

        {hasMultiple && (
          <>
            <button
              onClick={prevImg}
              className="absolute left-2 top-1/2 z-10 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 opacity-0 shadow-sm backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:bg-white group-hover:opacity-100"
              style={{ color: resolvedColors.text }}
              aria-label="Imagem anterior"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={nextImg}
              className="absolute right-2 top-1/2 z-10 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 opacity-0 shadow-sm backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:bg-white group-hover:opacity-100"
              style={{ color: resolvedColors.text }}
              aria-label="Próxima imagem"
            >
              <ChevronRight size={16} />
            </button>
            <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
              {images.map((_, i) => (
                <span
                  key={i}
                  className="size-2 rounded-full transition-all duration-200"
                  style={{
                    backgroundColor:
                      i === imgIndex
                        ? resolvedColors.primary
                        : resolvedColors.cardBg + "B0",
                    transform: i === imgIndex ? "scale(1.2)" : "scale(1)",
                  }}
                />
              ))}
            </div>
          </>
        )}
      </Link>

      {/* Content */}
      <div className="p-4 md:p-5">
        <p
          className="text-[11px] font-bold uppercase tracking-wider"
          style={{ color: resolvedColors.text, opacity: 0.4 }}
        >
          {product.category}
        </p>
        <h3
          className="mt-1.5 text-[15px] font-bold leading-snug"
          style={{ color: resolvedColors.text }}
        >
          {product.name}
        </h3>

        <div className="mt-3 flex items-baseline gap-2">
          {comparePrice && comparePrice > product.price && (
            <span
              className="text-xs font-medium line-through"
              style={{ color: resolvedColors.text, opacity: 0.35 }}
            >
              {comparePrice.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </span>
          )}
          <span
            className="text-lg font-extrabold"
            style={{ color: resolvedColors.text }}
          >
            {product.price.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </span>
        </div>

        {/* Action buttons */}
        <div className="mt-4 flex flex-col gap-2">
          <Link
            href={`/${storeUrl}/product/${product.slug || product.id}`}
            className="flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition-all hover:shadow-md"
            style={{
              backgroundColor: resolvedColors.primary,
              color: resolvedColors.secondary,
            }}
          >
            <Eye size={14} />
            Ver detalhes
          </Link>
          {whatsapp && (
            <button
              onClick={handleWhatsApp}
              className="flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold text-white transition-all hover:opacity-90"
              style={{ backgroundColor: "#25D366" }}
            >
              <MessageCircle size={14} />
              Chamar no WhatsApp
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
