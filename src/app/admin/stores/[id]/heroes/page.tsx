import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { HeroesContent } from "./heroes-content";

export default async function HeroesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const { id } = await params;

  const store = await prisma.store.findFirst({
    where: { id, userId: session.user.id },
    select: { id: true },
  });

  if (!store) notFound();

  const heroes = await prisma.storeHero.findMany({
    where: { storeId: store.id },
    orderBy: { position: "asc" },
  });

  return <HeroesContent storeId={store.id} initialHeroes={heroes} />;
}
