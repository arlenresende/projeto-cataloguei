"use client";

import { CircleHelp, Menu, Search } from "lucide-react";

interface HeaderProps {
  onOpenMenu: () => void;
}

export function Header({ onOpenMenu }: HeaderProps) {
  return (
    <header className="flex items-center gap-4 border-b border-[var(--brand-border)] bg-white px-6 py-3.5 lg:px-8">
      <button
        onClick={onOpenMenu}
        className="rounded-lg p-1 hover:bg-[var(--brand-tertiary)] lg:hidden"
        aria-label="Abrir navegação"
      >
        <Menu size={20} />
      </button>

      <div className="relative max-w-md flex-1">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          size={16}
        />
        <input
          className="h-9 w-full rounded-lg border border-[var(--brand-border)] bg-[var(--brand-tertiary)] pl-10 pr-4 text-sm outline-none transition-colors focus:border-[var(--brand-black)] focus:bg-white"
          placeholder="Buscar produtos, configurações..."
        />
      </div>

      <button className="hidden rounded-lg p-2 text-muted-foreground transition-colors hover:bg-[var(--brand-tertiary)] hover:text-[var(--brand-black)] sm:block">
        <CircleHelp size={18} />
      </button>

      <span className="hidden size-8 items-center justify-center rounded-lg bg-[var(--brand-yellow)] text-xs font-bold text-[var(--brand-black)] sm:flex">
        CA
      </span>
    </header>
  );
}
