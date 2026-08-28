import { notFound } from "next/navigation";
import { ThemeWrapper } from "@/components/store/ThemeWrapper";
import { getPublicStoreBySlug } from "@/lib/store-data";

interface StoreLayoutProps {
  children: React.ReactNode;
  params: Promise<{ storeUrl: string }>;
}

export default async function StoreLayout({
  children,
  params,
}: StoreLayoutProps) {
  const { storeUrl } = await params;
  const store = await getPublicStoreBySlug(storeUrl);

  if (!store) {
    notFound();
  }

  return (
    <ThemeWrapper segment={store.theme}>
      {children}
    </ThemeWrapper>
  );
}
