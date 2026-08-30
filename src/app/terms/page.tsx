import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Termos de Uso",
  description:
    "Termos de Uso do Cataloguei para criação e gestão de catálogos online.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="mx-auto max-w-3xl px-4 py-16 md:py-20">
        <Link
          href="/"
          className="text-sm font-semibold text-muted-foreground transition-colors hover:text-[var(--brand-black)]"
        >
          Voltar para o início
        </Link>
        <h1 className="mt-8 text-3xl font-extrabold tracking-tight text-[var(--brand-black)] md:text-4xl">
          Termos de Uso
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Última atualização: 30 de agosto de 2026
        </p>

        <div className="mt-10 space-y-8 text-sm leading-7 text-muted-foreground">
          <section>
            <h2 className="text-lg font-bold text-[var(--brand-black)]">
              Uso do serviço
            </h2>
            <p className="mt-2">
              O Cataloguei permite criar e gerenciar catálogos online, páginas
              públicas de produtos, links, banners e canais de contato. Você é
              responsável pelas informações publicadas na sua loja.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[var(--brand-black)]">
              Conta e segurança
            </h2>
            <p className="mt-2">
              Você deve manter seus dados de acesso seguros e usar informações
              corretas no cadastro. Atividades suspeitas, abusivas ou ilegais
              podem resultar em bloqueio ou encerramento da conta.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[var(--brand-black)]">
              Planos e pagamentos
            </h2>
            <p className="mt-2">
              O plano Free pode ser usado sem cobrança. O plano Premium possui
              cobrança mensal recorrente, processada pelo Stripe, e permanece
              ativo enquanto a assinatura estiver regular.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[var(--brand-black)]">
              Conteúdo da loja
            </h2>
            <p className="mt-2">
              Não é permitido publicar conteúdo fraudulento, ofensivo, ilegal,
              que viole direitos de terceiros ou que prejudique a segurança e a
              experiência de outros usuários.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[var(--brand-black)]">
              Pedidos Premium
            </h2>
            <p className="mt-2">
              Clientes Premium podem enviar sugestões e necessidades pelo painel.
              O envio não garante implementação automática; cada pedido será
              avaliado conforme viabilidade técnica e estratégia do produto.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[var(--brand-black)]">
              Alterações
            </h2>
            <p className="mt-2">
              Podemos atualizar estes termos para refletir mudanças no produto,
              integrações, requisitos legais ou melhorias operacionais. O uso
              contínuo do serviço após alterações indica concordância com os
              termos atualizados.
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}
