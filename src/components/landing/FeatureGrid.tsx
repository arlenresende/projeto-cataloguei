import {
  ArrowUpRight,
  MessageCircle,
  Palette,
  Smartphone,
  Store,
  BarChart3,
  Link2,
} from "lucide-react";

const FEATURES = [
  {
    icon: Store,
    title: "Catálogo online completo",
    category: "Catálogo",
  },
  {
    icon: Palette,
    title: "Temas para cada segmento",
    category: "Personalização",
  },
  {
    icon: Smartphone,
    title: "100% responsivo",
    category: "Mobile",
  },
  {
    icon: MessageCircle,
    title: "Pedidos via WhatsApp",
    category: "WhatsApp",
  },
  {
    icon: BarChart3,
    title: "Relatórios e métricas",
    category: "Relatórios",
  },
  {
    icon: Link2,
    title: "Link personalizado",
    category: "Link",
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
            <p className="text-sm font-medium uppercase tracking-wider text-indigo-600">
              Recursos
            </p>
            <h2
              id="features-title"
              className="mt-3 text-3xl font-bold leading-tight tracking-tight text-gray-900 md:text-4xl lg:text-5xl"
            >
              Tudo que você precisa para{" "}
              <span className="relative inline-block">
                <span className="relative z-10">vender online</span>
                <span
                  className="absolute inset-x-0 bottom-1 -z-0 h-3 rounded bg-indigo-100 md:bottom-2 md:h-4"
                  aria-hidden="true"
                />
              </span>
            </h2>
            <p className="mt-4 max-w-md text-base text-gray-600 md:text-lg">
              Ferramentas pensadas para pequenos negócios começarem a vender
              pela internet sem complicação.
            </p>
          </div>

          {/* Cards column */}
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:col-span-7">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <li
                  key={feature.title}
                  className="group flex h-full flex-col justify-between rounded-2xl border border-gray-200 bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md"
                >
                  <div>
                    <span
                      className="inline-flex size-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-indigo-100"
                      aria-hidden="true"
                    >
                      <Icon className="size-5" />
                    </span>
                    <h3 className="mt-5 text-base font-semibold leading-snug text-gray-900 md:text-lg">
                      {feature.title}
                    </h3>
                  </div>
                  <div className="mt-6 flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {feature.category}
                    </span>
                    <span
                      className="inline-flex size-8 items-center justify-center rounded-full border border-gray-200 text-gray-700 transition-all group-hover:border-gray-900 group-hover:bg-gray-900 group-hover:text-white"
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
