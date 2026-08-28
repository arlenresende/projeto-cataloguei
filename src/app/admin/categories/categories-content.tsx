"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2, Eye, EyeOff, Search } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { DeleteCategoryDialog } from "./components/delete-category-dialog";

interface CategoryData {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isActive: boolean;
  createdAt: Date;
  _count: { products: number };
}

interface CategoriesContentProps {
  initialCategories: CategoryData[];
}

export function CategoriesContent({ initialCategories }: CategoriesContentProps) {
  const [categories, setCategories] = useState<CategoryData[]>(initialCategories);
  const [deleteTarget, setDeleteTarget] = useState<CategoryData | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");

  const filtered = categories.filter((cat) => {
    const matchesSearch = cat.name.toLowerCase().includes(search.toLowerCase()) ||
      cat.slug.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && cat.isActive) ||
      (statusFilter === "inactive" && !cat.isActive);
    return matchesSearch && matchesStatus;
  });

  async function handleToggleActive(category: CategoryData) {
    try {
      const res = await fetch(`/api/categories/${category.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !category.isActive }),
      });

      if (res.ok) {
        setCategories((prev) =>
          prev.map((c) =>
            c.id === category.id ? { ...c, isActive: !c.isActive } : c
          )
        );
      }
    } catch {
      // silent
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleteError(null);

    try {
      const res = await fetch(`/api/categories/${deleteTarget.id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        setDeleteError(data.error || "Erro ao excluir a categoria.");
        return;
      }

      setCategories((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch {
      setDeleteError("Erro de conexão. Tente novamente.");
    }
  }

  return (
    <>
      <PageHeader
        title="Categorias"
        subtitle={`${categories.length} ${categories.length === 1 ? "categoria" : "categorias"}`}
        action={
          <Link
            href="/admin/categories/new"
            className="flex items-center gap-2 rounded-xl bg-[var(--brand-yellow)] px-4 py-2.5 text-sm font-bold text-[var(--brand-black)] transition-all hover:shadow-md"
          >
            <Plus size={16} />
            Nova categoria
          </Link>
        }
      />

      {/* Search + Filter */}
      <Card noPadding>
        <div className="flex flex-col gap-3 border-b border-[var(--brand-border)] p-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar categorias..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 w-full rounded-lg border border-[var(--brand-border)] bg-[var(--brand-tertiary)] pl-10 pr-4 text-sm outline-none transition-colors focus:border-[var(--brand-black)] focus:bg-white"
            />
          </div>
          <div className="flex gap-2">
            {(["all", "active", "inactive"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`rounded-lg px-3 py-2 text-xs font-bold transition-colors ${
                  statusFilter === s
                    ? "bg-[var(--brand-black)] text-white"
                    : "bg-[var(--brand-tertiary)] text-[var(--brand-black)] hover:bg-[var(--brand-border)]"
                }`}
              >
                {s === "all" ? "Todas" : s === "active" ? "Ativas" : "Inativas"}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-lg font-bold text-[var(--brand-black)]">
              {search || statusFilter !== "all"
                ? "Nenhuma categoria encontrada"
                : "Nenhuma categoria cadastrada"}
            </p>
            <p className="mt-2 max-w-sm text-sm font-medium text-[var(--brand-black)]/50">
              {search || statusFilter !== "all"
                ? "Tente ajustar os filtros de busca."
                : "Crie categorias para organizar os produtos da sua loja."}
            </p>
            {!search && statusFilter === "all" && (
              <Link
                href="/admin/categories/new"
                className="mt-6 flex items-center gap-2 rounded-xl bg-[var(--brand-yellow)] px-6 py-2.5 text-sm font-bold text-[var(--brand-black)] transition-all hover:shadow-md"
              >
                <Plus size={16} />
                Criar primeira categoria
              </Link>
            )}
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--brand-border)]">
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Nome
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Slug
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Produtos
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Status
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Criada em
                </th>
                <th className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((cat) => (
                <tr
                  key={cat.id}
                  className="border-b border-[var(--brand-border)] last:border-0 transition-colors hover:bg-[var(--brand-tertiary)]"
                >
                  <td className="px-5 py-3.5">
                    <p className="text-sm font-medium text-[var(--brand-black)]">
                      {cat.name}
                    </p>
                    {cat.description && (
                      <p className="mt-0.5 max-w-xs truncate text-xs text-muted-foreground">
                        {cat.description}
                      </p>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-sm text-muted-foreground">
                    {cat.slug}
                  </td>
                  <td className="px-5 py-3.5 text-sm text-[var(--brand-black)]">
                    {cat._count.products}
                  </td>
                  <td className="px-5 py-3.5">
                    <Badge variant={cat.isActive ? "success" : "neutral"}>
                      {cat.isActive ? "Ativa" : "Inativa"}
                    </Badge>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-muted-foreground">
                    {new Date(cat.createdAt).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleToggleActive(cat)}
                        className="rounded-lg p-2 text-[var(--brand-black)]/40 transition-colors hover:bg-[var(--brand-tertiary)] hover:text-[var(--brand-black)]"
                        title={cat.isActive ? "Desativar" : "Ativar"}
                      >
                        {cat.isActive ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                      <Link
                        href={`/admin/categories/${cat.id}/edit`}
                        className="rounded-lg p-2 text-[var(--brand-black)]/40 transition-colors hover:bg-[var(--brand-tertiary)] hover:text-[var(--brand-black)]"
                      >
                        <Edit size={16} />
                      </Link>
                      <button
                        onClick={() => {
                          setDeleteError(null);
                          setDeleteTarget(cat);
                        }}
                        className="rounded-lg p-2 text-red-400 transition-colors hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      {deleteTarget && (
        <DeleteCategoryDialog
          open={true}
          onClose={() => setDeleteTarget(null)}
          categoryName={deleteTarget.name}
          productCount={deleteTarget._count.products}
          onConfirm={handleDelete}
          error={deleteError}
        />
      )}
    </>
  );
}
