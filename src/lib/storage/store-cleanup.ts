import "server-only";

import { prisma } from "@/lib/prisma";
import {
  extractStoreAssetObjectKeys,
  hasSupabaseStorageAssetUrls,
} from "@/lib/storage/store-asset-keys";
import {
  deleteFilesFromSupabaseStorage,
  getSupabaseStorageBucketName,
} from "@/lib/storage/supabase";

export async function deleteStoreStorageAssets(storeId: string) {
  const store = await prisma.store.findUnique({
    where: { id: storeId },
    select: {
      logo: true,
      heroes: { select: { image: true } },
      products: {
        select: {
          imageUrl: true,
          images: { select: { url: true } },
        },
      },
    },
  });

  if (!store) {
    return;
  }

  if (!hasSupabaseStorageAssetUrls([store])) {
    return;
  }

  const bucketName = getSupabaseStorageBucketName();
  const objectKeys = extractStoreAssetObjectKeys([store], bucketName);
  await deleteFilesFromSupabaseStorage(objectKeys);
}

export async function deleteUserStoreStorageAssets(userId: string) {
  const stores = await prisma.store.findMany({
    where: { userId },
    select: {
      logo: true,
      heroes: { select: { image: true } },
      products: {
        select: {
          imageUrl: true,
          images: { select: { url: true } },
        },
      },
    },
  });

  if (stores.length === 0) {
    return;
  }

  if (!hasSupabaseStorageAssetUrls(stores)) {
    return;
  }

  const bucketName = getSupabaseStorageBucketName();
  const objectKeys = extractStoreAssetObjectKeys(stores, bucketName);
  await deleteFilesFromSupabaseStorage(objectKeys);
}
