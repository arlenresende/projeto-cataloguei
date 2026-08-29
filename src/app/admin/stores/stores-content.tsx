"use client";

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { Plus, Store, ExternalLink, Edit, Trash2, Eye } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { DeleteStoreDialog } from "@/components/admin/DeleteStoreDialog";
import { StoreLogoUpload } from "@/components/store-admin/store-logo-upload";
import { getSiteHost } from "@/lib/site-config";

interface StoreData {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logo: string | null;
  isActive: boolean;
  themeStore: string;
  createdAt: Date;
}

interface StoresContentProps {
  initialStore: StoreData | null;
}

export function StoresContent({ initialStore }: StoresContentProps) {
  const siteHost = getSiteHost();
  const [store, setStore] = useState<StoreData | null>(initialStore);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  function handleLogoChange(logoUrl: string | null) {
    setStore((currentStore) =>
      currentStore
        ? {
            ...currentStore,
            logo: logoUrl,
          }
        : currentStore
    );
  }

  async function handleDelete() {
    if (!store) return;

    setDeleteError(null);

    try {
      const res = await fetch(`/api/stores/${store.id}`, {
        method: "DELETE",
      });

      const result = await res.json().catch(() => null);

      if (res.ok) {
        setStore(null);
        setShowDelete(false);
        return;
      }

      setDeleteError(result?.error || "Erro ao excluir a loja.");
    } catch {
      setDeleteError("Erro de conexão. Tente novamente.");
    }
  }

  if (!store) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-[var(--brand-border)] bg-white py-20 text-center">
        <div className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-[var(--brand-tertiary)]">
          <Store size={28} className="text-[var(--brand-black)]/30" />
        </div>
        <p className="text-lg font-bold text-[var(--brand-black)]">
          Você ainda não possui uma loja
        </p>
        <p className="mt-2 max-w-sm text-sm font-medium text-[var(--brand-black)]/50">
          Crie sua loja e comece a cadastrar seus produtos.
        </p>
        <Link
          href="/admin/stores/new"
          className="mt-6 flex items-center gap-2 rounded-xl bg-[var(--brand-yellow)] px-6 py-2.5 text-sm font-bold text-[var(--brand-black)] transition-all hover:shadow-md"
        >
          <Plus size={16} />
          Criar minha loja
        </Link>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title="Minha loja"
        subtitle={`${siteHost}/${store.slug}`}
        action={
          <div className="flex gap-2">
            <Link
              href={`/${store.slug}`}
              target="_blank"
              className="flex items-center gap-2 rounded-xl border border-[var(--brand-border)] px-4 py-2.5 text-sm font-bold text-[var(--brand-black)] transition-colors hover:bg-[var(--brand-tertiary)]"
            >
              <ExternalLink size={16} />
              Visualizar
            </Link>
            <Link
              href={`/admin/stores/${store.id}/edit`}
              className="flex items-center gap-2 rounded-xl bg-[var(--brand-yellow)] px-4 py-2.5 text-sm font-bold text-[var(--brand-black)] transition-all hover:shadow-md"
            >
              <Edit size={16} />
              Editar
            </Link>
          </div>
        }
      />

      <div className="space-y-6">
        <div className="rounded-2xl border border-[var(--brand-border)] bg-white p-6 transition-all hover:shadow-md">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="relative flex size-12 items-center justify-center overflow-hidden rounded-xl bg-[var(--brand-yellow)] text-base font-extrabold text-[var(--brand-black)]">
                {store.logo ? (
                  <Image
                    src={store.logo}
                    alt={`Logo de ${store.name}`}
                    fill
                    className="bg-white object-contain p-1"
                    sizes="48px"
                  />
                ) : (
                  store.name.charAt(0)
                )}
              </div>
              <div>
                <p className="text-lg font-bold text-[var(--brand-black)]">
                  {store.name}
                </p>
                <p className="text-sm font-medium text-[var(--brand-black)]/40">
                  {siteHost}/{store.slug}
                </p>
              </div>
            </div>
            <Badge variant={store.isActive ? "success" : "neutral"}>
              {store.isActive ? "Ativa" : "Inativa"}
            </Badge>
          </div>

          {store.description && (
            <p className="mt-4 text-sm text-[var(--brand-black)]/60">
              {store.description}
            </p>
          )}

          <div className="mt-6 flex items-center gap-2 border-t border-[var(--brand-border)] pt-4">
            <Link
              href={`/${store.slug}`}
              target="_blank"
              className="flex items-center gap-1.5 rounded-lg border border-[var(--brand-border)] px-3 py-2 text-xs font-bold text-[var(--brand-black)] transition-colors hover:bg-[var(--brand-tertiary)]"
            >
              <ExternalLink size={12} />
              Visualizar
            </Link>
            <Link
              href={`/admin/stores/${store.id}`}
              className="flex items-center gap-1.5 rounded-lg border border-[var(--brand-border)] px-3 py-2 text-xs font-bold text-[var(--brand-black)] transition-colors hover:bg-[var(--brand-tertiary)]"
            >
              <Eye size={12} />
              Detalhes
            </Link>
            <Link
              href={`/admin/stores/${store.id}/edit`}
              className="flex items-center gap-1.5 rounded-lg border border-[var(--brand-border)] px-3 py-2 text-xs font-bold text-[var(--brand-black)] transition-colors hover:bg-[var(--brand-tertiary)]"
            >
              <Edit size={12} />
              Editar
            </Link>
            <button
              onClick={() => setShowDelete(true)}
              className="ml-auto flex items-center gap-1.5 rounded-lg p-2 text-xs font-bold text-red-500 transition-colors hover:bg-red-50"
            >
              <Trash2 size={14} />
              Excluir
            </button>
          </div>
        </div>

        <StoreLogoUpload
          storeId={store.id}
          storeName={store.name}
          initialLogoUrl={store.logo}
          onLogoChange={handleLogoChange}
        />
      </div>

      {showDelete && store && (
        <DeleteStoreDialog
          open={true}
          onClose={() => setShowDelete(false)}
          storeName={store.name}
          onConfirm={handleDelete}
          error={deleteError}
        />
      )}
    </>
  );
}
