"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Settings,
  Store,
  Image,
  Tags,
  Link2,
  CreditCard,
  X,
  LogOut,
} from "lucide-react";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/stores", label: "Minha loja", icon: Store },
  { href: "/admin/products", label: "Produtos", icon: Package },
  { href: "/admin/categories", label: "Categorias", icon: Tags },
  { href: "/admin/banners", label: "Banners", icon: Image },
  { href: "/admin/linktree", label: "Linktree", icon: Link2 },
  { href: "/admin/plans", label: "Planos", icon: CreditCard },
  { href: "/admin/settings", label: "Configurações", icon: Settings },
];

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-10 bg-black/30 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-20 flex w-64 flex-col border-r border-[var(--brand-border)] bg-white px-4 py-5 transition-transform lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-1">
          <Link
            href="/"
            className="flex items-center gap-2.5 text-[var(--brand-black)] hover:opacity-70 transition-opacity"
          >
            <span className="flex size-8 items-center justify-center rounded-lg bg-[var(--brand-yellow)] text-sm font-bold text-[var(--brand-black)]">
              C
            </span>
            <span className="text-base font-bold">Cataloguei</span>
          </Link>
          <button
            onClick={onClose}
            className="rounded-lg p-1 hover:bg-[var(--brand-tertiary)] lg:hidden"
            aria-label="Fechar navegação"
          >
            <X size={18} />
          </button>
        </div>

        <nav
          className="mt-8 flex flex-1 flex-col gap-1"
          aria-label="Navegação do painel"
        >
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[var(--brand-yellow)] text-[var(--brand-black)]"
                    : "text-muted-foreground hover:bg-[var(--brand-tertiary)] hover:text-[var(--brand-black)]"
                }`}
              >
                <item.icon size={18} strokeWidth={isActive ? 2.2 : 1.8} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-[var(--brand-border)] pt-4">
          <SidebarSignOut />
        </div>
      </aside>
    </>
  );
}

function SidebarSignOut() {
  return <SidebarSignOutInner />;
}

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";

function SidebarSignOutInner() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSignOut() {
    setError(null);
    startTransition(async () => {
      const { error: signOutError } = await signOut({
        callbackURL: "/login",
      });
      if (signOutError) {
        setError(
          signOutError.message ||
            "Nao foi possivel encerrar a sessao. Tente novamente."
        );
        return;
      }
      router.push("/login");
      router.refresh();
    });
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleSignOut}
        disabled={isPending}
        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-[var(--brand-tertiary)] hover:text-[var(--brand-black)] disabled:opacity-50"
      >
        <LogOut size={18} strokeWidth={1.8} />
        {isPending ? "Saindo..." : "Sair"}
      </button>
      {error && <p className="mt-2 text-xs text-[var(--brand-error)]">{error}</p>}
    </div>
  );
}
