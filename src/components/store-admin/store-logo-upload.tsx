"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { ImagePlus, Loader2, Store, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import {
  formatStoreLogoMaxSize,
  getStoreLogoFormatsLabel,
  STORE_LOGO_ACCEPT,
  STORE_LOGO_MAX_SIZE_BYTES,
} from "@/lib/store-logo";

interface StoreLogoUploadProps {
  storeId: string;
  storeName: string;
  initialLogoUrl: string | null;
  onLogoChange?: (logoUrl: string | null) => void;
}

export function StoreLogoUpload({
  storeId,
  storeName,
  initialLogoUrl,
  onLogoChange,
}: StoreLogoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [logoUrl, setLogoUrl] = useState(initialLogoUrl);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const displayLogoUrl = previewUrl ?? logoUrl;
  const hasLogo = Boolean(displayLogoUrl);
  const helperText = useMemo(
    () =>
      `Formatos aceitos: ${getStoreLogoFormatsLabel()} • Tamanho máximo: ${formatStoreLogoMaxSize()}`,
    []
  );

  function openFilePicker() {
    if (isUploading || isRemoving) {
      return;
    }

    inputRef.current?.click();
  }

  function updateLogo(url: string | null) {
    setLogoUrl(url);
    onLogoChange?.(url);
  }

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    if (file.size > STORE_LOGO_MAX_SIZE_BYTES) {
      toast.error(`A logo deve ter no máximo ${formatStoreLogoMaxSize()}.`);
      return;
    }

    if (!STORE_LOGO_ACCEPT.split(",").includes(file.type)) {
      toast.error("Formato inválido. Envie uma imagem JPG, PNG ou WEBP.");
      return;
    }

    const nextPreviewUrl = URL.createObjectURL(file);

    if (previewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }

    setPreviewUrl(nextPreviewUrl);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`/api/stores/${storeId}/logo`, {
        method: "POST",
        body: formData,
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(payload?.error || "Não foi possível enviar a logo.");
      }

      URL.revokeObjectURL(nextPreviewUrl);
      setPreviewUrl(null);
      updateLogo(payload.logoUrl);
      toast.success("Logo atualizada com sucesso.");
    } catch (error) {
      setPreviewUrl(null);
      toast.error(
        error instanceof Error ? error.message : "Não foi possível enviar a logo."
      );
    } finally {
      setIsUploading(false);
    }
  }

  async function handleRemoveLogo() {
    if (!logoUrl || isUploading || isRemoving) {
      return;
    }

    setIsRemoving(true);

    try {
      const response = await fetch(`/api/stores/${storeId}/logo`, {
        method: "DELETE",
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(payload?.error || "Não foi possível remover a logo.");
      }

      if (previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }

      setPreviewUrl(null);
      updateLogo(null);
      toast.success("Logo removida com sucesso.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Não foi possível remover a logo."
      );
    } finally {
      setIsRemoving(false);
    }
  }

  return (
    <Card className="p-6">
      <CardHeader className="mb-4">Logo da loja</CardHeader>

      <div className="space-y-4">
        <div className="overflow-hidden rounded-2xl border border-[var(--brand-border)] bg-[var(--brand-tertiary)]">
          <div className="flex min-h-52 items-center justify-center p-6 sm:min-h-60">
            {hasLogo ? (
              <div className="relative h-28 w-full max-w-[240px] overflow-hidden rounded-2xl bg-white shadow-sm">
                <Image
                  src={displayLogoUrl!}
                  alt={`Logo de ${storeName}`}
                  fill
                  className="object-contain p-4"
                  sizes="(max-width: 640px) 220px, 240px"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="flex size-16 items-center justify-center rounded-2xl bg-white text-[var(--brand-black)]/40 shadow-sm">
                  <Store size={26} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--brand-black)]">
                    Nenhuma logo enviada
                  </p>
                  <p className="text-sm text-[var(--brand-black)]/55">
                    Envie uma imagem para personalizar sua loja.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            type="button"
            onClick={openFilePicker}
            disabled={isUploading || isRemoving}
          >
            {isUploading ? (
              <>
                <Loader2 className="animate-spin" />
                Enviando logo...
              </>
            ) : hasLogo ? (
              <>
                <ImagePlus />
                Alterar logo
              </>
            ) : (
              <>
                <Upload />
                Selecionar imagem
              </>
            )}
          </Button>

          {logoUrl ? (
            <Button
              type="button"
              variant="outline"
              onClick={handleRemoveLogo}
              disabled={isUploading || isRemoving}
            >
              {isRemoving ? (
                <>
                  <Loader2 className="animate-spin" />
                  Removendo...
                </>
              ) : (
                <>
                  <Trash2 />
                  Remover logo
                </>
              )}
            </Button>
          ) : null}
        </div>

        <p className="text-sm text-[var(--brand-black)]/55">{helperText}</p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={STORE_LOGO_ACCEPT}
        className="sr-only"
        onChange={handleFileChange}
        disabled={isUploading || isRemoving}
      />
    </Card>
  );
}
