"use client";

import { useState } from "react";
import { Loader2, AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";

interface DeleteStoreDialogProps {
  open: boolean;
  onClose: () => void;
  storeName: string;
  onConfirm: () => Promise<void>;
  error?: string | null;
}

export function DeleteStoreDialog({
  open,
  onClose,
  storeName,
  onConfirm,
  error,
}: DeleteStoreDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmation, setConfirmation] = useState("");
  const canDelete = confirmation === storeName;

  const handleConfirm = async () => {
    if (!canDelete) {
      return;
    }

    setIsDeleting(true);
    await onConfirm();
    setIsDeleting(false);
  };

  return (
    <Dialog open={open}>
      <DialogContent>
        <DialogHeader>
          <div className="mb-3 flex size-12 items-center justify-center rounded-2xl bg-[var(--brand-error-light)]">
            <AlertTriangle size={24} className="text-[var(--brand-error)]" />
          </div>
          <DialogTitle className="text-[var(--brand-black)]">
            Excluir loja?
          </DialogTitle>
          <DialogDescription className="text-[var(--brand-black)]">
            Isso excluirá permanentemente a loja e recursos relacionados, como
            produtos, categorias, banners, imagens, links e métricas.
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 pb-6">
          <div className="mb-5 space-y-2">
            <p className="text-sm text-[var(--brand-black)]">
              Para confirmar, digite{" "}
              <strong className="font-bold">“{storeName}”</strong>
            </p>
            <input
              type="text"
              value={confirmation}
              onChange={(event) => setConfirmation(event.target.value)}
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              className="w-full rounded-xl border border-[var(--brand-border)] bg-white px-4 py-3 text-sm font-medium text-[var(--brand-black)] outline-none transition-colors placeholder:text-muted-foreground focus:border-[var(--brand-black)]"
              placeholder={storeName}
            />
          </div>

          {error ? (
            <div className="mb-3 rounded-lg bg-[var(--brand-error-light)] px-4 py-3 text-sm font-medium text-[var(--brand-error)]">
              {error}
            </div>
          ) : null}

          <div className="flex gap-3">
            <DialogClose
              onClick={onClose}
              className="flex-1 rounded-xl border border-[var(--brand-border)] py-2.5 text-sm font-bold text-[var(--brand-black)] transition-colors hover:bg-[var(--brand-tertiary)]"
            >
              Cancelar
            </DialogClose>
            <button
              onClick={handleConfirm}
              disabled={isDeleting || !canDelete}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 py-2.5 text-sm font-bold text-white transition-all hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isDeleting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Excluindo...
                </>
              ) : (
                "Excluir loja"
              )}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
