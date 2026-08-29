import { NextResponse } from "next/server";
import { AsaasApiError } from "@/lib/asaas/client";
import { createAsaasCustomer } from "@/lib/asaas/customers";
import { createAsaasSubscription, listAsaasSubscriptionPayments } from "@/lib/asaas/subscriptions";
import { parseAsaasDate } from "@/lib/asaas/webhooks";
import { requireVerifiedSession } from "@/lib/api-session";
import { PREMIUM_MONTHLY_PRICE } from "@/lib/billing/plans";
import {
  getUserBillingState,
  serializeBillingState,
  syncAsaasCustomerId,
  updateSubscriptionSnapshot,
  upsertPremiumSubscription,
} from "@/lib/billing/subscription";
import { prisma } from "@/lib/prisma";

function getTodayAsDateInput() {
  return new Date().toISOString().slice(0, 10);
}

function normalizePhone(value?: string | null) {
  if (!value) {
    return null;
  }

  const digits = value.replace(/\D/g, "");
  return digits.length >= 10 ? digits : null;
}

export async function POST() {
  const session = await requireVerifiedSession(
    "Verifique seu e-mail antes de contratar o Premium."
  );
  if (session instanceof NextResponse) {
    return session;
  }

  try {
    const billing = await getUserBillingState(session.user.id);

    if (billing.isPremium) {
      return NextResponse.json(
        { error: "Sua assinatura Premium já está ativa." },
        { status: 409 }
      );
    }

    if (
      billing.subscription.plan === "PREMIUM" &&
      (billing.subscription.status === "PENDING" ||
        billing.subscription.status === "OVERDUE") &&
      billing.subscription.asaasSubscriptionId
    ) {
      const payments = await listAsaasSubscriptionPayments(
        billing.subscription.asaasSubscriptionId
      ).catch(() => null);
      const existingPayment = payments?.data?.[0] ?? null;

      if (existingPayment?.invoiceUrl) {
        await updateSubscriptionSnapshot(
          { userId: session.user.id },
          {
            asaasPaymentId: existingPayment.id,
            latestInvoiceUrl: existingPayment.invoiceUrl,
            latestPaymentStatus: existingPayment.status,
            currentPeriodEnd: parseAsaasDate(
              existingPayment.dueDate || billing.subscription.currentPeriodEnd?.toISOString()
            ),
          }
        );

        const refreshed = await getUserBillingState(session.user.id);

        return NextResponse.json({
          reused: true,
          checkoutUrl: existingPayment.invoiceUrl,
          payment: existingPayment,
          billing: serializeBillingState(refreshed),
        });
      }
    }

    const store = await prisma.store.findUnique({
      where: { userId: session.user.id },
      select: {
        phoneNumber: true,
        cellPhone: true,
        whatsappUrl: true,
      },
    });

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        asaasCustomerId: true,
      },
    });

    let asaasCustomerId =
      billing.subscription.asaasCustomerId || user?.asaasCustomerId || null;

    if (!asaasCustomerId) {
      const customer = await createAsaasCustomer({
        name: session.user.name,
        email: session.user.email,
        phone:
          normalizePhone(store?.cellPhone) ||
          normalizePhone(store?.phoneNumber) ||
          null,
        externalReference: session.user.id,
      });

      asaasCustomerId = customer.id;
      await syncAsaasCustomerId(session.user.id, customer.id);
    }

    const createdSubscription = await createAsaasSubscription({
      customer: asaasCustomerId,
      billingType: "CREDIT_CARD",
      value: PREMIUM_MONTHLY_PRICE,
      nextDueDate: getTodayAsDateInput(),
      description: "Cataloguei Premium - assinatura mensal",
      externalReference: session.user.id,
    });

    const payments = await listAsaasSubscriptionPayments(
      createdSubscription.id
    ).catch(() => null);
    const firstPayment = payments?.data?.[0] ?? null;

    await upsertPremiumSubscription(session.user.id, {
      asaasCustomerId,
      asaasSubscriptionId: createdSubscription.id,
      asaasPaymentId: firstPayment?.id ?? null,
      latestInvoiceUrl: firstPayment?.invoiceUrl ?? null,
      latestPaymentStatus: firstPayment?.status ?? "PENDING",
      currentPeriodEnd: parseAsaasDate(
        firstPayment?.dueDate || createdSubscription.nextDueDate
      ),
    });

    const refreshed = await getUserBillingState(session.user.id);

    return NextResponse.json(
      {
        checkoutUrl: firstPayment?.invoiceUrl ?? null,
        payment: firstPayment,
        asaasSubscriptionId: createdSubscription.id,
        billing: serializeBillingState(refreshed),
      },
      { status: 201 }
    );
  } catch (error) {
    if (
      error instanceof AsaasApiError ||
      (error instanceof Error && error.name === "AsaasApiError")
    ) {
      const asaasError = error as AsaasApiError;
      return NextResponse.json(
        {
          error:
            asaasError.message ||
            "Não foi possível iniciar a assinatura no Asaas.",
        },
        {
          status:
            asaasError.status >= 400 && asaasError.status < 500 ? 400 : 502,
        }
      );
    }

    if (
      error instanceof Error &&
      (error.message.includes("ASAAS_API_KEY") ||
        error.message.includes("ASAAS_API_URL"))
    ) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.error("Erro ao contratar Premium:", error);
    return NextResponse.json(
      { error: "Não foi possível iniciar a assinatura Premium." },
      { status: 500 }
    );
  }
}
