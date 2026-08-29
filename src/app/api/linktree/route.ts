import { NextResponse } from "next/server";
import { requireVerifiedSession } from "@/lib/api-session";
import { prisma } from "@/lib/prisma";
import { linktreeSchema } from "@/lib/schemas/linktree";

// GET /api/linktree — get the authenticated user's linktree
export async function GET() {
  const session = await requireVerifiedSession(
    "Verifique seu e-mail antes de acessar o Linktree."
  );
  if (session instanceof NextResponse) {
    return session;
  }

  const linktree = await prisma.linktree.findUnique({
    where: { userId: session.user.id },
    include: { links: { orderBy: { order: "asc" } } },
  });

  return NextResponse.json({ linktree });
}

// POST /api/linktree — create or update the linktree with links
export async function POST(request: Request) {
  const session = await requireVerifiedSession(
    "Verifique seu e-mail antes de criar um Linktree."
  );
  if (session instanceof NextResponse) {
    return session;
  }

  const body = await request.json();
  const parsed = linktreeSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 }
    );
  }

  const data = parsed.data;

  try {
    // Upsert linktree
    const linktree = await prisma.linktree.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        title: data.title,
        description: data.description || null,
        backgroundColor: data.backgroundColor || null,
        textColor: data.textColor || null,
      },
      update: {
        title: data.title,
        description: data.description || null,
        backgroundColor: data.backgroundColor || null,
        textColor: data.textColor || null,
      },
    });

    // Get existing link IDs
    const existingLinks = await prisma.link.findMany({
      where: { linktreeId: linktree.id },
      select: { id: true },
    });
    const existingIds = new Set(existingLinks.map((l) => l.id));
    const submittedIds = new Set(
      data.links.filter((l) => l.id).map((l) => l.id!)
    );

    // Delete links that are no longer in the submitted list
    const toDelete = existingLinks.filter((l) => !submittedIds.has(l.id));
    if (toDelete.length > 0) {
      await prisma.link.deleteMany({
        where: { id: { in: toDelete.map((l) => l.id) } },
      });
    }

    // Upsert each link
    for (let i = 0; i < data.links.length; i++) {
      const link = data.links[i];
      if (link.id && existingIds.has(link.id)) {
        await prisma.link.updateMany({
          where: { id: link.id, linktreeId: linktree.id },
          data: {
            title: link.title,
            url: link.url,
            linkType: link.linkType || null,
            order: i,
          },
        });
      } else {
        await prisma.link.create({
          data: {
            linktreeId: linktree.id,
            title: link.title,
            url: link.url,
            linkType: link.linkType || null,
            order: i,
          },
        });
      }
    }

    // Return updated linktree with links
    const result = await prisma.linktree.findUnique({
      where: { id: linktree.id },
      include: { links: { orderBy: { order: "asc" } } },
    });

    return NextResponse.json({ linktree: result });
  } catch (error) {
    console.error("Error saving linktree:", error);
    return NextResponse.json(
      { error: "Erro ao salvar o Linktree." },
      { status: 500 }
    );
  }
}
