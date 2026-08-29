"use client";

import { useState } from "react";
import { Layers, Palette, Share2 } from "lucide-react";
import { getSiteHost } from "@/lib/site-config";
import { cn } from "@/lib/utils";

const TABS = [
  {
    id: "catalog",
    label: "Catálogo",
    icon: Layers,
    title: "Tudo organizado em um só lugar",
    description:
      "Cadastre seus produtos uma vez e eles ficam disponíveis em todos os canais. Categorias, busca, variações e fotos em alta resolução.",
    bullets: [
      "Produtos ilimitados no plano Pro",
      "Organização por categorias",
      "Variações de tamanho e cor",
    ],
  },
  {
    id: "themes",
    label: "Personalização",
    icon: Palette,
    title: "Temas prontos para cada segmento",
    description:
      "Moda, alimentação, tecnologia, beleza e mais. Cada tema foi pensado para destacar seus produtos da melhor forma possível.",
    bullets: [
      "15+ temas profissionais",
      "Cores e fontes personalizáveis",
      "Sua marca em destaque",
    ],
  },
  {
    id: "share",
    label: "Compartilhamento",
    icon: Share2,
    title: "Compartilhe com um único link",
    description:
      "Seu catálogo tem um link próprio, tipo seucatalogo.com.br. Compartilhe nas redes sociais, no Instagram ou direto com clientes.",
    bullets: [
      "Link personalizado da sua marca",
      "Botão direto para o WhatsApp",
      "Compatível com Instagram e TikTok",
    ],
  },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function FeatureTabs() {
  const [active, setActive] = useState<TabId>("catalog");
  const current = TABS.find((t) => t.id === active) ?? TABS[0];
  const Icon = current.icon;

  return (
    <section
      id="how-it-works"
      className="bg-white py-20 md:py-28"
      aria-labelledby="tabs-title"
    >
      <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h2
            id="tabs-title"
            className="text-3xl font-bold tracking-tight text-[var(--brand-black)] md:text-4xl lg:text-5xl"
          >
            Gerencie seu catálogo de forma simples
          </h2>
          <p className="mt-4 text-base text-muted-foreground md:text-lg">
            Em poucos passos você coloca sua loja no ar e começa a vender.
          </p>
        </div>

        <div
          role="tablist"
          aria-label="Recursos do Cataloguei"
          className="mt-12 flex flex-wrap items-center justify-center gap-2"
        >
          {TABS.map((tab) => {
            const TabIcon = tab.icon;
            const isActive = active === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={`panel-${tab.id}`}
                id={`tab-${tab.id}`}
                onClick={() => setActive(tab.id)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "border-[var(--brand-black)] bg-[var(--brand-black)] text-white"
                    : "border-[var(--brand-border)] bg-white text-muted-foreground hover:border-[var(--brand-black)]/30 hover:text-[var(--brand-black)]"
                )}
              >
                <TabIcon className="size-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div
          role="tabpanel"
          id={`panel-${current.id}`}
          aria-labelledby={`tab-${current.id}`}
          className="mt-10 grid grid-cols-1 items-center gap-10 rounded-2xl border border-[var(--brand-border)] bg-[var(--brand-tertiary)] p-8 md:grid-cols-2 md:p-12"
        >
          <div>
            <span
              className="flex size-12 items-center justify-center rounded-full bg-[var(--brand-yellow)] text-[var(--brand-black)]"
              aria-hidden="true"
            >
              <Icon className="size-5" />
            </span>
            <h3 className="mt-5 text-2xl font-bold tracking-tight text-[var(--brand-black)] md:text-3xl">
              {current.title}
            </h3>
            <p className="mt-3 text-base text-muted-foreground">{current.description}</p>
            <ul className="mt-6 space-y-3">
              {current.bullets.map((bullet) => (
                <li
                  key={bullet}
                  className="flex items-start gap-3 text-sm text-[var(--brand-black)]"
                >
                  <span
                    className="mt-1 size-1.5 shrink-0 rounded-full bg-[var(--brand-yellow)]"
                    aria-hidden="true"
                  />
                  {bullet}
                </li>
              ))}
            </ul>
          </div>

          <FeaturePreview tab={current.id} />
        </div>
      </div>
    </section>
  );
}

function FeaturePreview({ tab }: { tab: TabId }) {
  const siteHost = getSiteHost();

  if (tab === "catalog") {
    return (
      <div className="rounded-xl border border-[var(--brand-border)] bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-semibold text-[var(--brand-black)]">Meus produtos</p>
          <span className="rounded-full bg-[var(--brand-yellow-light)] px-2 py-0.5 text-[10px] font-medium text-[var(--brand-black)]">
            24 itens
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {["Camiseta", "Tênis", "Bolsa", "Relógio"].map((item) => (
            <div
              key={item}
              className="overflow-hidden rounded-lg border border-[var(--brand-border)]"
            >
              <div className="aspect-square bg-gradient-to-br from-[var(--brand-yellow-light)] to-[var(--brand-tertiary)]" />
              <div className="p-2">
                <p className="text-[10px] font-medium text-[var(--brand-black)]">{item}</p>
                <p className="text-[10px] font-semibold text-[var(--brand-black)]">
                  R$ 99
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (tab === "themes") {
    const swatches = [
      { from: "from-[var(--brand-yellow)]", to: "to-amber-400", label: "Moda" },
      { from: "from-rose-500", to: "to-pink-500", label: "Beleza" },
      { from: "from-emerald-500", to: "to-teal-500", label: "Food" },
      { from: "from-[var(--brand-black)]", to: "to-zinc-700", label: "Tech" },
    ];
    return (
      <div className="grid grid-cols-2 gap-3">
        {swatches.map((s) => (
          <div
            key={s.label}
            className="overflow-hidden rounded-xl border border-[var(--brand-border)] bg-white shadow-sm"
          >
            <div
              className={`flex h-20 items-end bg-gradient-to-br ${s.from} ${s.to} p-3`}
            >
              <span className="rounded-md bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-[var(--brand-black)]">
                {s.label}
              </span>
            </div>
            <div className="p-3">
              <div className="h-1.5 w-3/4 rounded-full bg-[var(--brand-tertiary)]" />
              <div className="mt-2 h-1.5 w-1/2 rounded-full bg-[var(--brand-tertiary)]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[var(--brand-border)] bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2 rounded-lg bg-[var(--brand-tertiary)] px-3 py-2">
        <Share2 className="size-4 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">{siteHost}/</span>
        <span className="text-xs font-semibold text-[var(--brand-black)]">sualoja</span>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {["Instagram", "WhatsApp", "TikTok", "Facebook"].map((social) => (
          <span
            key={social}
            className="rounded-full border border-[var(--brand-border)] px-3 py-1 text-xs font-medium text-muted-foreground"
          >
            Compartilhar no {social}
          </span>
        ))}
      </div>
      <div className="mt-5 grid grid-cols-3 gap-2 text-center">
        {[
          { value: "2.4k", label: "Visualizações" },
          { value: "187", label: "Cliques" },
          { value: "32", label: "Pedidos" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg bg-[var(--brand-tertiary)] p-2"
          >
            <p className="text-base font-bold text-[var(--brand-black)]">{stat.value}</p>
            <p className="text-[10px] text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
