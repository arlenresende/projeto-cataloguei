import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const mockProducts = [
  { id: "1", name: "Fone Bluetooth Pro", price: 299.9, category: "Eletrônicos", status: "Ativo" },
  { id: "2", name: "Capa Silicone Premium", price: 49.9, category: "Acessórios", status: "Ativo" },
  { id: "3", name: "Carregador Turbo 65W", price: 129.9, category: "Eletrônicos", status: "Ativo" },
];

export default function ProductsPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Produtos</h1>
        <Button>
          <Plus className="size-4 mr-2" />
          Novo Produto
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar produtos..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>

        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left text-sm font-medium text-gray-500 px-6 py-3">
                Nome
              </th>
              <th className="text-left text-sm font-medium text-gray-500 px-6 py-3">
                Categoria
              </th>
              <th className="text-left text-sm font-medium text-gray-500 px-6 py-3">
                Preço
              </th>
              <th className="text-left text-sm font-medium text-gray-500 px-6 py-3">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {mockProducts.map((product) => (
              <tr
                key={product.id}
                className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {product.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {product.category}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {product.price.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {product.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
