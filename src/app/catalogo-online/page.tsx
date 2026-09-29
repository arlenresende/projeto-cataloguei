import type { Metadata } from "next";
import Link from "next/link";
import {
  BarChart3,
  CheckCircle2,
  MessageCircle,
  Package,
  Search,
  Share2,
} from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { Button } from "@/components/ui/button";
import { buildPageMetadata } from "@/lib/seo";
import { LeadForm } from "./lead-form";

export const metadata: Metadata = buildPageMetadata({
  title: "Catálogo online para vender mais pelo WhatsApp",
  description:
    "Organize produtos em um catálogo online, compartilhe com clientes e receba pedidos pelo WhatsApp com o Cataloguei.",
  path: "/catalogo-online",
  keywords: [
    "catalogo online",
    "catalogo para whatsapp",
    "catalogo digital",
    "vender pelo whatsapp",
    "loja online simples",
  ],
});

type CatalogoOnlinePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const BENEFITS = [
  {
    icon: Package,
    title: "Produtos organizados",
    text: "Fotos, preços, categorias e detalhes em um link fácil de enviar.",
  },
  {
    icon: MessageCircle,
    title: "Pedido pelo WhatsApp",
    text: "O cliente escolhe, monta o pedido e chama sua loja sem fricção.",
  },
  {
    icon: BarChart3,
    title: "Métricas do catálogo",
    text: "Veja visualizações, cliques e produtos que mais chamam atenção.",
  },
  {
    icon: Share2,
    title: "Link pronto para divulgar",
    text: "Use no Instagram, bio, grupos, anúncios e atendimento diário.",
  },
];

const SEGMENTS = [
  "Moda e acessórios",
  "Comida e delivery",
  "Beleza e estética",
  "Artesanato",
  "Eletrônicos",
  "Serviços locais",
];

export default async function CatalogoOnlinePage({
  searchParams,
}: CatalogoOnlinePageProps) {
  const resolvedSearchParams = await searchParams;

  return (
    <main className="min-h-screen bg-white text-[var(--brand-black)]">
      <header className="border-b border-[var(--brand-border)] bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
          <BrandLogo variant="header" />
          <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
            <a href="#beneficios" className="hover:text-[var(--brand-black)]">
              Benefícios
            </a>
            <a href="#exemplo" className="hover:text-[var(--brand-black)]">
              Exemplo
            </a>
            <a href="#contato" className="hover:text-[var(--brand-black)]">
              Contato
            </a>
          </nav>
          <Button variant="outline" size="sm" render={<Link href="/login" />}>
            Entrar
          </Button>
        </div>
      </header>

      <section className="border-b border-[var(--brand-border)]">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 md:grid-cols-[1.02fr_0.98fr] md:px-6 md:py-14 lg:gap-14">
          <div className="flex flex-col justify-center">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[var(--brand-border)] px-3 py-1 text-xs font-bold uppercase text-muted-foreground">
              <span className="size-2 rounded-full bg-[var(--brand-yellow)]" />
              Vitrine online para WhatsApp
            </div>
            <h1 className="mt-5 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">
              Transforme seus produtos em um catálogo pronto para vender
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
              Compartilhe um link profissional, deixe o cliente escolher os
              itens e receba o pedido organizado no WhatsApp. Ideal para quem
              vende por conversa e quer menos retrabalho no atendimento.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" render={<a href="#contato" />}>
                Quero organizar minhas vendas
              </Button>
              <Button variant="outline" size="lg" render={<Link href="/register" />}>
                Criar conta grátis
              </Button>
            </div>
            <div className="mt-7 grid gap-3 text-sm text-muted-foreground sm:grid-cols-3">
              {["Sem cartão", "Link para bio", "Pedido mais claro"].map(
                (item) => (
                  <span key={item} className="inline-flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-emerald-600" />
                    {item}
                  </span>
                )
              )}
            </div>
          </div>

          <div id="exemplo" className="relative">
            <div className="overflow-hidden rounded-lg border border-[var(--brand-border)] bg-[var(--brand-tertiary)] shadow-sm">
              <div className="flex items-center justify-between border-b border-[var(--brand-border)] bg-white px-4 py-3">
                <div>
                  <p className="text-xs font-semibold uppercase text-muted-foreground">
                    catálogo
                  </p>
                  <p className="font-bold">Bella Store</p>
                </div>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                  online
                </span>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    ["Bolsa couro", "R$ 189", "bg-rose-100"],
                    ["Sandália leve", "R$ 129", "bg-amber-100"],
                    ["Blazer alfaiataria", "R$ 249", "bg-sky-100"],
                    ["Brinco dourado", "R$ 59", "bg-emerald-100"],
                  ].map(([name, price, color]) => (
                    <div key={name} className="rounded-lg bg-white p-3 shadow-sm">
                      <div className={`aspect-[4/3] rounded-md ${color}`} />
                      <p className="mt-3 text-sm font-bold">{name}</p>
                      <p className="text-sm text-muted-foreground">{price}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 rounded-lg bg-[var(--brand-black)] p-4 text-white">
                  <p className="text-sm font-bold">Pedido pronto no WhatsApp</p>
                  <p className="mt-1 text-xs text-white/70">
                    3 itens selecionados · mensagem automática para a loja
                  </p>
                  <div className="mt-3 rounded-md bg-white/10 p-3 text-xs leading-5 text-white/85">
                    Olá! Quero pedir:
                    <br />
                    1x Bolsa couro · R$ 189
                    <br />
                    2x Brinco dourado · R$ 59
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="beneficios" className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <div className="grid gap-4 md:grid-cols-4">
          {BENEFITS.map((benefit) => (
            <div
              key={benefit.title}
              className="rounded-lg border border-[var(--brand-border)] bg-white p-5"
            >
              <benefit.icon className="size-5 text-[var(--brand-black)]" />
              <h2 className="mt-4 text-base font-bold">{benefit.title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {benefit.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-[var(--brand-border)] bg-[var(--brand-tertiary)]">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-[0.8fr_1.2fr] md:px-6">
          <div>
            <p className="text-sm font-bold uppercase text-muted-foreground">
              Para quem vende todos os dias
            </p>
            <h2 className="mt-3 text-2xl font-extrabold tracking-tight md:text-3xl">
              Um catálogo simples para quem vende todos os dias pelo celular
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {SEGMENTS.map((segment) => (
              <div
                key={segment}
                className="flex items-center gap-3 rounded-lg bg-white px-4 py-3 text-sm font-semibold"
              >
                <Search className="size-4 text-muted-foreground" />
                {segment}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contato" className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-[0.95fr_1.05fr] md:px-6">
        <div className="flex flex-col justify-center">
          <p className="text-sm font-bold uppercase text-muted-foreground">
            Receba uma orientação rápida
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight">
            Conte como você vende hoje
          </h2>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            Use o formulário para entrar na lista de interessados. Vamos entender
            seu tipo de negócio e te chamar com um caminho simples para colocar
            seu catálogo no ar.
          </p>
        </div>
        <div className="rounded-lg border border-[var(--brand-border)] bg-white p-5 shadow-sm md:p-6">
          <LeadForm searchParams={resolvedSearchParams} />
        </div>
      </section>
    </main>
  );
}
