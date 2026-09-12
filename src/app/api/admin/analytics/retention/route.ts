import { NextResponse } from "next/server";
import { requireVerifiedSession } from "@/lib/api-session";
import { enforceAnalyticsRetention } from "@/lib/analytics/retention";
import { isAdminUser } from "@/lib/feature-requests";

function isAuthorizedCronRequest(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  const authorization = request.headers.get("authorization");

  return Boolean(
    cronSecret && authorization === `Bearer ${cronSecret}`
  );
}

async function runAnalyticsRetention(request: Request) {
  if (!isAuthorizedCronRequest(request)) {
    const session = await requireVerifiedSession(
      "Verifique seu e-mail antes de executar a retenção de analytics."
    );
    if (session instanceof NextResponse) {
      return session;
    }

    const isAdmin = await isAdminUser({
      userId: session.user.id,
      email: session.user.email,
    });

    if (!isAdmin) {
      return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
    }
  }

  const result = await enforceAnalyticsRetention();
  return NextResponse.json({ success: true, ...result });
}

export async function GET(request: Request) {
  return runAnalyticsRetention(request);
}

export async function POST(request: Request) {
  return runAnalyticsRetention(request);
}
