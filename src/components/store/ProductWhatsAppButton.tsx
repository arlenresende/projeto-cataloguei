"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "@/components/providers/CartProvider";

type ProductWhatsAppButtonProps = {
  productId: string;
  productName: string;
  productSlug?: string | null;
  productPrice: number;
  productImageUrl?: string | null;
};

export function ProductWhatsAppButton({
  productId,
  productName,
  productSlug,
  productPrice,
  productImageUrl,
}: ProductWhatsAppButtonProps) {
  const { addItem } = useCart();

  function handleClick() {
    addItem({
      id: productId,
      name: productName,
      slug: productSlug,
      price: productPrice,
      imageUrl: productImageUrl,
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-base font-bold text-white transition-all hover:shadow-lg"
      style={{ backgroundColor: "#25D366" }}
    >
      <ShoppingBag size={20} />
      Adicionar ao carrinho
    </button>
  );
}
