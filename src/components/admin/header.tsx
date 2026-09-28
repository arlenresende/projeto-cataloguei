"use client";

import { Menu } from "lucide-react";

interface HeaderProps {
  onOpenMenu: () => void;
}

export function Header({ onOpenMenu }: HeaderProps) {
  return (
    <header className="flex min-h-[65px] items-center border-b border-[var(--brand-border)] bg-white px-6 py-3.5 lg:px-8">
      <button
        onClick={onOpenMenu}
        className="rounded-lg p-1 hover:bg-[var(--brand-tertiary)] lg:hidden"
        aria-label="Abrir navegação"
      >
        <Menu size={20} />
      </button>
    </header>
  );
}
