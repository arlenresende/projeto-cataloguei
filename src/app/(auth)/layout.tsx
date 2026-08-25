import Link from "next/link";
import { Store } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-svh flex flex-col items-center justify-center bg-zinc-50 px-4 py-12">
      <Link
        href="/"
        className="flex items-center gap-2 mb-8 text-zinc-900 hover:opacity-80 transition-opacity"
      >
        <span className="grid place-items-center size-9 rounded-lg bg-violet-600 text-white">
          <Store className="size-5" />
        </span>
        <span className="text-lg font-semibold tracking-tight">
          Cataloguei
        </span>
      </Link>

      {children}
    </div>
  );
}
