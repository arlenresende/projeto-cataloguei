import { Resend } from "resend";

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

function renderFeatureRequestEmail({
  name,
  title,
  message,
  adminNote,
}: {
  name: string;
  title: string;
  message: string;
  adminNote?: string | null;
}) {
  return `
    <div style="font-family: Arial, sans-serif; color: #111827; line-height: 1.6;">
      <p>Olá, ${name}.</p>
      <p>${message}</p>
      <p><strong>Pedido:</strong> ${title}</p>
      ${
        adminNote
          ? `<p><strong>Observação:</strong> ${adminNote}</p>`
          : ""
      }
      <p>Obrigado por ajudar a melhorar o Cataloguei.</p>
    </div>
  `;
}

export async function sendVerificationEmail({
  email,
  verificationUrl,
}: SendVerificationEmailParams) {
  try {
    await sendEmail({
      to: email,
      subject: "Verifique seu e-mail",
      // TODO: substituir por um template visual definitivo.
      html: `
        <p>Verifique seu e-mail:</p>
        <p>
          <a href="${verificationUrl}">
            Verificar e-mail
          </a>
        </p>
      `,
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
      message:
        "A sugestão que você enviou foi marcada como concluída.",
    }),
  });
}
