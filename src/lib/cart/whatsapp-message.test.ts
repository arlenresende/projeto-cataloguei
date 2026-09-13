import { describe, expect, it } from "vitest";
import { buildCartWhatsAppMessage } from "@/lib/cart/whatsapp-message";

describe("cart whatsapp message", () => {
  it("monta pedido com itens, subtotais, total e links", () => {
    const message = buildCartWhatsAppMessage({
      storeName: "Bella Store",
      storeUrl: "bella-store",
      origin: "https://cataloguei.com.br",
      items: [
        {
          id: "product_1",
          name: "Bolsa couro",
          slug: "bolsa-couro",
          price: 189,
          imageUrl: "/produto.jpg",
          quantity: 2,
        },
        {
          id: "product_2",
          name: "Brinco dourado",
          slug: null,
          price: 59,
          imageUrl: null,
          quantity: 1,
        },
      ],
    });

    expect(message).toContain(
      "Olá! Vim pelo catálogo da Bella Store e quero fazer este pedido:"
    );
    expect(message).toContain("1. Bolsa couro");
    expect(message).toContain("Quantidade: 2");
    expect(message).toContain("Subtotal: R$ 378,00");
    expect(message).toContain(
      "Link: https://cataloguei.com.br/bella-store/product/bolsa-couro"
    );
    expect(message).toContain(
      "Link: https://cataloguei.com.br/bella-store/product/product_2"
    );
    expect(message).toContain("Total estimado: R$ 437,00");
    expect(message).toContain("Endereço de entrega:");
  });
});
