"use client";

import Link from "next/link";
import { Menu, Store, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Recursos", href: "#features" },
  { label: "Demonstração", href: "#showcase" },
  { label: "Como funciona", href: "#how-it-works" },
  { label: "Preços", href: "#pricing" },
  { label: "Contato", href: "#contato" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--brand-border)] bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:h-[72px]">
        <Link
          href="/"
          className="flex items-center gap-2.5"
          aria-label="Cataloguei - Página inicial"
        >
          <span
            className="flex size-9 items-center justify-center rounded-lg bg-[var(--brand-yellow)] text-[var(--brand-black)]"
            aria-hidden="true"
          >
            <Store className="size-5" />
          </span>
          <span className="text-lg font-bold text-[var(--brand-black)]">Cataloguei</span>
        </Link>

        <nav
          className="hidden items-center gap-7 md:flex"
          aria-label="Navegação principal"
        >
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-[var(--brand-black)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Button
            variant="ghost"
            size="sm"
            render={<Link href="/login">Entrar</Link>}
          />
          <Button
            size="sm"
            render={<Link href="/register">Criar catálogo</Link>}
          />
        </div>

        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="inline-flex size-10 items-center justify-center rounded-lg border border-[var(--brand-border)] text-[var(--brand-black)] md:hidden"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          aria-controls="mobile-nav"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      <div
        id="mobile-nav"
        className={cn(
          "border-t border-[var(--brand-border)] bg-white md:hidden",
          open ? "block" : "hidden"
        )}
      >
        <nav
          className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-4"
          aria-label="Navegação mobile"
        >
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-[var(--brand-tertiary)] hover:text-[var(--brand-black)]"
            >
              {item.label}
            </Link>
          ))}
          <div className="mt-3 flex flex-col gap-2 border-t border-[var(--brand-border)] pt-4">
            <Button
              variant="outline"
              render={<Link href="/login">Entrar</Link>}
              className="w-full"
            />
            <Button
              render={<Link href="/register">Criar catálogo</Link>}
              className="w-full"
            />
          </div>
        </nav>
      </div>
    </header>
  );
}
