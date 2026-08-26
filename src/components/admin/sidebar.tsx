"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Settings,
  X,
  LogOut,
} from "lucide-react";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Produtos", icon: Package },
  { href: "/admin/settings", label: "Configurações", icon: Settings },
];

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-20 w-64 border-r border-border bg-card px-5 py-5 transition-transform lg:static lg:translate-x-0 ${
        open ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-3 text-foreground hover:opacity-70 transition-opacity"
        >
          <span className="flex size-8 items-center justify-center rounded-full bg-foreground font-bold text-background text-sm">
            C
          </span>
          <span className="text-sm font-bold">
            Cataloguei
          </span>
        </Link>
        <button
          onClick={onClose}
          className="lg:hidden"
          aria-label="Fechar navegação"
        >
          <X size={18} />
        </button>
      </div>

      <nav
        className="mt-8 flex flex-col gap-1 text-sm"
        aria-label="Navegação do painel"
      >
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors ${
                isActive
                  ? "bg-[#ffd400] font-bold text-foreground shadow-[2px_2px_0_var(--foreground)]"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              <item.icon size={15} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-8">
        <SidebarSignOut />
      </div>
    </aside>
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
        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-muted-foreground transition-colors hover:bg-muted disabled:opacity-50"
      >
        <LogOut size={15} />
        {isPending ? "Saindo..." : "Sair"}
      </button>
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  );
}
