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

interface DeleteHeroDialogProps {
  open: boolean;
  onClose: () => void;
  heroTitle: string;
  onConfirm: () => Promise<void>;
}

export function DeleteHeroDialog({
  open,
  onClose,
  heroTitle,
  onConfirm,
}: DeleteHeroDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
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
            Excluir hero?
          </DialogTitle>
          <DialogDescription className="text-[var(--brand-black)]">
            O hero <strong>&ldquo;{heroTitle}&rdquo;</strong> será removido
            permanentemente da sua loja.
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-3 px-6 pb-6">
          <DialogClose
            onClick={onClose}
            className="flex-1 rounded-xl border border-[var(--brand-border)] py-2.5 text-sm font-bold text-[var(--brand-black)] transition-colors hover:bg-[var(--brand-tertiary)]"
          >
            Cancelar
          </DialogClose>
          <button
            onClick={handleConfirm}
            disabled={isDeleting}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 py-2.5 text-sm font-bold text-white transition-all hover:bg-red-700 disabled:opacity-60"
          >
            {isDeleting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Excluindo...
              </>
            ) : (
              "Excluir hero"
            )}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
