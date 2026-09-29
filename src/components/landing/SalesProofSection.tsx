import Link from "next/link";
import { ArrowRight, CheckCircle2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const segments = [
  {
    name: "Moda e acessórios",
    products: ["Vestido midi", "Bolsa tiracolo", "Brinco dourado"],
    color: "bg-rose-100",
  },
  {
    name: "Doces e encomendas",
    products: ["Bolo vulcão", "Caixa de brigadeiros", "Kit festa"],
    color: "bg-amber-100",
  },
  {
    name: "Beleza e estética",
    products: ["Kit skincare", "Óleo capilar", "Escova modeladora"],
    color: "bg-emerald-100",
  },
];

const gains = [
  "Link único para bio, stories, grupos e atendimento",
  "Produtos com foto, preço, descrição e categoria",
  "Pedido chega com itens e quantidades para continuar no WhatsApp",
  "Painel simples para alterar produtos sem refazer material",
];

export function SalesProofSection() {
  return (
    <section className="bg-white py-20 md:py-28" aria-labelledby="sales-proof-title">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-sm font-medium uppercase tracking-wider text-[var(--brand-black)]">
              Venda com menos retrabalho
            </p>
            <h2
              id="sales-proof-title"
              className="mt-3 text-3xl font-bold tracking-tight text-[var(--brand-black)] md:text-4xl"
            >
              Seu cliente escolhe no catálogo. Você recebe a conversa mais pronta.
            </h2>
            <p className="mt-4 text-base leading-7 text-muted-foreground">
              O Cataloguei transforma o atendimento repetitivo em um fluxo mais
              claro: o cliente navega, seleciona produtos e chama sua loja com o
              pedido organizado para você finalizar a venda.
            </p>

            <div className="mt-7 grid gap-3">
              {gains.map((gain) => (
                <div key={gain} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-600" />
                  <span className="text-sm font-medium leading-6 text-[var(--brand-black)]">
                    {gain}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" render={<Link href="/register" />}>
                Montar minha vitrine
                <ArrowRight className="ml-2 size-4" />
              </Button>
              <Button variant="outline" size="lg" render={<Link href="/demo" />}>
                Ver catálogo exemplo
              </Button>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-2xl border border-[var(--brand-border)] bg-[var(--brand-tertiary)] p-4">
              <div className="grid gap-3 sm:grid-cols-3">
                {segments.map((segment) => (
                  <article
                    key={segment.name}
                    className="rounded-xl border border-[var(--brand-border)] bg-white p-4"
                  >
                    <div className={`h-24 rounded-lg ${segment.color}`} />
                    <h3 className="mt-3 text-sm font-bold text-[var(--brand-black)]">
                      {segment.name}
                    </h3>
                    <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                      {segment.products.map((product) => (
                        <li key={product}>{product}</li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-[var(--brand-border)] bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-full bg-[#25D366] text-white">
                  <MessageCircle className="size-5" />
                </span>
                <div>
                  <p className="text-sm font-bold text-[var(--brand-black)]">
                    Mensagem enviada para a loja
                  </p>
                  <p className="text-xs text-muted-foreground">
                    O cliente chega com contexto para fechar o pedido
                  </p>
                </div>
              </div>
              <div className="mt-4 rounded-xl bg-[var(--brand-tertiary)] p-4 text-sm leading-6 text-[var(--brand-black)]">
                Olá! Quero fazer um pedido:
                <br />
                2x Vestido midi - R$ 129,90
                <br />
                1x Brinco dourado - R$ 59,90
                <br />
                Total aproximado: R$ 319,70
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
