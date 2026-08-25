"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Settings,
  Store,
  LogOut,
} from "lucide-react";
import { signOut } from "@/lib/auth-client";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Produtos", icon: Package },
  { href: "/admin/settings", label: "Configurações", icon: Settings },
];

interface AdminShellProps {
  children: React.ReactNode;
}

export function AdminShell({ children }: AdminShellProps) {
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
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-900 hover:opacity-70 transition-opacity"
          >
            <Store className="size-6 text-indigo-600" />
            <span className="font-bold">Cataloguei</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors text-sm font-medium"
            >
              <item.icon className="size-5" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button
            type="button"
            onClick={handleSignOut}
            disabled={isPending}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-gray-500 transition-colors hover:bg-gray-100 disabled:opacity-50"
          >
            <LogOut className="size-5" />
            {isPending ? "Saindo..." : "Sair"}
          </button>

          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
