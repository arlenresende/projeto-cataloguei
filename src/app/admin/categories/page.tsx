import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CategoriesContent } from "./categories-content";

export default async function CategoriesPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const store = await prisma.store.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  });

  if (!store) redirect("/admin/stores");

  const categories = await prisma.category.findMany({
    where: { storeId: store.id },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { products: true } } },
  });

  return <CategoriesContent initialCategories={categories} />;
}
