"use client";

import { useState } from "react";
import { CheckCircle2, Lightbulb, Loader2, Send, Wrench } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Textarea, Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";

type FeatureRequestStatus = "OPEN" | "IN_PROGRESS" | "DONE";

type RequestItem = {
  id: string;
  title: string;
  description: string;
  status: FeatureRequestStatus;
  adminNote: string | null;
  createdAt: string;
  updatedAt: string;
  userName: string;
  userEmail: string;
};

type RequestsContentProps = {
  isAdmin: boolean;
  initialRequests: RequestItem[];
  billing: {
    isPremium: boolean;
    effectivePlan: "FREE" | "PREMIUM";
  };
};

const STATUS_LABELS: Record<FeatureRequestStatus, string> = {
  OPEN: "Recebida",
  IN_PROGRESS: "Fazendo",
  DONE: "Feita",
};

const STATUS_ICONS = {
  OPEN: Lightbulb,
  IN_PROGRESS: Wrench,
  DONE: CheckCircle2,
};

export function RequestsContent({
  isAdmin,
  initialRequests,
  billing,
}: RequestsContentProps) {
  const [requests, setRequests] = useState(initialRequests);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [adminNotes, setAdminNotes] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function refreshRequests() {
    const response = await fetch("/api/feature-requests");
    const result = await response.json();

    if (response.ok) {
      setRequests(result.requests);
    }
  }

  async function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading("create");

    try {
      const response = await fetch("/api/feature-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      });
      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Não foi possível enviar sua solicitação.");
        return;
      }

      setTitle("");
      setDescription("");
      setSuccess("Solicitação enviada. Também mandamos um e-mail de confirmação.");
      await refreshRequests();
    } catch {
      setError("Erro de conexão ao enviar sua solicitação.");
    } finally {
      setLoading(null);
    }
  }

  async function handleStatusChange(
    id: string,
    status: FeatureRequestStatus
  ) {
    setError(null);
    setSuccess(null);
    setLoading(`${id}:${status}`);

    try {
      const response = await fetch(`/api/feature-requests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          adminNote: adminNotes[id] || null,
        }),
      });
      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Não foi possível atualizar a solicitação.");
        return;
      }

      setSuccess("Status atualizado e e-mail enviado ao cliente.");
      await refreshRequests();
    } catch {
      setError("Erro de conexão ao atualizar a solicitação.");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pedidos Premium"
        subtitle="Ideias e necessidades enviadas por clientes Premium"
      />

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
          {error}
        </div>
      ) : null}

      {success ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          {success}
        </div>
      ) : null}

      <Card>
        <CardHeader
          action={
            <Badge variant={billing.isPremium ? "default" : "neutral"}>
              {billing.effectivePlan}
            </Badge>
          }
        >
          Sentiu falta de alguma coisa?
        </CardHeader>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          Conte para a gente o que você precisa e vamos avaliar juntos a melhor
          forma de transformar essa ideia em uma nova possibilidade para o seu negócio.
        </p>

        {billing.isPremium ? (
          <form onSubmit={handleCreate} className="mt-5 grid gap-4">
            <Input
              label="Título"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              maxLength={120}
              placeholder="Ex: integração com catálogo do Instagram"
              required
            />
            <Textarea
              label="Descrição"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              maxLength={2000}
              rows={5}
              placeholder="Explique o que você quer fazer e por que isso ajudaria sua loja."
              required
            />
            <Button
              type="submit"
              disabled={loading === "create"}
              className="w-fit"
            >
              {loading === "create" ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Send className="size-4" />
              )}
              Enviar pedido
            </Button>
          </form>
        ) : (
          <div className="mt-5 rounded-xl bg-[var(--brand-tertiary)] px-4 py-3 text-sm text-muted-foreground">
            Esse canal de pedidos personalizados é exclusivo para clientes Premium.
          </div>
        )}
      </Card>

      <section className="grid gap-4">
        {requests.map((request) => {
          const Icon = STATUS_ICONS[request.status];

          return (
            <Card key={request.id}>
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={request.status === "DONE" ? "default" : "neutral"}>
                      <Icon className="size-3" />
                      {STATUS_LABELS[request.status]}
                    </Badge>
                    {isAdmin ? (
                      <span className="text-xs text-muted-foreground">
                        {request.userName} · {request.userEmail}
                      </span>
                    ) : null}
                  </div>
                  <h2 className="mt-3 text-lg font-bold text-[var(--brand-black)]">
                    {request.title}
                  </h2>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                    {request.description}
                  </p>
                  {request.adminNote ? (
                    <p className="mt-3 rounded-lg bg-[var(--brand-tertiary)] px-3 py-2 text-sm text-muted-foreground">
                      {request.adminNote}
                    </p>
                  ) : null}
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(request.createdAt).toLocaleDateString("pt-BR")}
                </span>
              </div>

              {isAdmin ? (
                <div className="mt-5 grid gap-3 border-t border-[var(--brand-border)] pt-4">
                  <Textarea
                    label="Observação para o cliente"
                    value={adminNotes[request.id] ?? request.adminNote ?? ""}
                    onChange={(event) =>
                      setAdminNotes((current) => ({
                        ...current,
                        [request.id]: event.target.value,
                      }))
                    }
                    rows={3}
                    placeholder="Opcional. Essa mensagem vai no e-mail de atualização."
                  />
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      disabled={loading !== null}
                      onClick={() => handleStatusChange(request.id, "OPEN")}
                    >
                      Recebida
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      disabled={loading !== null}
                      onClick={() => handleStatusChange(request.id, "IN_PROGRESS")}
                    >
                      Fazendo
                    </Button>
                    <Button
                      type="button"
                      disabled={loading !== null}
                      onClick={() => handleStatusChange(request.id, "DONE")}
                    >
                      Feita
                    </Button>
                  </div>
                </div>
              ) : null}
            </Card>
          );
        })}

        {requests.length === 0 ? (
          <Card>
            <p className="text-sm text-muted-foreground">
              Nenhum pedido enviado ainda.
            </p>
          </Card>
        ) : null}
      </section>
    </div>
  );
}
