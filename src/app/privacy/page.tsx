import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description:
    "Política de Privacidade do Cataloguei sobre dados de conta, loja, pagamentos e analytics.",
};

export default function PrivacyPage() {
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
          Política de Privacidade
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Última atualização: 30 de agosto de 2026
        </p>

        <div className="mt-10 space-y-8 text-sm leading-7 text-muted-foreground">
          <section>
            <h2 className="text-lg font-bold text-[var(--brand-black)]">
              Dados que coletamos
            </h2>
            <p className="mt-2">
              Coletamos dados informados no cadastro, como nome, e-mail e senha,
              além das informações necessárias para criação e gestão da sua loja,
              produtos, categorias, banners, links e preferências de assinatura.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[var(--brand-black)]">
              Pagamentos e assinaturas
            </h2>
            <p className="mt-2">
              Pagamentos são processados pelo Stripe. Não armazenamos dados
              completos de cartão. Guardamos apenas identificadores necessários
              para associar sua conta ao cliente e à assinatura no Stripe.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[var(--brand-black)]">
              Analytics da loja
            </h2>
            <p className="mt-2">
              Registramos eventos de uso da vitrine, como visualizações de loja,
              produto, categoria, Linktree, cliques no WhatsApp e compartilhamentos.
              Esses dados ajudam você a entender o desempenho do catálogo.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[var(--brand-black)]">
              Uso das informações
            </h2>
            <p className="mt-2">
              Usamos os dados para autenticação, operação da loja, suporte,
              envio de e-mails transacionais, gestão de planos, segurança,
              melhoria do produto e cumprimento de obrigações legais.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[var(--brand-black)]">
              Compartilhamento
            </h2>
            <p className="mt-2">
              Podemos compartilhar dados com provedores necessários para o
              funcionamento do serviço, como Supabase, Resend e Stripe. Não
              vendemos seus dados pessoais.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[var(--brand-black)]">
              Seus direitos
            </h2>
            <p className="mt-2">
              Você pode solicitar acesso, correção ou exclusão dos seus dados,
              respeitadas obrigações legais e operacionais. Para isso, entre em
              contato pelos canais oficiais do Cataloguei.
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}
