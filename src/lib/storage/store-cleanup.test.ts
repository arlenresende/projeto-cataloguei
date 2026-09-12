import { describe, expect, it } from "vitest";
import {
  extractStoreAssetObjectKeys,
  hasSupabaseStorageAssetUrls,
} from "@/lib/storage/store-asset-keys";

function publicStorageUrl(objectKey: string) {
  return `https://example.supabase.co/storage/v1/object/public/cataloguei/${objectKey}`;
}

describe("store storage cleanup", () => {
  it("extrai chaves de arquivos da loja no Supabase Storage", () => {
    const objectKeys = extractStoreAssetObjectKeys(
      [
        {
          logo: publicStorageUrl("stores/store_1/logo/logo.png"),
          heroes: [
            { image: publicStorageUrl("stores/store_1/heroes/banner.webp") },
            { image: null },
          ],
          products: [
            {
              imageUrl: publicStorageUrl("stores/store_1/products/product_1/main.jpg"),
              images: [
                {
                  url: publicStorageUrl("stores/store_1/products/product_1/main.jpg"),
                },
                {
                  url: publicStorageUrl(
                    "stores/store_1/products/product_1/gallery.png"
                  ),
                },
              ],
            },
            {
              imageUrl: "/placeholder-product.svg",
              images: [{ url: "https://cdn.example.com/external-image.png" }],
            },
          ],
        },
      ],
      "cataloguei"
    );

    expect(objectKeys).toEqual([
      "stores/store_1/logo/logo.png",
      "stores/store_1/heroes/banner.webp",
      "stores/store_1/products/product_1/main.jpg",
      "stores/store_1/products/product_1/gallery.png",
    ]);
  });

  it("identifica quando a loja nao possui arquivos do Supabase Storage", () => {
    expect(
      hasSupabaseStorageAssetUrls([
        {
          logo: "/placeholder-logo.svg",
          heroes: [{ image: "https://cdn.example.com/banner.png" }],
          products: [
            {
              imageUrl: "/placeholder-product.svg",
              images: [],
            },
          ],
        },
      ])
    ).toBe(false);
  });
});
