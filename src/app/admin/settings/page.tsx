import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { ProfileForm } from "./components/profile-form";
import { ChangePasswordForm } from "./components/change-password-form";
import { DeleteAccountSection } from "./components/delete-account-section";

export default async function SettingsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  // Check if user has a local password account
  const localAccount = await prisma.account.findFirst({
    where: {
      userId: session.user.id,
      issuer: "local:credential",
    },
    select: { id: true },
  });

  const hasLocalPassword = !!localAccount;

  return (
    <div>
      <PageHeader
        title="Configurações"
        subtitle="Gerencie sua conta"
      />

      <div className="space-y-6">
        {/* Profile */}
        <Card>
          <h2 className="text-base font-bold text-[var(--brand-black)]">
            Dados pessoais
          </h2>
          <p className="mt-1 text-sm text-[var(--brand-black)]/50">
            Atualize suas informações pessoais.
          </p>
          <div className="mt-5">
            <ProfileForm
              currentName={session.user.name}
              email={session.user.email}
            />
          </div>
        </Card>

        {/* Password — only for local accounts */}
        {hasLocalPassword && (
          <Card>
            <h2 className="text-base font-bold text-[var(--brand-black)]">
              Segurança
            </h2>
            <p className="mt-1 text-sm text-[var(--brand-black)]/50">
              Altere sua senha de acesso.
            </p>
            <div className="mt-5">
              <ChangePasswordForm />
            </div>
          </Card>
        )}

        {/* Delete account */}
        <DeleteAccountSection />
      </div>
    </div>
  );
}
