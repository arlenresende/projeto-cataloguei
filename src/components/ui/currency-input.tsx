"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";

// ── Helpers ──────────────────────────────────────────────

/** Remove tudo que não é dígito */
function onlyDigits(s: string) {
  return s.replace(/\D/g, "");
}

/** Formata string de dígitos puros para BRL: 1234567 → "1.234.567" */
function formatDigitsToBRL(digits: string): string {
  if (!digits) return "";
  // adiciona pontos a cada 3 dígitos da direita para esquerda
  let result = "";
  let count = 0;
  for (let i = digits.length - 1; i >= 0; i--) {
    if (count > 0 && count % 3 === 0) result = "." + result;
    result = digits[i] + result;
    count++;
  }
  return result;
}

/** Formata número para exibição: 1299.90 → "1.299,90" */
function formatBRL(value: number | null | undefined): string {
  if (value === null || value === undefined || value === 0) return "";
  const fixed = value.toFixed(2); // "1299.90"
  const [intPart, decPart] = fixed.split(".");
  return formatDigitsToBRL(intPart) + "," + decPart;
}

/** Parse display string → number: "1.299,90" → 1299.90 */
function parseBRL(input: string): number | null {
  const digits = onlyDigits(input);
  if (!digits) return null;
  // os últimos 2 dígitos são centavos
  const intPart = digits.slice(0, -2) || "0";
  const decPart = digits.slice(-2);
  return parseFloat(intPart + "." + decPart);
}

/** Formata string de dígitos puros como moeda durante a digitação: "129990" → "1.299,90" */
function maskCurrency(digits: string): string {
  if (!digits) return "";
  // garante pelo menos 3 dígitos (0 + centavos)
  while (digits.length < 3) digits = "0" + digits;
  const intPart = digits.slice(0, -2);
  const decPart = digits.slice(-2);
  return formatDigitsToBRL(intPart) + "," + decPart;
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
  const skipNextSync = useRef(false);

  // Sync external value → display (only when not focused)
  useEffect(() => {
    if (skipNextSync.current) {
      skipNextSync.current = false;
      return;
    }
    if (!focused) {
      setDisplayValue(formatBRL(value));
    }
  }, [value, focused]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      const digits = onlyDigits(raw);

      if (!digits) {
        setDisplayValue("");
        skipNextSync.current = true;
        onChange?.(null);
        return;
      }

      const masked = maskCurrency(digits);
      setDisplayValue(masked);
      skipNextSync.current = true;
      onChange?.(parseBRL(masked));
    },
    [onChange]
  );

  const handleFocus = useCallback(() => {
    setFocused(true);
    // Ao focar, mostra só dígitos + vírgula para facilitar edição
    if (value && value > 0) {
      const digits = onlyDigits(value.toFixed(2));
      setDisplayValue(maskCurrency(digits));
    }
    // seleciona tudo
    setTimeout(() => inputRef.current?.select(), 0);
  }, [value]);

  const handleBlur = useCallback(() => {
    setFocused(false);
    const parsed = parseBRL(displayValue);
    if (parsed !== null && parsed > 0) {
      skipNextSync.current = true;
      onChange?.(parsed);
      setDisplayValue(formatBRL(parsed));
    } else {
      skipNextSync.current = true;
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

/** Formata número para exibição: 0.85 → "0,850" */
function formatWeight(value: number | null | undefined): string {
  if (value === null || value === undefined || value === 0) return "";
  const fixed = value.toFixed(3); // "0.850"
  const [intPart, decPart] = fixed.split(".");
  return formatDigitsToBRL(intPart) + "," + decPart;
}

/** Formata string de dígitos puros como peso durante a digitação: "850" → "0,850" */
function maskWeight(digits: string): string {
  if (!digits) return "";
  while (digits.length < 4) digits = "0" + digits;
  const intPart = digits.slice(0, -3);
  const decPart = digits.slice(-3);
  return formatDigitsToBRL(intPart) + "," + decPart;
}

function parseWeight(input: string): number | null {
  const digits = onlyDigits(input);
  if (!digits) return null;
  const intPart = digits.slice(0, -3) || "0";
  const decPart = digits.slice(-3);
  return parseFloat(intPart + "." + decPart);
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
  const skipNextSync = useRef(false);

  useEffect(() => {
    if (skipNextSync.current) {
      skipNextSync.current = false;
      return;
    }
    if (!focused) {
      setDisplayValue(formatWeight(value));
    }
  }, [value, focused]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      const digits = onlyDigits(raw);

      if (!digits) {
        setDisplayValue("");
        skipNextSync.current = true;
        onChange?.(null);
        return;
      }

      const masked = maskWeight(digits);
      setDisplayValue(masked);
      skipNextSync.current = true;
      onChange?.(parseWeight(masked));
    },
    [onChange]
  );

  const handleFocus = useCallback(() => {
    setFocused(true);
    if (value && value > 0) {
      const digits = onlyDigits(value.toFixed(3));
      setDisplayValue(maskWeight(digits));
    }
    setTimeout(() => inputRef.current?.select(), 0);
  }, [value]);

  const handleBlur = useCallback(() => {
    setFocused(false);
    const parsed = parseWeight(displayValue);
    if (parsed !== null && parsed > 0) {
      skipNextSync.current = true;
      onChange?.(parsed);
      setDisplayValue(formatWeight(parsed));
    } else {
      skipNextSync.current = true;
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
