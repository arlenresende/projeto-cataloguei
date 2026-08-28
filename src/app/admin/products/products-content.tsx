"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Search,
  Star,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { DeleteProductDialog } from "./components/delete-product-dialog";

interface ProductData {
  id: string;
  name: string;
  slug: string;
  price: any;
  compareAtPrice: any | null;
  stock: number;
  minStock: number | null;
  active: boolean;
  featured: boolean;
  imageUrl: string | null;
  sku: string | null;
  createdAt: string;
  categoryRel: { id: string; name: string } | null;
  images: { id: string; url: string; alt: string | null; position: number }[];
  _count: { images: number };
}

interface CategoryOption {
  id: string;
  name: string;
}

interface ProductsContentProps {
  storeId: string;
  categories: CategoryOption[];
}

export function ProductsContent({ storeId, categories }: ProductsContentProps) {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [stockFilter, setStockFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [deleteTarget, setDeleteTarget] = useState<ProductData | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: "20",
      });
      if (search) params.set("search", search);
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (categoryFilter) params.set("category", categoryFilter);
      if (stockFilter !== "all") params.set("stock", stockFilter);

      const res = await fetch(`/api/products?${params}`);
      const data = await res.json();

      if (data.products) {
        setProducts(data.products);
        setTotalPages(data.pagination.totalPages);
        setTotal(data.pagination.total);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter, categoryFilter, stockFilter]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Debounce search
  const [searchInput, setSearchInput] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  async function handleToggleActive(product: ProductData) {
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !product.active }),
      });

      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) =>
            p.id === product.id ? { ...p, active: !p.active } : p
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
      const res = await fetch(`/api/products/${deleteTarget.id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        setDeleteError(data.error || "Erro ao excluir o produto.");
        return;
      }

      setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      setTotal((t) => t - 1);
      setDeleteTarget(null);
    } catch {
      setDeleteError("Erro de conexão. Tente novamente.");
    }
  }

  function formatPrice(value: any) {
    return Number(value).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  return (
    <>
      <PageHeader
        title="Produtos"
        subtitle={`${total} ${total === 1 ? "produto" : "produtos"}`}
        action={
          <Link
            href="/admin/products/new"
            className="flex items-center gap-2 rounded-xl bg-[var(--brand-yellow)] px-4 py-2.5 text-sm font-bold text-[var(--brand-black)] transition-all hover:shadow-md"
          >
            <Plus size={16} />
            Novo produto
          </Link>
        }
      />

      <Card noPadding>
        {/* Search + Filters */}
        <div className="space-y-3 border-b border-[var(--brand-border)] p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar por nome, SKU ou código de barras..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="h-10 w-full rounded-lg border border-[var(--brand-border)] bg-[var(--brand-tertiary)] pl-10 pr-4 text-sm outline-none transition-colors focus:border-[var(--brand-black)] focus:bg-white"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="rounded-lg border border-[var(--brand-border)] bg-white px-3 py-2 text-xs font-bold text-[var(--brand-black)]"
            >
              <option value="all">Todos os status</option>
              <option value="active">Ativos</option>
              <option value="inactive">Inativos</option>
            </select>
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setPage(1);
              }}
              className="rounded-lg border border-[var(--brand-border)] bg-white px-3 py-2 text-xs font-bold text-[var(--brand-black)]"
            >
              <option value="">Todas as categorias</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <select
              value={stockFilter}
              onChange={(e) => {
                setStockFilter(e.target.value);
                setPage(1);
              }}
              className="rounded-lg border border-[var(--brand-border)] bg-white px-3 py-2 text-xs font-bold text-[var(--brand-black)]"
            >
              <option value="all">Todo estoque</option>
              <option value="out">Sem estoque</option>
              <option value="low">Estoque baixo</option>
            </select>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="size-8 animate-spin rounded-full border-2 border-[var(--brand-yellow)] border-t-transparent" />
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-lg font-bold text-[var(--brand-black)]">
              {search || statusFilter !== "all" || categoryFilter || stockFilter !== "all"
                ? "Nenhum produto encontrado"
                : "Nenhum produto cadastrado"}
            </p>
            <p className="mt-2 max-w-sm text-sm font-medium text-[var(--brand-black)]/50">
              {search || statusFilter !== "all" || categoryFilter || stockFilter !== "all"
                ? "Tente ajustar os filtros."
                : "Crie seu primeiro produto para começar."}
            </p>
            {!search && statusFilter === "all" && !categoryFilter && stockFilter === "all" && (
              <Link
                href="/admin/products/new"
                className="mt-6 flex items-center gap-2 rounded-xl bg-[var(--brand-yellow)] px-6 py-2.5 text-sm font-bold text-[var(--brand-black)] transition-all hover:shadow-md"
              >
                <Plus size={16} />
                Criar primeiro produto
              </Link>
            )}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--brand-border)]">
                    <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Produto
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Categoria
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Preço
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Estoque
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Status
                    </th>
                    <th className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => {
                    const img = product.images?.[0]?.url || product.imageUrl;
                    const stockLow =
                      product.minStock != null &&
                      product.stock > 0 &&
                      product.stock <= product.minStock;
                    return (
                      <tr
                        key={product.id}
                        className="border-b border-[var(--brand-border)] last:border-0 transition-colors hover:bg-[var(--brand-tertiary)]"
                      >
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="relative size-10 shrink-0 overflow-hidden rounded-lg bg-[var(--brand-tertiary)]">
                              {img ? (
                                <Image
                                  src={img}
                                  alt={product.name}
                                  fill
                                  className="object-cover"
                                  sizes="40px"
                                />
                              ) : (
                                <div className="flex size-full items-center justify-center text-xs text-muted-foreground">
                                  ?
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium text-[var(--brand-black)]">
                                {product.name}
                              </p>
                              {product.sku && (
                                <p className="text-xs text-muted-foreground">
                                  SKU: {product.sku}
                                </p>
                              )}
                            </div>
                            {product.featured && (
                              <Star
                                size={14}
                                className="shrink-0 fill-[var(--brand-yellow)] text-[var(--brand-yellow)]"
                              />
                            )}
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-sm text-muted-foreground">
                          {product.categoryRel?.name || "—"}
                        </td>
                        <td className="px-5 py-3.5">
                          <div>
                            <span className="text-sm font-medium text-[var(--brand-black)]">
                              {formatPrice(product.price)}
                            </span>
                            {product.compareAtPrice && Number(product.compareAtPrice) > Number(product.price) && (
                              <span className="ml-2 text-xs text-muted-foreground line-through">
                                {formatPrice(product.compareAtPrice)}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          {product.stock === 0 ? (
                            <Badge variant="error">Sem estoque</Badge>
                          ) : stockLow ? (
                            <Badge variant="warning">Baixo ({product.stock})</Badge>
                          ) : (
                            <span className="text-sm text-[var(--brand-black)]">
                              {product.stock}
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-3.5">
                          <Badge variant={product.active ? "success" : "neutral"}>
                            {product.active ? "Ativo" : "Inativo"}
                          </Badge>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center justify-end gap-1">
                            <Link
                              href={`/${product.slug}`}
                              target="_blank"
                              className="rounded-lg p-2 text-[var(--brand-black)]/40 transition-colors hover:bg-[var(--brand-tertiary)] hover:text-[var(--brand-black)]"
                              title="Ver na loja"
                            >
                              <ExternalLink size={16} />
                            </Link>
                            <button
                              onClick={() => handleToggleActive(product)}
                              className="rounded-lg p-2 text-[var(--brand-black)]/40 transition-colors hover:bg-[var(--brand-tertiary)] hover:text-[var(--brand-black)]"
                              title={product.active ? "Desativar" : "Ativar"}
                            >
                              {product.active ? (
                                <EyeOff size={16} />
                              ) : (
                                <Eye size={16} />
                              )}
                            </button>
                            <Link
                              href={`/admin/products/${product.id}/edit`}
                              className="rounded-lg p-2 text-[var(--brand-black)]/40 transition-colors hover:bg-[var(--brand-tertiary)] hover:text-[var(--brand-black)]"
                            >
                              <Edit size={16} />
                            </Link>
                            <button
                              onClick={() => {
                                setDeleteError(null);
                                setDeleteTarget(product);
                              }}
                              className="rounded-lg p-2 text-red-400 transition-colors hover:bg-red-50 hover:text-red-600"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-[var(--brand-border)] px-5 py-3">
                <p className="text-xs text-muted-foreground">
                  Página {page} de {totalPages}
                </p>
                <div className="flex gap-1">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="rounded-lg p-2 text-[var(--brand-black)]/40 transition-colors hover:bg-[var(--brand-tertiary)] disabled:opacity-30"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="rounded-lg p-2 text-[var(--brand-black)]/40 transition-colors hover:bg-[var(--brand-tertiary)] disabled:opacity-30"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </Card>

      {deleteTarget && (
        <DeleteProductDialog
          open={true}
          onClose={() => setDeleteTarget(null)}
          productName={deleteTarget.name}
          onConfirm={handleDelete}
          error={deleteError}
        />
      )}
    </>
  );
}
