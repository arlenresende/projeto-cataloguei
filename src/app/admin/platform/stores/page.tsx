import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { isAdminUser } from "@/lib/feature-requests";
import { prisma } from "@/lib/prisma";
import { AdminStoresContent } from "./stores-content";

export default async function AdminStoresPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return null;
  }

  const isAdmin = await isAdminUser({
    userId: session.user.id,
    email: session.user.email,
  });

  if (!isAdmin) {
    redirect("/admin/dashboard");
  }

  const stores = await prisma.store.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      slug: true,
      isActive: true,
      adminSuspendedAt: true,
      adminSuspensionReason: true,
      createdAt: true,
      updatedAt: true,
      user: {
        select: {
          name: true,
          email: true,
          subscription: {
            select: {
              plan: true,
              status: true,
            },
          },
        },
      },
      _count: {
        select: {
          products: true,
          categories: true,
          heroes: true,
        },
      },
    },
  });

  return (
    <AdminStoresContent
      stores={stores.map((store) => ({
        id: store.id,
        name: store.name,
        slug: store.slug,
        isActive: store.isActive,
        adminSuspendedAt: store.adminSuspendedAt?.toISOString() ?? null,
        adminSuspensionReason: store.adminSuspensionReason,
        ownerName: store.user.name,
        ownerEmail: store.user.email,
        plan: store.user.subscription?.plan ?? "FREE",
        subscriptionStatus: store.user.subscription?.status ?? "INACTIVE",
        products: store._count.products,
        categories: store._count.categories,
        banners: store._count.heroes,
        createdAt: store.createdAt.toISOString(),
        updatedAt: store.updatedAt.toISOString(),
      }))}
    />
  );
}
