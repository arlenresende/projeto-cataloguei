"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { trackGoogleEvent } from "@/lib/analytics/google";
import { maskPhone, onlyNumbers } from "@/lib/masks";

type LeadFormProps = {
  searchParams: Record<string, string | string[] | undefined>;
};

function getSearchParam(
  searchParams: Record<string, string | string[] | undefined>,
  key: string
) {
  const value = searchParams[key];
  return Array.isArray(value) ? value[0] : value;
}

export function LeadForm({ searchParams }: LeadFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [currentSalesChannel, setCurrentSalesChannel] = useState("");
  const [monthlyOrders, setMonthlyOrders] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const utmData = useMemo(
    () => ({
      source: "catalogo-online",
      utmSource: getSearchParam(searchParams, "utm_source"),
      utmMedium: getSearchParam(searchParams, "utm_medium"),
      utmCampaign: getSearchParam(searchParams, "utm_campaign"),
      utmTerm: getSearchParam(searchParams, "utm_term"),
      utmContent: getSearchParam(searchParams, "utm_content"),
    }),
    [searchParams]
  );

  useEffect(() => {
    trackGoogleEvent("landing_view", {
      page: "catalogo_online",
      utm_source: utmData.utmSource,
      utm_medium: utmData.utmMedium,
      utm_campaign: utmData.utmCampaign,
    });
  }, [utmData]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    trackGoogleEvent("landing_lead_submit_start", {
      page: "catalogo_online",
      has_email: Boolean(email),
      has_business_type: Boolean(businessType),
      has_sales_channel: Boolean(currentSalesChannel),
      utm_source: utmData.utmSource,
      utm_medium: utmData.utmMedium,
      utm_campaign: utmData.utmCampaign,
    });

    try {
      const response = await fetch("/api/landing-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          whatsapp: onlyNumbers(whatsapp),
          businessType,
          currentSalesChannel,
          monthlyOrders,
          message,
          ...utmData,
        }),
      });
      const payload = await response.json();

      if (!response.ok) {
        setError(payload.error || "Não foi possível enviar seu contato.");
        trackGoogleEvent("landing_lead_submit_error", {
          page: "catalogo_online",
          reason: payload.error || "api_error",
        });
        return;
      }

      setSubmitted(true);
      trackGoogleEvent("landing_lead_submit_success", {
        page: "catalogo_online",
        lead_id: payload.leadId,
        utm_source: utmData.utmSource,
        utm_medium: utmData.utmMedium,
        utm_campaign: utmData.utmCampaign,
      });
    } catch {
      setError("Erro de conexão. Tente novamente em alguns instantes.");
      trackGoogleEvent("landing_lead_submit_error", {
        page: "catalogo_online",
        reason: "network_error",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-5 text-emerald-800">
        <CheckCircle2 className="size-6" />
        <h2 className="mt-3 text-lg font-bold text-emerald-950">
          Recebemos seu contato
        </h2>
        <p className="mt-2 text-sm leading-6">
          Vamos olhar seu tipo de negócio e te chamar para mostrar como o
          Cataloguei pode virar seu catálogo de vendas.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Nome"
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="Seu nome"
        required
      />
      <Input
        label="WhatsApp"
        value={whatsapp}
        onChange={(event) => setWhatsapp(maskPhone(event.target.value))}
        placeholder="(31) 99999-9999"
        required
      />
      <Input
        label="E-mail"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="voce@email.com"
        type="email"
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Tipo de negócio"
          value={businessType}
          onChange={(event) => setBusinessType(event.target.value)}
          placeholder="Moda, comida, beleza..."
        />
        <Input
          label="Pedidos por mês"
          value={monthlyOrders}
          onChange={(event) => setMonthlyOrders(event.target.value)}
          placeholder="Ex: 30 a 50"
        />
      </div>
      <Input
        label="Onde vende hoje?"
        value={currentSalesChannel}
        onChange={(event) => setCurrentSalesChannel(event.target.value)}
        placeholder="Instagram, WhatsApp, loja física..."
      />
      <Textarea
        label="O que você quer melhorar?"
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        placeholder="Ex: quero organizar meus produtos e vender mais pelo WhatsApp"
        rows={3}
      />

      {error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-600">
          {error}
        </p>
      ) : null}

      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <ArrowRight className="size-4" />
        )}
        Quero meu catálogo online
      </Button>
    </form>
  );
}
