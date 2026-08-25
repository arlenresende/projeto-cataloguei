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

function getResendConfig() {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !from) {
    throw new Error("Configuracao de e-mail ausente.");
  }

  return { apiKey, from };
}

async function sendEmail({ to, subject, html }: SendEmailParams) {
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
