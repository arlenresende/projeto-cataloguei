import { Palette, Smartphone, Store, MessageCircle } from "lucide-react";
import { SectionHeader } from "./SectionHeader";

const FEATURES = [
  {
    icon: Store,
    title: "Catálogo online completo",
    description:
      "Cadastre seus produtos com fotos, preços e descrições em poucos cliques. Organize por categorias e tenha tudo organizado.",
    iconColor: "bg-indigo-100 text-indigo-600",
  },
  {
    icon: Palette,
    title: "Temas para cada segmento",
    description:
      "Escolha entre 15+ temas visuais pensados para moda, alimentação, tecnologia, beleza, pets e muito mais.",
    iconColor: "bg-pink-100 text-pink-600",
  },
  {
    icon: Smartphone,
    title: "100% responsivo",
    description:
      "Seu catálogo funciona perfeitamente em celular, tablet e desktop. Seus clientes compram de qualquer lugar.",
    iconColor: "bg-emerald-100 text-emerald-600",
  },
  {
    icon: MessageCircle,
    title: "Pedidos via WhatsApp",
    description:
      "Cada produto tem um botão direto para o seu WhatsApp. Receba pedidos com nome, produto e quantidade.",
    iconColor: "bg-orange-100 text-orange-600",
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
        <SectionHeader
          eyebrow="Recursos"
          title="Tudo que você precisa para vender online"
          description="Ferramentas pensadas para quem quer começar a vender pela internet sem complicação."
        />

        <ul className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-gray-200 bg-gray-200 sm:grid-cols-2">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <li
                key={feature.title}
                className="flex flex-col gap-4 bg-white p-8 md:p-10"
              >
                <span
                  className={`flex size-12 items-center justify-center rounded-full ${feature.iconColor}`}
                  aria-hidden="true"
                >
                  <Icon className="size-5" />
                </span>
                <h3 className="text-lg font-semibold text-gray-900 md:text-xl">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-gray-600 md:text-base">
                  {feature.description}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
