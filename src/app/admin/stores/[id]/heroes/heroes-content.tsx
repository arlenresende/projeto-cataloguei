"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2, Eye, EyeOff, GripVertical } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { DeleteHeroDialog } from "./components/delete-hero-dialog";

interface HeroData {
  id: string;
  title: string;
  description: string | null;
  image: string | null;
  bgColor: string | null;
  buttonText: string | null;
  buttonUrl: string | null;
  position: number;
  isActive: boolean;
}

interface HeroesContentProps {
  storeId: string;
  initialHeroes: HeroData[];
}

export function HeroesContent({ storeId, initialHeroes }: HeroesContentProps) {
  const [heroes, setHeroes] = useState<HeroData[]>(initialHeroes);
  const [deleteTarget, setDeleteTarget] = useState<HeroData | null>(null);

  async function handleToggleActive(hero: HeroData) {
    try {
      const res = await fetch(`/api/stores/${storeId}/heroes/${hero.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !hero.isActive }),
      });

      if (res.ok) {
        setHeroes((prev) =>
          prev.map((h) =>
            h.id === hero.id ? { ...h, isActive: !h.isActive } : h
          )
        );
      }
    } catch {
      // silent
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;

    try {
      const res = await fetch(`/api/stores/${storeId}/heroes/${deleteTarget.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setHeroes((prev) => prev.filter((h) => h.id !== deleteTarget.id));
        setDeleteTarget(null);
      }
    } catch {
      // silent
    }
  }

  return (
    <>
      <PageHeader
        title="Heroes da loja"
        subtitle={`${heroes.length} ${heroes.length === 1 ? "hero" : "heroes"}`}
        action={
          <Link
            href={`/admin/stores/${storeId}/heroes/new`}
            className="flex items-center gap-2 rounded-xl bg-[var(--brand-yellow)] px-4 py-2.5 text-sm font-bold text-[var(--brand-black)] transition-all hover:shadow-md"
          >
            <Plus size={16} />
            Novo hero
          </Link>
        }
      />

      {heroes.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-[var(--brand-border)] bg-white py-20 text-center">
          <p className="text-lg font-bold text-[var(--brand-black)]">
            Nenhum hero cadastrado
          </p>
          <p className="mt-2 max-w-sm text-sm font-medium text-[var(--brand-black)]/50">
            Crie heroes para destacar promoções, novidades ou campanhas na sua loja.
          </p>
          <Link
            href={`/admin/stores/${storeId}/heroes/new`}
            className="mt-6 flex items-center gap-2 rounded-xl bg-[var(--brand-yellow)] px-6 py-2.5 text-sm font-bold text-[var(--brand-black)] transition-all hover:shadow-md"
          >
            <Plus size={16} />
            Criar primeiro hero
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {heroes.map((hero) => (
            <div
              key={hero.id}
              className="flex items-center gap-4 rounded-2xl border border-[var(--brand-border)] bg-white p-4 transition-all hover:shadow-md"
            >
              <div className="flex items-center gap-2 text-[var(--brand-black)]/20">
                <GripVertical size={16} />
                <span className="flex size-7 items-center justify-center rounded-lg bg-[var(--brand-tertiary)] text-xs font-bold text-[var(--brand-black)]/50">
                  {hero.position}
                </span>
              </div>

              <div
                className="flex size-12 shrink-0 items-center justify-center rounded-xl text-xs font-bold"
                style={{
                  backgroundColor: hero.bgColor || "var(--brand-tertiary)",
                  color: "var(--brand-black)",
                }}
              >
                {hero.title.charAt(0)}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate font-bold text-[var(--brand-black)]">
                  {hero.title}
                </p>
                {hero.description && (
                  <p className="truncate text-xs text-[var(--brand-black)]/50">
                    {hero.description}
                  </p>
                )}
              </div>

              <Badge variant={hero.isActive ? "success" : "neutral"}>
                {hero.isActive ? "Ativo" : "Inativo"}
              </Badge>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleToggleActive(hero)}
                  className="rounded-lg p-2 text-[var(--brand-black)]/40 transition-colors hover:bg-[var(--brand-tertiary)] hover:text-[var(--brand-black)]"
                  title={hero.isActive ? "Desativar" : "Ativar"}
                >
                  {hero.isActive ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
                <Link
                  href={`/admin/stores/${storeId}/heroes/${hero.id}/edit`}
                  className="rounded-lg p-2 text-[var(--brand-black)]/40 transition-colors hover:bg-[var(--brand-tertiary)] hover:text-[var(--brand-black)]"
                >
                  <Edit size={16} />
                </Link>
                <button
                  onClick={() => setDeleteTarget(hero)}
                  className="rounded-lg p-2 text-red-400 transition-colors hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {deleteTarget && (
        <DeleteHeroDialog
          open={true}
          onClose={() => setDeleteTarget(null)}
          heroTitle={deleteTarget.title}
          onConfirm={handleDelete}
        />
      )}
    </>
  );
}
