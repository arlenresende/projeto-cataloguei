import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";

const mockProducts = [
  { id: "1", name: "Fone Bluetooth Pro", price: 299.9, category: "Eletrônicos", status: "Ativo" },
  { id: "2", name: "Capa Silicone Premium", price: 49.9, category: "Acessórios", status: "Ativo" },
  { id: "3", name: "Carregador Turbo 65W", price: 129.9, category: "Eletrônicos", status: "Ativo" },
];

export default function ProductsPage() {
  return (
    <div>
      <PageHeader
        title="Produtos"
        action={
          <Button>
            <Plus className="size-4" />
            Novo Produto
          </Button>
        }
      />

      <Card noPadding>
        <div className="border-b border-[var(--brand-border)] p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar produtos..."
              className="h-10 w-full rounded-lg border border-[var(--brand-border)] bg-[var(--brand-tertiary)] pl-10 pr-4 text-sm outline-none transition-colors focus:border-[var(--brand-black)] focus:bg-white"
            />
          </div>
        </div>

        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--brand-border)]">
              <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Nome
              </th>
              <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Categoria
              </th>
              <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Preço
              </th>
              <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {mockProducts.map((product) => (
              <tr
                key={product.id}
                className="border-b border-[var(--brand-border)] last:border-0 transition-colors hover:bg-[var(--brand-tertiary)]"
              >
                <td className="px-5 py-3.5 text-sm font-medium text-[var(--brand-black)]">
                  {product.name}
                </td>
                <td className="px-5 py-3.5 text-sm text-muted-foreground">
                  {product.category}
                </td>
                <td className="px-5 py-3.5 text-sm text-[var(--brand-black)]">
                  {product.price.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </td>
                <td className="px-5 py-3.5">
                  <Badge variant="success">{product.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
