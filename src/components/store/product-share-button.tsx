"use client";

import { Share2 } from "lucide-react";
import { toast } from "sonner";
import { trackAnalyticsEvent } from "@/lib/analytics/client";

interface ProductShareButtonProps {
  title: string;
  description: string;
  url: string;
  storeSlug: string;
  productId: string;
}

export function ProductShareButton({
  title,
  description,
  url,
  storeSlug,
  productId,
}: ProductShareButtonProps) {
  async function copyUrl() {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(url);
      return true;
    }

    const textArea = document.createElement("textarea");
    textArea.value = url;
    textArea.setAttribute("readonly", "");
    textArea.style.position = "absolute";
    textArea.style.left = "-9999px";
    document.body.appendChild(textArea);
    textArea.select();

    const copied = document.execCommand("copy");
    document.body.removeChild(textArea);

    return copied;
  }

  async function handleShare() {
    trackAnalyticsEvent({
      type: "SHARE_CLICK",
      storeSlug,
      productId,
      metadata: { source: "product_page" },
    });

    try {
      if (navigator.share) {
        await navigator.share({
          title,
          text: description,
          url,
        });
        toast.success("Produto compartilhado com sucesso.");
        return;
      }

      const copied = await copyUrl();

      if (copied) {
        toast.success("Link do produto copiado.");
        return;
      }

      window.prompt("Copie o link do produto:", url);
      toast.success("Copie o link do produto para compartilhar.");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }

      try {
        const copied = await copyUrl();

        if (copied) {
          toast.success("Link do produto copiado.");
          return;
        }
      } catch {
        // Se a cópia falhar, seguimos para o prompt manual.
      }

      window.prompt("Copie o link do produto:", url);
      toast.success("Copie o link do produto para compartilhar.");
    }
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className="flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold transition-all hover:shadow-md"
      style={{
        backgroundColor: "var(--theme-primary)",
        color: "var(--theme-secondary)",
      }}
    >
      <Share2 size={16} />
      Compartilhar produto
    </button>
  );
}
