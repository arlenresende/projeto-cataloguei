import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export const SUPABASE_STORAGE_CONFIG_ERROR_MESSAGE =
  "As variáveis do Supabase Storage não estão configuradas corretamente.";

type SupabaseStorageConfig = {
  url: string;
  serviceRoleKey: string;
  bucketName: string;
};

let cachedClient: SupabaseClient | null = null;

function getSupabaseStorageConfig(): SupabaseStorageConfig {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const bucketName = process.env.SUPABASE_STORAGE_BUCKET;

  if (!url || !serviceRoleKey || !bucketName) {
    throw new Error(SUPABASE_STORAGE_CONFIG_ERROR_MESSAGE);
  }

  return {
    url,
    serviceRoleKey,
    bucketName,
  };
}

function getSupabaseAdminClient() {
  if (cachedClient) {
    return cachedClient;
  }

  const config = getSupabaseStorageConfig();

  cachedClient = createClient(config.url, config.serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return cachedClient;
}

export function getSupabaseStorageBucketName() {
  return getSupabaseStorageConfig().bucketName;
}

export async function uploadFileToSupabaseStorage(params: {
  objectKey: string;
  body: Uint8Array;
  contentType: string;
}) {
  const client = getSupabaseAdminClient();
  const bucketName = getSupabaseStorageBucketName();

  const uploadResult = await client.storage.from(bucketName).upload(
    params.objectKey,
    Buffer.from(params.body),
    {
      contentType: params.contentType,
      upsert: false,
      cacheControl: "31536000",
    }
  );

  if (uploadResult.error) {
    throw uploadResult.error;
  }

  const publicUrlResult = client.storage
    .from(bucketName)
    .getPublicUrl(params.objectKey);

  return {
    objectKey: params.objectKey,
    publicUrl: publicUrlResult.data.publicUrl,
  };
}

export async function deleteFileFromSupabaseStorage(objectKey: string) {
  const client = getSupabaseAdminClient();
  const bucketName = getSupabaseStorageBucketName();
  const deleteResult = await client.storage.from(bucketName).remove([objectKey]);

  if (deleteResult.error) {
    throw deleteResult.error;
  }
}
