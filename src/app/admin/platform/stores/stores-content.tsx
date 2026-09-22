"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Ban, ExternalLink, Loader2, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { getSiteHost } from "@/lib/site-config";

type AdminStoreItem = {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  adminSuspendedAt: string | null;
  adminSuspensionReason: string | null;
  ownerName: string;
  ownerEmail: string;
  plan: "FREE" | "PREMIUM";
  subscriptionStatus: string;
  products: number;
  categories: number;
  banners: number;
  createdAt: string;
  updatedAt: string;
};

type AdminStoresContentProps = {
  stores: AdminStoreItem[];
};

function getStoreStatus(store: AdminStoreItem) {
  if (store.adminSuspendedAt) {
    return { label: "Suspensa", variant: "error" as const };
  }

  if (store.isActive) {
    return { label: "Ativa", variant: "success" as const };
  }

  return { label: "Inativa", variant: "neutral" as const };
}

export function AdminStoresContent({ stores }: AdminStoresContentProps) {
  const router = useRouter();
  const siteHost = getSiteHost();
  const [updatingStoreId, setUpdatingStoreId] = useState<string | null>(null);
  const [adminActionError, setAdminActionError] = useState<string | null>(null);

  async function handleStoreSuspension(store: AdminStoreItem) {
    const isSuspended = Boolean(store.adminSuspendedAt);
    const reason = isSuspended
      ? null
      : window.prompt(
          `Informe o motivo para suspender "${store.name}". O lojista não poderá reativar a loja sozinho.`
        );
    const suspensionReason = reason?.trim();

    if (!isSuspended && !suspensionReason) {
      return;
    }

    if (isSuspended && !window.confirm(`Reativar a loja "${store.name}"?`)) {
      return;
    }

    setAdminActionError(null);
    setUpdatingStoreId(store.id);

    try {
      const response = await fetch(`/api/admin/stores/${store.id}/suspension`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          isSuspended
            ? { action: "restore" }
            : { action: "suspend", reason: suspensionReason }
        ),
      });
      const payload = await response.json();

      if (!response.ok) {
        setAdminActionError(
          payload.error || "Não foi possível atualizar a loja."
        );
        return;
      }

      router.refresh();
    } catch {
      setAdminActionError("Erro de conexão ao atualizar a loja.");
    } finally {
      setUpdatingStoreId(null);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Lojas cadastradas"
        subtitle="Acompanhe todas as lojas, URLs, status e volume de catálogo."
      />

      {adminActionError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
          {adminActionError}
        </div>
      ) : null}

      <Card>
        <CardHeader
          action={<Badge variant="neutral">{stores.length} lojas</Badge>}
        >
          Todas as lojas
        </CardHeader>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[1040px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-[var(--brand-border)] text-left">
                <th className="pb-3 font-semibold text-[var(--brand-black)]">Loja</th>
                <th className="pb-3 font-semibold text-[var(--brand-black)]">URL</th>
                <th className="pb-3 font-semibold text-[var(--brand-black)]">Dono</th>
                <th className="pb-3 font-semibold text-[var(--brand-black)]">Plano</th>
                <th className="pb-3 font-semibold text-[var(--brand-black)]">Catálogo</th>
                <th className="pb-3 font-semibold text-[var(--brand-black)]">Status</th>
                <th className="pb-3 font-semibold text-[var(--brand-black)]">Criada em</th>
                <th className="pb-3 font-semibold text-[var(--brand-black)]">Ações</th>
              </tr>
            </thead>
            <tbody>
              {stores.map((store) => {
                const status = getStoreStatus(store);

                return (
                  <tr
                    key={store.id}
                    className="border-b border-[var(--brand-border)] last:border-b-0"
                  >
                    <td className="py-3">
                      <p className="font-semibold text-[var(--brand-black)]">
                        {store.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Atualizada em {new Date(store.updatedAt).toLocaleDateString("pt-BR")}
                      </p>
                    </td>
                    <td className="py-3">
                      <Link
                        href={`/${store.slug}`}
                        target="_blank"
                        className="inline-flex items-center gap-1.5 font-semibold text-[var(--brand-black)] hover:underline"
                      >
                        {siteHost}/{store.slug}
                        <ExternalLink className="size-3.5" />
                      </Link>
                    </td>
                    <td className="py-3 text-muted-foreground">
                      <span className="block text-[var(--brand-black)]">
                        {store.ownerName}
                      </span>
                      {store.ownerEmail}
                    </td>
                    <td className="py-3">
                      <Badge variant={store.plan === "PREMIUM" ? "default" : "neutral"}>
                        {store.plan}
                      </Badge>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {store.subscriptionStatus}
                      </p>
                    </td>
                    <td className="py-3 text-muted-foreground">
                      {store.products} produtos · {store.categories} categorias · {store.banners} banners
                    </td>
                    <td className="py-3">
                      <Badge variant={status.variant}>{status.label}</Badge>
                      {store.adminSuspensionReason ? (
                        <p className="mt-1 max-w-[220px] text-xs text-muted-foreground">
                          {store.adminSuspensionReason}
                        </p>
                      ) : null}
                    </td>
                    <td className="py-3 text-muted-foreground">
                      {new Date(store.createdAt).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="py-3">
                      <button
                        type="button"
                        onClick={() => handleStoreSuspension(store)}
                        disabled={updatingStoreId === store.id}
                        className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold transition-colors disabled:opacity-60 ${
                          store.adminSuspendedAt
                            ? "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                            : "border-red-200 text-red-600 hover:bg-red-50"
                        }`}
                      >
                        {updatingStoreId === store.id ? (
                          <Loader2 className="size-3.5 animate-spin" />
                        ) : store.adminSuspendedAt ? (
                          <RotateCcw className="size-3.5" />
                        ) : (
                          <Ban className="size-3.5" />
                        )}
                        {store.adminSuspendedAt ? "Reativar" : "Suspender"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
