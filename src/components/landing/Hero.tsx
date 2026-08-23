import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroVisual } from "./HeroVisual";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-12 md:pt-20 lg:pt-24 pb-12 md:pb-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50/60 px-3 py-1 text-xs font-medium text-indigo-700">
            <Sparkles className="size-3.5" />
            Novo · Catálogos com IA e integração WhatsApp
          </span>

          <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
            Seu catálogo online
            <br className="hidden sm:block" />{" "}
            <span className="text-indigo-600">pronto em minutos</span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base text-gray-600 md:text-lg">
            Crie um catálogo profissional para sua pequena empresa, escolha um
            tema que combina com seu segmento e receba pedidos diretamente no
            WhatsApp. Sem complicação.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" render={<Link href="/admin/dashboard" />}>
              <span className="flex items-center">
                Criar catálogo grátis
                <ArrowRight className="ml-2 size-4" />
              </span>
            </Button>
            <Button
              variant="outline"
              size="lg"
              render={<Link href="/techstore" />}
            >
              Ver demonstração
            </Button>
          </div>

          <p className="mt-4 text-xs text-gray-500">
            Sem cartão de crédito · Setup em menos de 5 minutos
          </p>
        </div>

        <HeroVisual />
      </div>
    </section>
  );
}
