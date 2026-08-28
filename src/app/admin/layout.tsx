import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { OnboardingGate } from "@/components/onboarding/OnboardingGate";
import { auth } from "@/lib/auth";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  if (!session.user.emailVerified) {
    const params = new URLSearchParams({
      source: "signin",
    });

    if (session.user.email) {
      params.set("email", session.user.email);
    }

    redirect(`/verify-email?${params.toString()}`);
  }

  return (
    <AdminShell>
      <OnboardingGate />
      {children}
    </AdminShell>
  );
}
