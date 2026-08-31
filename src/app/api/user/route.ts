import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import {
  BillingAccessError,
  cancelUserStripeSubscription,
} from "@/lib/billing/subscription";
import { prisma } from "@/lib/prisma";

// DELETE /api/user — delete the authenticated user's account
export async function DELETE() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  try {
    await cancelUserStripeSubscription(session.user.id, {
      immediately: true,
    }).catch((error) => {
      if (
        error instanceof BillingAccessError &&
        error.code === "subscription_not_found"
      ) {
        return;
      }

      throw error;
    });

    // Delete user and all related data (cascading via Prisma schema)
    await prisma.user.delete({
      where: { id: session.user.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Erro ao excluir a conta. Tente novamente." },
      { status: 500 }
    );
  }
}
