import { Prisma, SubscriptionStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { getAsaasSubscription } from "@/lib/asaas/subscriptions";
import {
  ASAAS_WEBHOOK_TOKEN_HEADER,
  getAsaasWebhookSource,
  mapPaymentEventToSubscriptionStatus,
  mapSubscriptionEventToSubscriptionStatus,
  parseAsaasDate,
  type AsaasWebhookPayload,
  validateAsaasWebhookToken,
} from "@/lib/asaas/webhooks";
import { syncAsaasCustomerId, updateSubscriptionSnapshot } from "@/lib/billing/subscription";
import { prisma } from "@/lib/prisma";
import { getPrismaErrorCode } from "@/lib/prisma-error";

function shouldKeepPremiumAccessUntilPeriodEnd(
  currentStatus: SubscriptionStatus,
  canceledAt: Date | null,
  currentPeriodEnd: Date | null
) {
  return (
    currentStatus === SubscriptionStatus.ACTIVE &&
    Boolean(canceledAt) &&
    Boolean(currentPeriodEnd) &&
    currentPeriodEnd!.getTime() > Date.now()
  );
}

async function findLocalSubscription(payload: AsaasWebhookPayload) {
  const subscriptionId =
    payload.subscription?.id || payload.payment?.subscription || null;
  const customerId =
    payload.subscription?.customer || payload.payment?.customer || null;
  const externalReference = payload.subscription?.externalReference || null;

  return prisma.subscription.findFirst({
    where: {
      OR: [
        ...(subscriptionId ? [{ asaasSubscriptionId: subscriptionId }] : []),
        ...(customerId ? [{ asaasCustomerId: customerId }] : []),
        ...(externalReference ? [{ userId: externalReference }] : []),
      ],
    },
  });
}

async function handlePaymentWebhook(
  payload: AsaasWebhookPayload,
  localSubscriptionId: string
) {
  if (!payload.payment) {
    return;
  }

  const localSubscription = await prisma.subscription.findUnique({
    where: { id: localSubscriptionId },
  });

  if (!localSubscription) {
    return;
  }

  const remoteSubscription = payload.payment.subscription
    ? await getAsaasSubscription(payload.payment.subscription).catch(() => null)
    : null;

  if (remoteSubscription?.customer) {
    await syncAsaasCustomerId(localSubscription.userId, remoteSubscription.customer);
  }

  const mappedStatus = mapPaymentEventToSubscriptionStatus(payload.event);
  const keepActive =
    mappedStatus === SubscriptionStatus.CANCELED &&
    shouldKeepPremiumAccessUntilPeriodEnd(
      localSubscription.status,
      localSubscription.canceledAt,
      localSubscription.currentPeriodEnd
    );

  await updateSubscriptionSnapshot(
    { id: localSubscriptionId },
    {
      plan: "PREMIUM",
      ...(mappedStatus && {
        status: keepActive ? SubscriptionStatus.ACTIVE : mappedStatus,
      }),
      asaasSubscriptionId:
        payload.payment.subscription || localSubscription.asaasSubscriptionId,
      asaasPaymentId: payload.payment.id,
      latestInvoiceUrl: payload.payment.invoiceUrl ?? null,
      latestPaymentStatus: payload.payment.status,
      currentPeriodStart:
        mappedStatus === SubscriptionStatus.ACTIVE
          ? parseAsaasDate(
              payload.payment.clientPaymentDate ||
                payload.payment.paymentDate ||
                payload.payment.confirmedDate
            ) || localSubscription.currentPeriodStart
          : localSubscription.currentPeriodStart,
      currentPeriodEnd:
        parseAsaasDate(remoteSubscription?.nextDueDate || payload.payment.dueDate) ||
        localSubscription.currentPeriodEnd,
    }
  );
}

async function handleSubscriptionWebhook(
  payload: AsaasWebhookPayload,
  localSubscriptionId: string
) {
  if (!payload.subscription) {
    return;
  }

  const localSubscription = await prisma.subscription.findUnique({
    where: { id: localSubscriptionId },
  });

  if (!localSubscription) {
    return;
  }

  await syncAsaasCustomerId(localSubscription.userId, payload.subscription.customer);

  const mappedStatus = mapSubscriptionEventToSubscriptionStatus(
    payload.event,
    payload.subscription.status
  );

  const isCancellationEvent =
    payload.event === "SUBSCRIPTION_DELETED" ||
    payload.event === "SUBSCRIPTION_INACTIVATED";

  const keepActive =
    isCancellationEvent &&
    shouldKeepPremiumAccessUntilPeriodEnd(
      localSubscription.status,
      localSubscription.canceledAt,
      localSubscription.currentPeriodEnd
    );

  await updateSubscriptionSnapshot(
    { id: localSubscriptionId },
    {
      plan: "PREMIUM",
      asaasCustomerId: payload.subscription.customer,
      asaasSubscriptionId: payload.subscription.id,
      currentPeriodEnd:
        parseAsaasDate(payload.subscription.nextDueDate) ||
        localSubscription.currentPeriodEnd,
      ...(mappedStatus && {
        status: keepActive ? SubscriptionStatus.ACTIVE : mappedStatus,
      }),
      ...(isCancellationEvent && {
        canceledAt: localSubscription.canceledAt || new Date(),
      }),
    }
  );
}

export async function POST(request: Request) {
  try {
    const isValid = validateAsaasWebhookToken(
      request.headers.get(ASAAS_WEBHOOK_TOKEN_HEADER)
    );

    if (!isValid) {
      return NextResponse.json({ error: "Webhook inválido." }, { status: 401 });
    }
  } catch (error) {
    console.error("Configuração inválida do webhook do Asaas:", error);
    return NextResponse.json(
      { error: "Webhook do Asaas não configurado no servidor." },
      { status: 500 }
    );
  }

  let payload: AsaasWebhookPayload;

  try {
    payload = (await request.json()) as AsaasWebhookPayload;
  } catch {
    return NextResponse.json({ error: "Payload inválido." }, { status: 400 });
  }

  if (!payload?.id || !payload?.event) {
    return NextResponse.json(
      { error: "Evento do webhook inválido." },
      { status: 400 }
    );
  }

  const source = getAsaasWebhookSource(payload);
  const localSubscription = await findLocalSubscription(payload);

  try {
    await prisma.asaasWebhookEvent.create({
      data: {
        eventId: payload.id,
        eventType: payload.event,
        source,
        userId: localSubscription?.userId ?? null,
        subscriptionId: localSubscription?.id ?? null,
        payload: payload as Prisma.InputJsonValue,
      },
    });
  } catch (error) {
    if (getPrismaErrorCode(error) === "P2002") {
      return NextResponse.json({ success: true, duplicate: true });
    }

    throw error;
  }

  if (!localSubscription) {
    return NextResponse.json({ success: true, ignored: true });
  }

  if (source === "payment") {
    await handlePaymentWebhook(payload, localSubscription.id);
  }

  if (source === "subscription") {
    await handleSubscriptionWebhook(payload, localSubscription.id);
  }

  return NextResponse.json({ success: true });
}
