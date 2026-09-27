import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { StructuredData } from "@/components/seo/structured-data";
import { Button } from "@/components/ui/button";
import type { AcquisitionPageConfig } from "@/lib/acquisition-pages";
import {
  buildBreadcrumbJsonLd,
  buildCollectionPageJsonLd,
  buildFaqPageJsonLd,
  buildJsonLdGraph,
} from "@/lib/seo";
import { absoluteUrl, SITE_NAME } from "@/lib/site-config";

interface AcquisitionPageProps {
  page: AcquisitionPageConfig;
}

export function AcquisitionPage({ page }: AcquisitionPageProps) {
  const pagePath = `/${page.slug}`;

  return (
    <main className="min-h-screen bg-white text-[var(--brand-black)]">
      <StructuredData
        data={buildJsonLdGraph([
          buildCollectionPageJsonLd({
            name: page.title,
            description: page.description,
            url: absoluteUrl(pagePath),
          }),
          buildBreadcrumbJsonLd([
            { name: SITE_NAME, url: absoluteUrl("/") },
            { name: page.title, url: absoluteUrl(pagePath) },
          ]),
          buildFaqPageJsonLd(page.faqs),
        ])}
      />

      <header className="border-b border-[var(--brand-border)] bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
          <BrandLogo variant="header" />
          <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
            <a href="#como-funciona" className="hover:text-[var(--brand-black)]">
              Como funciona
            </a>
            <a href="#duvidas" className="hover:text-[var(--brand-black)]">
              Dúvidas
            </a>
            <Link href="/catalogo-online" className="hover:text-[var(--brand-black)]">
              Captação
            </Link>
          </nav>
          <Button variant="outline" size="sm" render={<Link href="/login" />}>
            Entrar
          </Button>
        </div>
      </header>

      <section className="border-b border-[var(--brand-border)] bg-[var(--brand-tertiary)]">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-[1.02fr_0.98fr] md:px-6 md:py-16">
          <div>
            <p className="text-sm font-bold uppercase text-muted-foreground">
              {page.eyebrow}
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">
              {page.h1}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
              {page.intro}
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" render={<Link href="/register" />}>
                {page.primaryCta}
              </Button>
              <Button variant="outline" size="lg" render={<Link href="/demo" />}>
                {page.secondaryCta}
              </Button>
            </div>
          </div>

          <div className="rounded-lg border border-[var(--brand-border)] bg-white p-5 shadow-sm">
            <p className="text-sm font-bold uppercase text-muted-foreground">
              O que o Cataloguei entrega
            </p>
            <div className="mt-5 grid gap-4">
              {page.highlights.map((highlight) => (
                <div key={highlight} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-600" />
                  <span className="text-sm font-semibold leading-6">{highlight}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
        <div className="grid gap-5 md:grid-cols-3">
          {page.sections.map((section) => (
            <article
              key={section.title}
              className="rounded-lg border border-[var(--brand-border)] bg-white p-6"
            >
              <h2 className="text-xl font-extrabold tracking-tight">{section.title}</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {section.body}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section
        id="como-funciona"
        className="border-y border-[var(--brand-border)] bg-[var(--brand-tertiary)]"
      >
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-[0.8fr_1.2fr] md:px-6">
          <div>
            <p className="text-sm font-bold uppercase text-muted-foreground">
              Passos simples
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight">
              Como colocar seu catálogo no ar
            </h2>
          </div>
          <ol className="grid gap-3 sm:grid-cols-2">
            {page.steps.map((step, index) => (
              <li
                key={step}
                className="rounded-lg border border-[var(--brand-border)] bg-white p-5"
              >
                <span className="text-sm font-extrabold text-muted-foreground">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="mt-2 text-sm font-semibold leading-6">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="duvidas" className="mx-auto max-w-5xl px-4 py-12 md:px-6 md:py-16">
        <p className="text-sm font-bold uppercase text-muted-foreground">
          Perguntas frequentes
        </p>
        <div className="mt-5 divide-y divide-[var(--brand-border)] rounded-lg border border-[var(--brand-border)] bg-white">
          {page.faqs.map((faq) => (
            <article key={faq.question} className="p-6">
              <h2 className="text-lg font-extrabold tracking-tight">{faq.question}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{faq.answer}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-[var(--brand-border)] bg-[var(--brand-black)] text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 md:flex-row md:items-center md:justify-between md:px-6">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight">
              Comece com um catálogo online pronto para compartilhar
            </h2>
            <div className="mt-4 flex flex-wrap gap-3">
              {page.related.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-white/75 hover:text-white"
                >
                  {item.label}
                  <ArrowRight className="size-4" />
                </Link>
              ))}
            </div>
          </div>
          <Button variant="secondary" size="lg" render={<Link href="/register" />}>
            Criar catálogo grátis
          </Button>
        </div>
      </section>
    </main>
  );
}
