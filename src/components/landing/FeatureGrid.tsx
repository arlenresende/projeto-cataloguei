import {
  ArrowUpRight,
  MessageCircle,
  Smartphone,
  Link2,
  LayoutGrid,
  Monitor,
  Palette,
} from "lucide-react";

const FEATURES = [
  {
    icon: LayoutGrid,
    title: "Catálogo profissional",
    description:
      "Produtos e serviços organizados em uma página bonita e fácil de consultar.",
    category: "Catálogo",
  },
  {
    icon: Monitor,
    title: "Página pronta para divulgar",
    description:
      "Apresente seu negócio de forma profissional sem precisar criar um site.",
    category: "Página online",
  },
  {
    icon: MessageCircle,
    title: "Pedidos pelo WhatsApp",
    description:
      "Seus clientes entram em contato e fazem pedidos direto pelo WhatsApp.",
    category: "WhatsApp",
  },
  {
    icon: Link2,
    title: "Link personalizado",
    description:
      "Tenha um link próprio para colocar na bio, divulgar e compartilhar.",
    category: "Divulgação",
  },
  {
    icon: Smartphone,
    title: "Funciona em qualquer celular",
    description:
      "Sua página se adapta automaticamente a celulares, tablets e computadores.",
    category: "Responsivo",
  },
  {
    icon: Palette,
    title: "Personalize seu negócio",
    description:
      "Use suas informações, imagens e identidade para deixar a página com a cara da sua empresa.",
    category: "Personalização",
  },
];

export function FeatureGrid() {
  return (
    <section
      id="features"
      className="bg-white py-20 md:py-28"
      aria-labelledby="features-title"
    >
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-8">
          {/* Heading column */}
          <div className="md:col-span-5 md:pt-2">
            <p className="text-sm font-medium uppercase tracking-wider text-[var(--brand-black)]">
              RECURSOS
            </p>
            <h2
              id="features-title"
              className="mt-3 text-3xl font-bold leading-tight tracking-tight text-[var(--brand-black)] md:text-4xl lg:text-5xl"
            >
              Tudo que você precisa para{" "}
              <span className="relative inline-block">
                <span className="relative z-10">vender seu negócio online</span>
                <span
                  className="absolute inset-x-0 bottom-1 -z-0 h-3 rounded bg-[var(--brand-yellow)]/40 md:bottom-2 md:h-4"
                  aria-hidden="true"
                />
              </span>
            </h2>
            <p className="mt-4 max-w-md text-base text-muted-foreground md:text-lg">
              Crie uma página profissional para apresentar seus produtos ou
              serviços e receba pedidos e orçamentos direto pelo WhatsApp.
            </p>
          </div>

          {/* Cards column */}
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:col-span-7">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <li
                  key={feature.title}
                  className="group flex h-full flex-col justify-between rounded-2xl border border-[var(--brand-border)] bg-white p-5 transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div>
                    <span
                      className="inline-flex size-10 items-center justify-center rounded-lg bg-[var(--brand-yellow-light)] text-[var(--brand-black)] transition-colors group-hover:bg-[var(--brand-yellow)]"
                      aria-hidden="true"
                    >
                      <Icon className="size-5" />
                    </span>
                    <h3 className="mt-4 text-base font-semibold leading-snug text-[var(--brand-black)]">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                  <div className="mt-5 flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {feature.category}
                    </span>
                    <span
                      className="inline-flex size-8 items-center justify-center rounded-full border border-[var(--brand-border)] text-muted-foreground transition-all group-hover:border-[var(--brand-black)] group-hover:bg-[var(--brand-black)] group-hover:text-white"
                      aria-hidden="true"
                    >
                      <ArrowUpRight className="size-4" />
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
