import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ hasStore: false });
  }

  const store = await prisma.store.findUnique({
    where: { ownerId: session.user.id },
    select: { id: true },
  });

  return NextResponse.json({ hasStore: !!store });
}
