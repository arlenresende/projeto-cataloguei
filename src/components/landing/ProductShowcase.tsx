import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeader } from "./SectionHeader";

export function ProductShowcase() {
  return (
    <section
      className="bg-zinc-50 py-20 md:py-28"
      aria-labelledby="showcase-title"
    >
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeader
          title="Um painel completo para você e uma vitrine linda para seus clientes"
          description="Gerencie produtos pelo painel administrativo e compartilhe o link da sua loja. Simples assim."
        />

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Painel admin */}
          <article className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
            <div className="border-b border-zinc-200 bg-zinc-50 px-5 py-3">
              <div className="flex items-center gap-2">
                <span className="size-2.5 rounded-full bg-red-400" />
                <span className="size-2.5 rounded-full bg-yellow-400" />
                <span className="size-2.5 rounded-full bg-green-400" />
              </div>
            </div>
            <div className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-semibold text-zinc-900">
                  Painel administrativo
                </p>
                <span className="rounded-full bg-violet-50 px-2 py-0.5 text-[10px] font-medium text-violet-700">
                  Online
                </span>
              </div>

              <div className="space-y-3">
                {[
                  { name: "Fone Bluetooth Pro", price: "R$ 299,90", stock: "12 un" },
                  { name: "Capa Silicone", price: "R$ 49,90", stock: "34 un" },
                  { name: "Carregador 65W", price: "R$ 129,90", stock: "8 un" },
                ].map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between rounded-lg border border-zinc-200 bg-zinc-50/50 px-3 py-2.5"
                  >
                    <div className="flex items-center gap-3">
                      <div className="size-9 rounded-md bg-violet-100" />
                      <div>
                        <p className="text-xs font-medium text-zinc-900">
                          {item.name}
                        </p>
                        <p className="text-[10px] text-zinc-500">
                          Estoque: {item.stock}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-violet-600">
                      {item.price}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-zinc-200 pt-4">
                <span className="text-[11px] text-zinc-500">
                  3 de 24 produtos
                </span>
                <Link
                  href="#"
                  className="inline-flex items-center text-xs font-medium text-violet-600 hover:text-violet-700 hover:underline"
                >
                  Ver todos
                  <ArrowRight className="ml-1 size-3" />
                </Link>
              </div>
            </div>
          </article>

          {/* Loja pública */}
          <article className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
            <div className="border-b border-zinc-200 bg-zinc-50 px-5 py-3">
              <div className="flex items-center gap-2">
                <span className="size-2.5 rounded-full bg-red-400" />
                <span className="size-2.5 rounded-full bg-yellow-400" />
                <span className="size-2.5 rounded-full bg-green-400" />
              </div>
            </div>
            <div className="bg-gradient-to-b from-violet-50/40 to-white p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="size-10 rounded-lg bg-violet-600" />
                <div>
                  <p className="text-sm font-semibold text-zinc-900">
                    TechStore
                  </p>
                  <p className="text-[10px] text-zinc-500">
                    Tecnologia com os melhores preços
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { name: "Fone Pro", price: "R$ 299", tone: "from-violet-100 to-violet-50" },
                  { name: "Mouse Gamer", price: "R$ 159", tone: "from-zinc-200 to-zinc-100" },
                ].map((item) => (
                  <div
                    key={item.name}
                    className="overflow-hidden rounded-lg border border-zinc-200 bg-white"
                  >
                    <div
                      className={`aspect-square bg-gradient-to-br ${item.tone}`}
                    />
                    <div className="p-2.5">
                      <p className="text-[11px] font-medium text-zinc-900">
                        {item.name}
                      </p>
                      <p className="text-[11px] font-semibold text-violet-600">
                        {item.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 rounded-lg bg-violet-600 px-3 py-2 text-center text-xs font-semibold text-white">
                Comprar pelo WhatsApp
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
