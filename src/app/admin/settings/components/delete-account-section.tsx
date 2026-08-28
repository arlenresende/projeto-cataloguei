"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, AlertTriangle, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { signOut } from "@/lib/auth-client";

export function DeleteAccountSection() {
  const router = useRouter();
  const [showDialog, setShowDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    setError(null);
    setIsDeleting(true);

    try {
      const res = await fetch("/api/user", { method: "DELETE" });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Erro ao excluir a conta.");
        setIsDeleting(false);
        return;
      }

      // Sign out and redirect
      await signOut({ callbackURL: "/" });
      router.push("/");
    } catch {
      setError("Erro de conexão. Tente novamente.");
      setIsDeleting(false);
    }
  }

  return (
    <>
      <div className="rounded-2xl border border-red-200 bg-red-50/50 p-6">
        <h3 className="text-base font-bold text-red-700">
          Zona de perigo
        </h3>
        <p className="mt-2 text-sm text-red-600/80">
          Ao excluir sua conta, todos os seus dados serão removidos
          permanentemente, incluindo sua loja e produtos. Essa ação não
          pode ser desfeita.
        </p>
        <button
          onClick={() => setShowDialog(true)}
          className="mt-4 flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-red-700"
        >
          <Trash2 size={16} />
          Excluir minha conta
        </button>
      </div>

      <Dialog open={showDialog}>
        <DialogContent>
          <DialogHeader>
            <div className="mb-3 flex size-12 items-center justify-center rounded-2xl bg-red-100">
              <AlertTriangle size={24} className="text-red-600" />
            </div>
            <DialogTitle className="text-[var(--brand-black)]">
              Excluir sua conta?
            </DialogTitle>
            <DialogDescription className="text-[var(--brand-black)]">
              Essa ação é <strong>irreversível</strong>. Todos os seus dados,
              incluindo sua loja, produtos e configurações serão removidos
              permanentemente.
            </DialogDescription>
          </DialogHeader>

          {error && (
            <div className="mx-6 rounded-lg bg-red-100 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          <div className="flex gap-3 px-6 pb-6">
            <DialogClose
              onClick={() => {
                setShowDialog(false);
                setError(null);
              }}
              className="flex-1 rounded-xl border border-[var(--brand-border)] py-2.5 text-sm font-bold text-[var(--brand-black)] transition-colors hover:bg-[var(--brand-tertiary)]"
            >
              Cancelar
            </DialogClose>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 py-2.5 text-sm font-bold text-white transition-all hover:bg-red-700 disabled:opacity-60"
            >
              {isDeleting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Excluindo...
                </>
              ) : (
                "Sim, excluir minha conta"
              )}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
