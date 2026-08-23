import { notFound } from "next/navigation";
import { ThemeWrapper } from "@/components/store/ThemeWrapper";
import { getStoreByUrl } from "@/lib/mock-data";

interface StoreLayoutProps {
  children: React.ReactNode;
  params: Promise<{ storeUrl: string }>;
}

export default async function StoreLayout({
  children,
  params,
}: StoreLayoutProps) {
  const { storeUrl } = await params;
  const store = getStoreByUrl(storeUrl);

  if (!store) {
    notFound();
  }

  return (
    <ThemeWrapper
      segment={store.theme}
      overrides={{
        primaryColor: store.primaryColor,
        secondaryColor: store.secondaryColor,
      }}
    >
      {children}
    </ThemeWrapper>
  );
}
