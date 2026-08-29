import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Página não encontrada",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-6 py-16">
      <section className="mx-auto max-w-xl text-center">
        <p className="text-sm font-bold uppercase tracking-[0.24em] text-violet-600">
          Erro 404
        </p>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-zinc-950 md:text-4xl">
          Não encontramos a página que você tentou acessar.
        </h1>
        <p className="mt-4 text-base leading-relaxed text-zinc-600">
          A URL pode estar incorreta, ter mudado ou não estar mais disponível.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link
            href="/"
            className="rounded-xl bg-zinc-950 px-5 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
          >
            Voltar para a home
          </Link>
        </div>
      </section>
    </main>
  );
}
