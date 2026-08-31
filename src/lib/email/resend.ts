import { readFileSync } from "node:fs";
import path from "node:path";
import { Resend } from "resend";
import { absoluteUrl } from "@/lib/site-config";

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

interface SendVerificationEmailParams {
  email: string;
  verificationUrl: string;
}

interface FeatureRequestEmailParams {
  email: string;
  name: string;
  title: string;
  adminNote?: string | null;
}

interface TemplateEmailParams {
  title: string;
  preheader: string;
  heading: string;
  name: string;
  message: string;
  actionLabel: string;
  actionUrl: string;
  note: string;
  fallbackLabel?: string;
}

const EMAIL_TEMPLATE_PATH = path.join(
  process.cwd(),
  "email-templates",
  "ativacao-conta.html"
);

let cachedTemplate: string | null = null;

function getResendConfig() {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !from) {
    throw new Error("Configuracao de e-mail ausente.");
  }

  return { apiKey, from };
}

export async function sendEmail({ to, subject, html }: SendEmailParams) {
  const { apiKey, from } = getResendConfig();
  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send({
    from,
    to,
    subject,
    html,
  });

  if (error) {
    throw error;
  }
}

function getEmailTemplate() {
  if (!cachedTemplate) {
    cachedTemplate = readFileSync(EMAIL_TEMPLATE_PATH, "utf8");
  }

  return cachedTemplate;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function paragraph(value: string) {
  return escapeHtml(value).replace(/\n/g, "<br>");
}

function renderTemplateEmail({
  title,
  preheader,
  heading,
  name,
  message,
  actionLabel,
  actionUrl,
  note,
  fallbackLabel = "Se o botão não funcionar, copie e cole o link abaixo no seu navegador:",
}: TemplateEmailParams) {
  const replacements: Record<string, string> = {
    email_title: escapeHtml(title),
    preheader: escapeHtml(preheader),
    logo_url: absoluteUrl("/cataloguei-logo.svg"),
    heading: escapeHtml(heading),
    name: escapeHtml(name),
    message,
    action_label: escapeHtml(actionLabel),
    action_url: escapeHtml(actionUrl),
    note,
    fallback_label: escapeHtml(fallbackLabel),
  };

  return getEmailTemplate().replace(
    /{{(\w+)}}/g,
    (_, key: string) => replacements[key] ?? ""
  );
}

function renderFeatureRequestEmail({
  name,
  title,
  message,
  actionLabel,
  adminNote,
}: {
  name: string;
  title: string;
  message: string;
  actionLabel: string;
  adminNote?: string | null;
}) {
  const adminNoteHtml = adminNote
    ? `<br><br><strong style="color: #09090b;">Observação:</strong> ${paragraph(adminNote)}`
    : "";

  return renderTemplateEmail({
    title: "Atualização do seu pedido",
    preheader: `${message} Pedido: ${title}`,
    heading: "Atualização do pedido",
    name,
    message: `${paragraph(message)}<br><br><strong style="color: #09090b;">Pedido:</strong> ${paragraph(title)}${adminNoteHtml}<br><br>Obrigado por ajudar a melhorar o Cataloguei.`,
    actionLabel,
    actionUrl: absoluteUrl("/admin/requests"),
    note: "Este e-mail foi enviado porque houve uma atualização no pedido que você enviou pelo painel Premium.",
    fallbackLabel:
      "Você também pode acompanhar seus pedidos pelo painel do Cataloguei:",
  });
}

export async function sendVerificationEmail({
  email,
  verificationUrl,
}: SendVerificationEmailParams) {
  try {
    await sendEmail({
      to: email,
      subject: "Ative sua conta no Cataloguei",
      html: renderTemplateEmail({
        title: "Ative sua conta",
        preheader:
          "Ative sua conta no Cataloguei e comece a criar seu catálogo online.",
        heading: "Ative sua conta",
        name: "tudo bem?",
        message:
          'Obrigado por se cadastrar no <strong style="color: #09090b;">Cataloguei</strong>! Para começar a criar seu catálogo online, precisamos confirmar seu endereço de e-mail.',
        actionLabel: "Ativar minha conta",
        actionUrl: verificationUrl,
        note: "Este link expira em <strong>24 horas</strong>. Se você não criou uma conta no Cataloguei, pode ignorar este e-mail.",
      }),
    });
  } catch (error) {
    console.error("[email] Falha ao enviar e-mail de verificacao", {
      email,
      error,
    });

    throw new Error("Nao foi possivel enviar o e-mail de verificacao.");
  }
}

export async function sendFeatureRequestCreatedEmail({
  email,
  name,
  title,
}: FeatureRequestEmailParams) {
  await sendEmail({
    to: email,
    subject: "Recebemos sua sugestão para o Cataloguei",
    html: renderFeatureRequestEmail({
      name,
      title,
      actionLabel: "Ver meus pedidos",
      message:
        "Recebemos sua ideia e ela já está na nossa lista para avaliação.",
    }),
  });
}

export async function sendFeatureRequestInProgressEmail({
  email,
  name,
  title,
  adminNote,
}: FeatureRequestEmailParams) {
  await sendEmail({
    to: email,
    subject: "Sua sugestão entrou em desenvolvimento",
    html: renderFeatureRequestEmail({
      name,
      title,
      adminNote,
      actionLabel: "Acompanhar pedido",
      message:
        "Boa notícia: começamos a trabalhar na sua sugestão.",
    }),
  });
}

export async function sendFeatureRequestDoneEmail({
  email,
  name,
  title,
  adminNote,
}: FeatureRequestEmailParams) {
  await sendEmail({
    to: email,
    subject: "Sua sugestão foi concluída",
    html: renderFeatureRequestEmail({
      name,
      title,
      adminNote,
      actionLabel: "Ver pedido concluído",
      message:
        "A sugestão que você enviou foi marcada como concluída.",
    }),
  });
}
