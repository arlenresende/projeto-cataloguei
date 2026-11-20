import { describe, expect, it } from "vitest";
import {
  isReservedStoreSlug,
  normalizeStoreSlug,
  storeCreateSchema,
  storeUpdateSchema,
} from "@/lib/schemas/store";

const validStoreInput = {
  name: "Loja Modelo",
  slug: "loja-modelo",
};

describe("store schema", () => {
  it.each(["websiteUrl", "instagramUrl", "facebookUrl"] as const)(
    "normaliza %s no cadastro e na edição",
    (field) => {
      for (const [input, expected] of [
        [" minhaloja.com ", "https://minhaloja.com"],
        ["www.minhaloja.com.br", "https://www.minhaloja.com.br"],
        ["instagram.com/minhaloja?ref=perfil", "https://instagram.com/minhaloja?ref=perfil"],
        ["https://minhaloja.com", "https://minhaloja.com"],
        ["http://minhaloja.com", "http://minhaloja.com"],
        ["//minhaloja.com", "https://minhaloja.com"],
        ["   ", ""],
      ]) {
        expect(storeCreateSchema.parse({ ...validStoreInput, [field]: input })[field]).toBe(expected);
        expect(storeUpdateSchema.parse({ [field]: input })[field]).toBe(expected);
      }
      expect(storeUpdateSchema.parse({})[field]).toBeUndefined();
    }
  );

  it.each(["websiteUrl", "instagramUrl", "facebookUrl"] as const)(
    "rejeita endereços inválidos em %s",
    (field) => {
      for (const value of ["minha loja.com", "qualquercoisa", "https://", "javascript:alert(1)", "ftp://minhaloja.com"]) {
        expect(storeUpdateSchema.safeParse({ [field]: value }).success).toBe(false);
      }
    }
  );

  it("normaliza slugs de loja", () => {
    expect(normalizeStoreSlug("  Minha Loja Ágil!!  ")).toBe(
      "minha-loja-agil"
    );
  });

  it("bloqueia slugs reservados para rotas internas", () => {
    for (const slug of ["admin", "api", "login", "privacy", "terms", "og"]) {
      expect(storeCreateSchema.safeParse({ ...validStoreInput, slug }).success).toBe(
        false
      );
    }
  });

  it("bloqueia slug reservado apos normalizacao", () => {
    expect(isReservedStoreSlug(" Administração ")).toBe(false);
    expect(isReservedStoreSlug("API")).toBe(true);
    expect(
      storeCreateSchema.safeParse({ ...validStoreInput, slug: " API " }).success
    ).toBe(false);
  });

  it("permite slug valido de loja", () => {
    expect(
      storeCreateSchema.safeParse({ ...validStoreInput, slug: "minha-loja" })
        .success
    ).toBe(true);
  });
});
