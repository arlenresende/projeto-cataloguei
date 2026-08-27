"use client";

import Image from "next/image";
import { Minus, Plus, Trash2, ShoppingBag, MessageCircle } from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";
import {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

interface CartItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

interface CartDrawerProps {
  whatsapp: string;
  storeName: string;
  children: React.ReactNode;
}

// Mock cart items for demo
const MOCK_CART: CartItem[] = [
  {
    id: "1",
    name: "Fone Bluetooth Pro",
    price: 299.9,
    imageUrl: "/placeholder-product.svg",
    quantity: 1,
  },
  {
    id: "3",
    name: "Carregador Turbo 65W",
    price: 129.9,
    imageUrl: "/placeholder-product.svg",
    quantity: 1,
  },
];

export function CartDrawer({ whatsapp, storeName, children }: CartDrawerProps) {
  const { resolvedColors } = useTheme();
  const items = MOCK_CART;
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleWhatsAppOrder = () => {
    const productList = items
      .map((item) => `${item.quantity}x ${item.name}`)
      .join(", ");
    const message = encodeURIComponent(
      `Olá! Gostaria de fazer um pedido na ${storeName}:\n\n${productList}\n\nTotal: ${total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}`
    );
    window.open(`https://wa.me/${whatsapp}?text=${message}`, "_blank");
  };

  return (
    <Sheet>
      <SheetTrigger>{children}</SheetTrigger>
      <SheetContent
        style={{
          borderColor: resolvedColors.border,
          color: resolvedColors.text,
        }}
      >
        {/* Yellow accent stripe */}
        <div
          className="h-1 w-full shrink-0"
          style={{ backgroundColor: resolvedColors.primary }}
        />

        <SheetHeader
          style={{ borderBottom: `1px solid ${resolvedColors.border}` }}
        >
          <SheetTitle style={{ color: resolvedColors.text }}>
            Seu carrinho
          </SheetTitle>
          <SheetDescription style={{ color: resolvedColors.text }}>
            {itemCount} {itemCount === 1 ? "produto" : "produtos"}
          </SheetDescription>
        </SheetHeader>

        {items.length > 0 ? (
          <>
            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <div className="flex flex-col gap-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3 rounded-xl border p-3 transition-colors hover:border-[var(--brand-yellow)]/40"
                    style={{ borderColor: resolvedColors.border }}
                  >
                    <div
                      className="relative size-16 shrink-0 overflow-hidden rounded-lg"
                      style={{ backgroundColor: resolvedColors.background }}
                    >
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col justify-between">
                      <div>
                        <p
                          className="truncate text-sm font-bold"
                          style={{ color: resolvedColors.text }}
                        >
                          {item.name}
                        </p>
                        <p
                          className="mt-0.5 text-sm font-extrabold"
                          style={{ color: resolvedColors.primary }}
                        >
                          {item.price.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div
                          className="flex items-center gap-1 rounded-lg border"
                          style={{ borderColor: resolvedColors.border }}
                        >
                          <button
                            className="flex size-7 items-center justify-center rounded-l-lg transition-colors hover:bg-black/5"
                            style={{ color: resolvedColors.text }}
                            aria-label="Diminuir quantidade"
                          >
                            <Minus size={14} />
                          </button>
                          <span
                            className="flex size-7 items-center justify-center text-xs font-bold"
                            style={{ color: resolvedColors.text }}
                          >
                            {item.quantity}
                          </span>
                          <button
                            className="flex size-7 items-center justify-center rounded-r-lg transition-colors hover:bg-black/5"
                            style={{ color: resolvedColors.text }}
                            aria-label="Aumentar quantidade"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <button
                          className="rounded-lg p-1.5 transition-colors hover:bg-red-50 hover:text-red-500"
                          style={{ color: resolvedColors.text, opacity: 0.4 }}
                          aria-label="Remover produto"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div
              className="border-t px-6 py-5"
              style={{
                borderColor: resolvedColors.border,
                backgroundColor: resolvedColors.primary + "08",
              }}
            >
              <div className="mb-4 flex items-baseline justify-between">
                <span
                  className="text-sm font-semibold"
                  style={{ color: resolvedColors.text, opacity: 0.7 }}
                >
                  Subtotal
                </span>
                <span
                  className="text-xl font-extrabold"
                  style={{ color: resolvedColors.text }}
                >
                  {total.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </span>
              </div>
              <button
                onClick={handleWhatsAppOrder}
                className="flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold text-white transition-all hover:shadow-lg active:scale-[0.98]"
                style={{ backgroundColor: "#25D366" }}
              >
                <MessageCircle size={18} />
                Pedir no WhatsApp
              </button>
            </div>
          </>
        ) : (
          /* Empty state */
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <div
              className="mb-4 flex size-16 items-center justify-center rounded-2xl"
              style={{ backgroundColor: resolvedColors.primary + "15" }}
            >
              <ShoppingBag
                size={28}
                style={{ color: resolvedColors.primary }}
              />
            </div>
            <p
              className="text-base font-bold"
              style={{ color: resolvedColors.text }}
            >
              Seu carrinho está vazio
            </p>
            <p
              className="mt-2 text-sm font-medium"
              style={{ color: resolvedColors.text, opacity: 0.5 }}
            >
              Adicione produtos ao carrinho para continuar.
            </p>
            <SheetClose
              className="mt-6 rounded-xl px-6 py-2.5 text-sm font-bold transition-all hover:shadow-md active:scale-[0.98]"
              style={{
                backgroundColor: resolvedColors.primary,
                color: resolvedColors.secondary,
              }}
            >
              Continuar comprando
            </SheetClose>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
