"use client";

import { MessageCircle } from "lucide-react";
import { trackAnalyticsEvent } from "@/lib/analytics/client";

interface FloatingWhatsAppProps {
  whatsapp: string;
  storeName: string;
  storeSlug: string;
}

export function FloatingWhatsApp({
  whatsapp,
  storeName,
  storeSlug,
}: FloatingWhatsAppProps) {
  const handleClick = () => {
    trackAnalyticsEvent({
      type: "WHATSAPP_CLICK",
      storeSlug,
      metadata: { source: "floating_button" },
    });
    const message = encodeURIComponent(
      `Olá! Gostaria de saber mais sobre os produtos da ${storeName}.`
    );
    window.open(`https://wa.me/${whatsapp}?text=${message}`, "_blank");
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-5 right-5 z-40 flex size-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-110 md:bottom-6 md:right-6 md:size-14"
      aria-label="Contato via WhatsApp"
      title="Fale conosco pelo WhatsApp"
    >
      <MessageCircle className="size-6 md:size-7" />
    </button>
  );
}
