import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { auth } from "@/lib/auth";
import { isAdminUser } from "@/lib/feature-requests";
import { prisma } from "@/lib/prisma";
import { getSiteHost } from "@/lib/site-config";

export default async function AdminUsersPage() {
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

  const siteHost = getSiteHost();
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      emailVerified: true,
      role: true,
      createdAt: true,
      store: {
        select: {
          name: true,
          slug: true,
          isActive: true,
          adminSuspendedAt: true,
        },
      },
      subscription: {
        select: {
          plan: true,
          status: true,
        },
      },
    },
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Usuários cadastrados"
        subtitle="Veja contas, papel, plano e loja vinculada."
      />

      <Card>
        <CardHeader
          action={<Badge variant="neutral">{users.length} usuários</Badge>}
        >
          Todos os usuários
        </CardHeader>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[980px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-[var(--brand-border)] text-left">
                <th className="pb-3 font-semibold text-[var(--brand-black)]">Usuário</th>
                <th className="pb-3 font-semibold text-[var(--brand-black)]">Papel</th>
                <th className="pb-3 font-semibold text-[var(--brand-black)]">Plano</th>
                <th className="pb-3 font-semibold text-[var(--brand-black)]">Loja</th>
                <th className="pb-3 font-semibold text-[var(--brand-black)]">Status da loja</th>
                <th className="pb-3 font-semibold text-[var(--brand-black)]">Criado em</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const storeStatus = user.store?.adminSuspendedAt
                  ? { label: "Suspensa", variant: "error" as const }
                  : user.store?.isActive
                    ? { label: "Ativa", variant: "success" as const }
                    : user.store
                      ? { label: "Inativa", variant: "neutral" as const }
                      : { label: "Sem loja", variant: "neutral" as const };

                return (
                  <tr
                    key={user.id}
                    className="border-b border-[var(--brand-border)] last:border-b-0"
                  >
                    <td className="py-3">
                      <p className="font-semibold text-[var(--brand-black)]">
                        {user.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {user.email}
                      </p>
                      {!user.emailVerified ? (
                        <p className="mt-1 text-xs font-medium text-amber-700">
                          E-mail não verificado
                        </p>
                      ) : null}
                    </td>
                    <td className="py-3">
                      <Badge variant={user.role === "ADMIN" ? "dark" : "neutral"}>
                        {user.role}
                      </Badge>
                    </td>
                    <td className="py-3">
                      <Badge
                        variant={user.subscription?.plan === "PREMIUM" ? "default" : "neutral"}
                      >
                        {user.subscription?.plan ?? "FREE"}
                      </Badge>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {user.subscription?.status ?? "INACTIVE"}
                      </p>
                    </td>
                    <td className="py-3">
                      {user.store ? (
                        <>
                          <p className="font-semibold text-[var(--brand-black)]">
                            {user.store.name}
                          </p>
                          <Link
                            href={`/${user.store.slug}`}
                            target="_blank"
                            className="text-xs text-muted-foreground hover:underline"
                          >
                            {siteHost}/{user.store.slug}
                          </Link>
                        </>
                      ) : (
                        <span className="text-muted-foreground">Nenhuma loja</span>
                      )}
                    </td>
                    <td className="py-3">
                      <Badge variant={storeStatus.variant}>
                        {storeStatus.label}
                      </Badge>
                    </td>
                    <td className="py-3 text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString("pt-BR")}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
