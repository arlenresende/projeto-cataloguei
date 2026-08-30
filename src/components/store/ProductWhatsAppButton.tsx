"use client";

import { MessageCircle } from "lucide-react";
import { trackAnalyticsEvent } from "@/lib/analytics/client";

type ProductWhatsAppButtonProps = {
  whatsapp: string;
  storeSlug: string;
  productId: string;
  productName: string;
};

export function ProductWhatsAppButton({
  whatsapp,
  storeSlug,
  productId,
  productName,
}: ProductWhatsAppButtonProps) {
  const message = encodeURIComponent(
    `Olá! Tenho interesse no produto: ${productName}`
  );

  function handleClick() {
    trackAnalyticsEvent({
      type: "PRODUCT_WHATSAPP_CLICK",
      storeSlug,
      productId,
      metadata: { source: "product_page" },
    });
  }

  return (
    <a
      href={`https://wa.me/${whatsapp}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className="flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-base font-bold text-white transition-all hover:shadow-lg"
      style={{ backgroundColor: "#25D366" }}
    >
      <MessageCircle size={20} />
      Comprar pelo WhatsApp
    </a>
  );
}
