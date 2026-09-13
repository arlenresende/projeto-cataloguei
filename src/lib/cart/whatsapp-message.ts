import type { CartItem } from "@/components/providers/CartProvider";

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).replace(/\s/g, " ");
}

export function buildCartWhatsAppMessage(input: {
  storeName: string;
  storeUrl: string;
  items: CartItem[];
  origin: string;
}) {
  const total = input.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const productLines = input.items
    .map((item, index) => {
      const subtotal = item.price * item.quantity;
      const productUrl = new URL(
        `/${input.storeUrl}/product/${item.slug || item.id}`,
        input.origin
      ).toString();

      return [
        `${index + 1}. ${item.name}`,
        `Quantidade: ${item.quantity}`,
        `Valor unitário: ${formatCurrency(item.price)}`,
        `Subtotal: ${formatCurrency(subtotal)}`,
        `Link: ${productUrl}`,
      ].join("\n");
    })
    .join("\n\n");

  return [
    `Olá! Vim pelo catálogo da ${input.storeName} e quero fazer este pedido:`,
    "",
    productLines,
    "",
    `Total estimado: ${formatCurrency(total)}`,
    "",
    "Meu nome:",
    "Endereço de entrega:",
    "Forma de pagamento:",
    "Observações:",
  ].join("\n");
}
