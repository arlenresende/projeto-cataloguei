import { extractSupabaseStorageObjectKey } from "@/lib/store-logo";

export type StoreAssetRecord = {
  logo: string | null;
  heroes: { image: string | null }[];
  products: {
    imageUrl: string | null;
    images: { url: string }[];
  }[];
};

function collectStoreAssetUrls(store: StoreAssetRecord) {
  return [
    store.logo,
    ...store.heroes.map((hero) => hero.image),
    ...store.products.flatMap((product) => [
      product.imageUrl,
      ...product.images.map((image) => image.url),
    ]),
  ].filter((value): value is string => Boolean(value));
}

export function hasSupabaseStorageAssetUrls(stores: StoreAssetRecord[]) {
  return stores
    .flatMap(collectStoreAssetUrls)
    .some((url) => url.includes("/storage/v1/object/public/"));
}

export function extractStoreAssetObjectKeys(
  stores: StoreAssetRecord[],
  bucketName: string
) {
  return Array.from(
    new Set(
      stores
        .flatMap(collectStoreAssetUrls)
        .map((url) => extractSupabaseStorageObjectKey(url, bucketName))
        .filter((value): value is string => Boolean(value))
    )
  );
}
