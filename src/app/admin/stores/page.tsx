import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { StoresContent } from "./stores-content";

export default async function StoresPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  let store = null;

  if (session) {
    store = await prisma.store.findUnique({
      where: { userId: session.user.id },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        logo: true,
        isActive: true,
        themeStore: true,
        createdAt: true,
      },
    });
  }

  return (
    <StoresContent
      key={store?.id ?? "empty-store"}
      initialStore={store}
    />
  );
}
