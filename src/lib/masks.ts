/** Remove tudo que não é dígito */
export function onlyNumbers(value: string): string {
  return value.replace(/\D/g, "");
}

/** Máscara de CEP: 30123456 → 30123-456 */
export function maskCEP(value: string): string {
  const d = onlyNumbers(value).slice(0, 8);
  if (d.length <= 5) return d;
  return d.slice(0, 5) + "-" + d.slice(5);
}

/** Máscara de telefone BR: 31999998888 → (31) 99999-8888 */
export function maskPhone(value: string): string {
  const d = onlyNumbers(value).slice(0, 11);
  if (d.length === 0) return "";
  if (d.length <= 2) return "(" + d;
  if (d.length <= 7) return "(" + d.slice(0, 2) + ") " + d.slice(2);
  return "(" + d.slice(0, 2) + ") " + d.slice(2, 7) + "-" + d.slice(7);
}

/** Formata CEP do banco para exibição: 30123456 → 30123-456 */
export function formatCEPDisplay(value: string | null | undefined): string {
  if (!value) return "";
  return maskCEP(onlyNumbers(value));
}

/** Formata telefone do banco para exibição: 31999998888 → (31) 99999-8888 */
export function formatPhoneDisplay(value: string | null | undefined): string {
  if (!value) return "";
  return maskPhone(onlyNumbers(value));
}

/** Gera link do WhatsApp a partir do número: 31999998888 → https://wa.me/5531999998888 */
export function buildWhatsAppUrl(number: string): string {
  const digits = onlyNumbers(number);
  if (!digits) return "";
  // Se já começa com 55, usa direto; senão, adiciona código do país
  const fullNumber = digits.startsWith("55") ? digits : "55" + digits;
  return `https://wa.me/${fullNumber}`;
}
