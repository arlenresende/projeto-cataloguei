"use client";

import { CircleHelp, Menu, Search } from "lucide-react";

interface HeaderProps {
  onOpenMenu: () => void;
}

export function Header({ onOpenMenu }: HeaderProps) {
  return (
    <header className="flex items-center gap-4 border-b border-border px-5 py-4 lg:px-8">
      <button
        onClick={onOpenMenu}
        className="lg:hidden"
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
          className="h-9 w-full rounded-full border border-border bg-card pl-10 pr-4 text-xs outline-none focus:border-foreground"
          placeholder='Buscar produtos, configurações...'
        />
      </div>

      <button className="hidden text-xs text-muted-foreground sm:block">
        <CircleHelp size={17} />
      </button>

      <span className="hidden size-8 items-center justify-center rounded-full bg-accent text-xs font-bold sm:flex">
        CA
      </span>
    </header>
  );
}
