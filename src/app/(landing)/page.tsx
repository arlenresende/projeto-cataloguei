import Link from "next/link";
import {
  Store,
  Palette,
  Smartphone,
  ArrowRight,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { THEME_CONFIGS, THEME_SEGMENTS } from "@/lib/themes";

const features = [
  {
    icon: Store,
    title: "Catálogo Online",
    description: "Crie seu catálogo de produtos profissional em minutos.",
  },
  {
    icon: Palette,
    title: "Temas Personalizáveis",
    description: "Escolha entre diversos temas para sua loja.",
  },
  {
    icon: Smartphone,
    title: "100% Responsivo",
    description: "Seu catálogo funciona perfeitamente em qualquer dispositivo.",
  },
];

const plans = [
  {
    name: "Básico",
    price: "Grátis",
    features: ["Até 10 produtos", "1 tema", "Link personalizado"],
  },
  {
    name: "Pro",
    price: "R$ 49/mês",
    features: [
      "Produtos ilimitados",
      "Todos os temas",
      "Domínio próprio",
      "Suporte prioritário",
    ],
    highlighted: true,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Store className="size-8 text-indigo-600" />
            <span className="text-xl font-bold text-gray-900">Cataloguei</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm">
              <Link href="/admin/dashboard">Entrar</Link>
            </Button>
            <Button size="sm">
              <Link href="/admin/dashboard">Criar Catálogo</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Seu catálogo online
          <br />
          <span className="text-indigo-600">em minutos</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Crie um catálogo profissional para sua empresa pequena. Compartilhe
          seu link e receba pedidos pelo WhatsApp.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg">
            <Link href="/admin/dashboard" className="flex items-center">
              Começar Agora
              <ArrowRight className="size-4 ml-2" />
            </Link>
          </Button>
          <Button variant="outline" size="lg">
            <Link href="/techstore">Ver Demonstração</Link>
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Tudo que você precisa
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-white p-6 rounded-xl border border-gray-200"
              >
                <feature.icon className="size-10 text-indigo-600 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Themes Preview */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            Temas para cada segmento
          </h2>
          <p className="text-center text-gray-600 mb-12">
            Escolha o tema que melhor representa sua empresa
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {THEME_SEGMENTS.map((segment) => {
              const theme = THEME_CONFIGS[segment];
              return (
                <div
                  key={segment}
                  className="p-4 rounded-xl border border-gray-200 text-center hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div
                    className="size-12 rounded-full mx-auto mb-3 flex items-center justify-center"
                    style={{ backgroundColor: theme.colors.primary }}
                  >
                    <span className="text-white text-xs font-bold">
                      {theme.name.charAt(0)}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {theme.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Planos simples
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`p-8 rounded-xl border ${
                  plan.highlighted
                    ? "border-indigo-600 shadow-lg ring-1 ring-indigo-600"
                    : "border-gray-200 bg-white"
                }`}
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <p className="text-3xl font-bold text-gray-900 mb-6">
                  {plan.price}
                </p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-2 text-gray-600"
                    >
                      <Check className="size-4 text-indigo-600" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full"
                  variant={plan.highlighted ? "default" : "outline"}
                >
                  <Link href="/admin/dashboard">Começar</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-gray-500 text-sm">
          <p>&copy; 2026 Cataloguei. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
