import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AuditAction, type Prisma } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { auth } from "@/lib/auth";
import { isAdminUser } from "@/lib/feature-requests";
import { prisma } from "@/lib/prisma";

type AdminAuditLogsPageProps = {
  searchParams: Promise<{
    action?: string;
    q?: string;
  }>;
};

const actionLabels: Record<AuditAction, string> = {
  USER_CREATED: "Usuário criado",
  STORE_CREATED: "Loja criada",
  STORE_UPDATED: "Loja atualizada",
  STORE_DELETED: "Loja excluída",
  STORE_SUSPENDED: "Loja suspensa",
  STORE_RESTORED: "Loja reativada",
  SUBSCRIPTION_STARTED: "Assinatura iniciada",
  SUBSCRIPTION_CANCELED: "Assinatura cancelada",
  STRIPE_WEBHOOK_PROCESSED: "Webhook Stripe",
  FEATURE_REQUEST_CREATED: "Pedido Premium criado",
  FEATURE_REQUEST_UPDATED: "Pedido Premium atualizado",
};

function isAuditAction(value: string | undefined): value is AuditAction {
  return Boolean(value && Object.values(AuditAction).includes(value as AuditAction));
}

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(value);
}

function stringifyMetadata(metadata: Prisma.JsonValue | null) {
  if (!metadata) {
    return null;
  }

  return JSON.stringify(metadata, null, 2);
}

export default async function AdminAuditLogsPage({
  searchParams,
}: AdminAuditLogsPageProps) {
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

  const params = await searchParams;
  const action = isAuditAction(params.action) ? params.action : undefined;
  const query = params.q?.trim() || "";

  const logs = await prisma.auditLog.findMany({
    where: {
      ...(action ? { action } : {}),
      ...(query
        ? {
            OR: [
              { actorEmail: { contains: query, mode: "insensitive" } },
              { actorUserId: { contains: query, mode: "insensitive" } },
              { targetId: { contains: query, mode: "insensitive" } },
              { storeId: { contains: query, mode: "insensitive" } },
              { targetType: { contains: query, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  const filterHref = (nextAction?: AuditAction) => {
    const nextParams = new URLSearchParams();
    if (nextAction) {
      nextParams.set("action", nextAction);
    }
    if (query) {
      nextParams.set("q", query);
    }

    const qs = nextParams.toString();
    return `/admin/platform/logs${qs ? `?${qs}` : ""}`;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Logs de auditoria"
        subtitle="Acompanhe ações críticas realizadas na plataforma."
      />

      <Card>
        <CardHeader action={<Badge variant="neutral">{logs.length} eventos</Badge>}>
          Filtros
        </CardHeader>
        <form className="mt-4 flex flex-col gap-3 md:flex-row" action="/admin/platform/logs">
          {action ? <input type="hidden" name="action" value={action} /> : null}
          <input
            name="q"
            defaultValue={query}
            placeholder="Buscar por e-mail, usuário, loja, alvo..."
            className="h-10 flex-1 rounded-lg border border-[var(--brand-border)] bg-white px-3 text-sm outline-none transition-colors focus:border-[var(--brand-black)]"
          />
          <button
            type="submit"
            className="rounded-lg bg-[var(--brand-black)] px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-[var(--brand-black)]/90"
          >
            Buscar
          </button>
          {(query || action) ? (
            <Link
              href="/admin/platform/logs"
              className="rounded-lg border border-[var(--brand-border)] px-4 py-2 text-sm font-bold text-[var(--brand-black)] transition-colors hover:bg-[var(--brand-tertiary)]"
            >
              Limpar
            </Link>
          ) : null}
        </form>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href={filterHref()}
            className={`rounded-full px-3 py-1.5 text-xs font-bold ${
              !action
                ? "bg-[var(--brand-black)] text-white"
                : "bg-[var(--brand-tertiary)] text-[var(--brand-black)]"
            }`}
          >
            Todas
          </Link>
          {Object.values(AuditAction).map((item) => (
            <Link
              key={item}
              href={filterHref(item)}
              className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                action === item
                  ? "bg-[var(--brand-black)] text-white"
                  : "bg-[var(--brand-tertiary)] text-[var(--brand-black)]"
              }`}
            >
              {actionLabels[item]}
            </Link>
          ))}
        </div>
      </Card>

      <Card>
        <CardHeader>Últimos eventos</CardHeader>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[1100px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-[var(--brand-border)] text-left">
                <th className="pb-3 font-semibold text-[var(--brand-black)]">Data</th>
                <th className="pb-3 font-semibold text-[var(--brand-black)]">Ação</th>
                <th className="pb-3 font-semibold text-[var(--brand-black)]">Ator</th>
                <th className="pb-3 font-semibold text-[var(--brand-black)]">Alvo</th>
                <th className="pb-3 font-semibold text-[var(--brand-black)]">IP</th>
                <th className="pb-3 font-semibold text-[var(--brand-black)]">Detalhes</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => {
                const metadata = stringifyMetadata(log.metadata);

                return (
                  <tr
                    key={log.id}
                    className="border-b border-[var(--brand-border)] align-top last:border-b-0"
                  >
                    <td className="py-3 text-muted-foreground">
                      {formatDate(log.createdAt)}
                    </td>
                    <td className="py-3">
                      <Badge variant="neutral">{actionLabels[log.action]}</Badge>
                      <p className="mt-1 text-xs text-muted-foreground">{log.action}</p>
                    </td>
                    <td className="py-3">
                      <p className="font-semibold text-[var(--brand-black)]">
                        {log.actorEmail || "Sistema"}
                      </p>
                      {log.actorUserId ? (
                        <p className="text-xs text-muted-foreground">{log.actorUserId}</p>
                      ) : null}
                    </td>
                    <td className="py-3">
                      <p className="font-semibold text-[var(--brand-black)]">
                        {log.targetType}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {log.targetId || "Sem alvo"}
                      </p>
                      {log.storeId ? (
                        <p className="mt-1 text-xs text-muted-foreground">
                          Loja: {log.storeId}
                        </p>
                      ) : null}
                    </td>
                    <td className="py-3 text-muted-foreground">
                      {log.ipAddress || "-"}
                    </td>
                    <td className="py-3">
                      {metadata ? (
                        <pre className="max-h-36 max-w-md overflow-auto rounded-lg bg-[var(--brand-tertiary)] p-3 text-xs leading-5 text-[var(--brand-black)]">
                          {metadata}
                        </pre>
                      ) : (
                        <span className="text-muted-foreground">Sem detalhes</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {logs.length === 0 ? (
            <div className="py-10 text-center text-sm text-muted-foreground">
              Nenhum log encontrado para os filtros selecionados.
            </div>
          ) : null}
        </div>
      </Card>
    </div>
  );
}
