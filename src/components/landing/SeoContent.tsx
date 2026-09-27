import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export const HOME_FAQS = [
  {
    question: "O que é o Cataloguei?",
    answer:
      "O Cataloguei é uma plataforma brasileira para criar catálogo digital, organizar produtos e receber pedidos diretamente pelo WhatsApp.",
  },
  {
    question: "Como criar um catálogo online?",
    answer:
      "Você cria uma conta, cadastra os dados da loja, adiciona produtos e categorias, personaliza a vitrine e compartilha o link com seus clientes.",
  },
  {
    question: "O Cataloguei tem plano grátis?",
    answer:
      "Sim. O plano grátis permite começar com até 5 produtos e compartilhar o catálogo online da sua loja.",
  },
  {
    question: "O pedido é finalizado dentro do Cataloguei?",
    answer:
      "O cliente seleciona os produtos no catálogo e continua o atendimento pelo WhatsApp da loja com a mensagem do pedido organizada.",
  },
];

const CONTENT_BLOCKS = [
  {
    title: "O que é",
    text: "Um catálogo digital para pequenos negócios que precisam divulgar produtos com clareza, sem depender de PDFs, artes improvisadas ou mensagens repetidas.",
  },
  {
    title: "Para quem é",
    text: "Lojas de moda, acessórios, beleza, comida, artesanato, eletrônicos e serviços locais que vendem por conversa e querem um link profissional.",
  },
  {
    title: "Como funciona",
    text: "A loja cadastra produtos e categorias, personaliza a vitrine e envia o link. O cliente escolhe os itens e chama no WhatsApp com o pedido pronto.",
  },
];

const INTERNAL_LINKS = [
  { href: "/catalogo-digital", label: "Catálogo digital" },
  { href: "/catalogo-para-whatsapp", label: "Catálogo para WhatsApp" },
  { href: "/catalogo-digital-gratis", label: "Catálogo grátis" },
  { href: "/como-criar-catalogo-online", label: "Como criar catálogo online" },
  { href: "/catalogo-para-loja-de-roupas", label: "Catálogo para loja de roupas" },
];

export function SeoContent() {
  return (
    <section className="border-y border-[var(--brand-border)] bg-white">
      <div className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-18">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-sm font-bold uppercase text-muted-foreground">
              Cataloguei no detalhe
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight md:text-4xl">
              Catálogo digital para vender pelo WhatsApp com mais organização
            </h2>
            <p className="mt-4 text-base leading-7 text-muted-foreground">
              O Cataloguei foi pensado para negócios brasileiros que querem uma
              loja online simples, rápida de divulgar e conectada ao atendimento
              que já acontece no WhatsApp.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {INTERNAL_LINKS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--brand-border)] px-4 py-2 text-sm font-semibold hover:border-[var(--brand-black)]"
                >
                  {item.label}
                  <ArrowRight className="size-4" />
                </Link>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {CONTENT_BLOCKS.map((block) => (
              <article
                key={block.title}
                className="rounded-lg border border-[var(--brand-border)] bg-[var(--brand-tertiary)] p-5"
              >
                <CheckCircle2 className="size-5 text-emerald-600" />
                <h3 className="mt-4 text-lg font-extrabold tracking-tight">
                  {block.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {block.text}
                </p>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-12">
          <p className="text-sm font-bold uppercase text-muted-foreground">
            Perguntas frequentes
          </p>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {HOME_FAQS.map((faq) => (
              <article
                key={faq.question}
                className="rounded-lg border border-[var(--brand-border)] p-5"
              >
                <h3 className="text-base font-extrabold tracking-tight">
                  {faq.question}
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {faq.answer}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
