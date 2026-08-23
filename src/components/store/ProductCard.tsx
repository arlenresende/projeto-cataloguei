"use client";

import Image from "next/image";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/providers/ThemeProvider";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  whatsapp?: string;
}

export function ProductCard({ product, whatsapp }: ProductCardProps) {
  const { resolvedColors, config } = useTheme();

  const handleContact = () => {
    if (whatsapp) {
      const message = encodeURIComponent(
        `Olá! Tenho interesse no produto: ${product.name}`
      );
      window.open(`https://wa.me/${whatsapp}?text=${message}`, "_blank");
    }
  };

  return (
    <div
      className={config.components.productCard}
      style={{
        backgroundColor: resolvedColors.cardBg,
        borderColor: resolvedColors.border,
      }}
    >
      <div className="relative aspect-square w-full overflow-hidden">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <h3
          className="font-semibold text-lg mb-1"
          style={{ color: resolvedColors.text }}
        >
          {product.name}
        </h3>
        <p
          className="text-sm mb-3 line-clamp-2"
          style={{ color: resolvedColors.text, opacity: 0.7 }}
        >
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <span
            className="text-xl font-bold"
            style={{ color: resolvedColors.primary }}
          >
            {product.price.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </span>
          {whatsapp && (
            <Button
              size="sm"
              onClick={handleContact}
              style={{
                backgroundColor: resolvedColors.primary,
                color: "#FFFFFF",
              }}
            >
              <MessageCircle className="size-4 mr-1" />
              WhatsApp
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
