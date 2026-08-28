import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ hasStore: false });
    }

    const store = await prisma.store.findFirst({
      where: { userId: session.user.id },
      select: { id: true },
    });

    return NextResponse.json({ hasStore: !!store });
  } catch (error) {
    console.error("Error in /api/stores/check:", error);
    return NextResponse.json(
      { error: "Erro interno.", hasStore: false },
      { status: 500 }
    );
  }
}
