"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";

// ── Helpers ──────────────────────────────────────────────

/** Formata número para exibição BRL: 1299.9 → "1.299,90" */
function formatBRL(value: number | null | undefined): string {
  if (value === null || value === undefined || value <= 0) return "";
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/** Parse string formatada → number: "1.299,90" → 1299.90 */
function parseBRL(input: string): number | null {
  const cleaned = input.replace(/\./g, "").replace(",", ".");
  const num = parseFloat(cleaned);
  return isNaN(num) ? null : num;
}

/** Formata número para exibição de peso: 0.85 → "0,850" */
function formatWeight(value: number | null | undefined): string {
  if (value === null || value === undefined || value <= 0) return "";
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  });
}

/** Parse string formatada → number para peso */
function parseWeight(input: string): number | null {
  const cleaned = input.replace(/\./g, "").replace(",", ".");
  const num = parseFloat(cleaned);
  return isNaN(num) ? null : num;
}

/** Máscara de moeda: aplica separadores de milhar e vírgula decimal */
function maskCurrencyInput(raw: string): string {
  // Remove tudo que não é dígito
  let digits = raw.replace(/\D/g, "");
  if (!digits) return "";

  // Remove zeros à esquerda (mas mantém pelo menos 1)
  digits = digits.replace(/^0+/, "") || "0";

  // Garante pelo menos 3 dígitos (para ter centavos)
  while (digits.length < 3) digits = "0" + digits;

  const intPart = digits.slice(0, -2);
  const decPart = digits.slice(-2);

  // Adiciona pontos na parte inteira
  let formatted = "";
  let count = 0;
  for (let i = intPart.length - 1; i >= 0; i--) {
    if (count > 0 && count % 3 === 0) formatted = "." + formatted;
    formatted = intPart[i] + formatted;
    count++;
  }

  return formatted + "," + decPart;
}

/** Máscara de peso: aplica separadores e 3 casas decimais */
function maskWeightInput(raw: string): string {
  let digits = raw.replace(/\D/g, "");
  if (!digits) return "";

  digits = digits.replace(/^0+/, "") || "0";

  while (digits.length < 4) digits = "0" + digits;

  const intPart = digits.slice(0, -3);
  const decPart = digits.slice(-3);

  let formatted = "";
  let count = 0;
  for (let i = intPart.length - 1; i >= 0; i--) {
    if (count > 0 && count % 3 === 0) formatted = "." + formatted;
    formatted = intPart[i] + formatted;
    count++;
  }

  return formatted + "," + decPart;
}

// ── CurrencyInput ────────────────────────────────────────

interface CurrencyInputProps {
  label?: string;
  value?: number | null;
  onChange?: (value: number | null) => void;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
}

export function CurrencyInput({
  label,
  value,
  onChange,
  error,
  placeholder = "0,00",
  disabled,
}: CurrencyInputProps) {
  const [displayValue, setDisplayValue] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const ignoreChange = useRef(false);

  // Sync external value → display (only when not focused)
  useEffect(() => {
    if (!focused && !ignoreChange.current) {
      setDisplayValue(formatBRL(value));
    }
    ignoreChange.current = false;
  }, [value, focused]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      const masked = maskCurrencyInput(raw);
      setDisplayValue(masked);
      ignoreChange.current = true;
      onChange?.(parseBRL(masked));
    },
    [onChange]
  );

  const handleFocus = useCallback(() => {
    setFocused(true);
    // Seleciona tudo para facilitar edição
    setTimeout(() => inputRef.current?.select(), 0);
  }, []);

  const handleBlur = useCallback(() => {
    setFocused(false);
    const parsed = parseBRL(displayValue);
    if (parsed !== null && parsed > 0) {
      ignoreChange.current = true;
      onChange?.(parsed);
      setDisplayValue(formatBRL(parsed));
    } else {
      ignoreChange.current = true;
      onChange?.(null);
      setDisplayValue("");
    }
  }, [displayValue, onChange]);

  return (
    <div className="w-full">
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-[var(--brand-black)]">
          {label}
        </label>
      )}
      <div className="relative">
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
          R$
        </span>
        <input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          value={displayValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            "flex h-10 w-full rounded-lg border border-[var(--brand-border)] bg-white pl-11 pr-3.5 text-sm text-[var(--brand-black)] transition-colors placeholder:text-muted-foreground focus:border-[var(--brand-black)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-black)]/10 disabled:cursor-not-allowed disabled:opacity-50",
            error &&
              "border-[var(--brand-error)] focus:border-[var(--brand-error)] focus:ring-[var(--brand-error)]/10"
          )}
        />
      </div>
      {error && <p className="mt-1.5 text-xs text-[var(--brand-error)]">{error}</p>}
    </div>
  );
}

// ── WeightInput ──────────────────────────────────────────

interface WeightInputProps {
  label?: string;
  value?: number | null;
  onChange?: (value: number | null) => void;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
}

export function WeightInput({
  label,
  value,
  onChange,
  error,
  placeholder = "0,000",
  disabled,
}: WeightInputProps) {
  const [displayValue, setDisplayValue] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const ignoreChange = useRef(false);

  useEffect(() => {
    if (!focused && !ignoreChange.current) {
      setDisplayValue(formatWeight(value));
    }
    ignoreChange.current = false;
  }, [value, focused]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      const masked = maskWeightInput(raw);
      setDisplayValue(masked);
      ignoreChange.current = true;
      onChange?.(parseWeight(masked));
    },
    [onChange]
  );

  const handleFocus = useCallback(() => {
    setFocused(true);
    setTimeout(() => inputRef.current?.select(), 0);
  }, []);

  const handleBlur = useCallback(() => {
    setFocused(false);
    const parsed = parseWeight(displayValue);
    if (parsed !== null && parsed > 0) {
      ignoreChange.current = true;
      onChange?.(parsed);
      setDisplayValue(formatWeight(parsed));
    } else {
      ignoreChange.current = true;
      onChange?.(null);
      setDisplayValue("");
    }
  }, [displayValue, onChange]);

  return (
    <div className="w-full">
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-[var(--brand-black)]">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          value={displayValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            "flex h-10 w-full rounded-lg border border-[var(--brand-border)] bg-white px-3.5 pr-10 text-sm text-[var(--brand-black)] transition-colors placeholder:text-muted-foreground focus:border-[var(--brand-black)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-black)]/10 disabled:cursor-not-allowed disabled:opacity-50",
            error &&
              "border-[var(--brand-error)] focus:border-[var(--brand-error)] focus:ring-[var(--brand-error)]/10"
          )}
        />
        <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
          kg
        </span>
      </div>
      {error && <p className="mt-1.5 text-xs text-[var(--brand-error)]">{error}</p>}
    </div>
  );
}
