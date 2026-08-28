"use client";

import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

interface CurrencyInputProps {
  label?: string;
  value?: number | null;
  onChange?: (value: number | null) => void;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
}

function formatBRL(value: number | null | undefined): string {
  if (value === null || value === undefined || value === 0) return "";
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function parseBRL(input: string): number | null {
  const cleaned = input.replace(/[^\d,]/g, "").replace(",", ".");
  const num = parseFloat(cleaned);
  return isNaN(num) ? null : num;
}

export function CurrencyInput({
  label,
  value,
  onChange,
  error,
  placeholder = "0,00",
  disabled,
}: CurrencyInputProps) {
  const [displayValue, setDisplayValue] = useState(formatBRL(value));
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (!focused) {
      setDisplayValue(formatBRL(value));
    }
  }, [value, focused]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let raw = e.target.value;

      // Allow only digits, comma, dot
      raw = raw.replace(/[^\d,.]/g, "");

      // Normalize: keep only last comma
      const parts = raw.split(",");
      if (parts.length > 2) {
        raw = parts[0] + "," + parts.slice(1).join("");
      }

      // Limit decimals to 2
      if (parts.length === 2 && parts[1].length > 2) {
        raw = parts[0] + "," + parts[1].slice(0, 2);
      }

      setDisplayValue(raw);
      const parsed = parseBRL(raw);
      onChange?.(parsed);
    },
    [onChange]
  );

  const handleFocus = useCallback(() => {
    setFocused(true);
    // Show raw number for editing
    if (value) {
      setDisplayValue(value.toFixed(2).replace(".", ","));
    }
  }, [value]);

  const handleBlur = useCallback(() => {
    setFocused(false);
    // Format back to BRL
    const parsed = parseBRL(displayValue);
    if (parsed !== null) {
      onChange?.(parsed);
      setDisplayValue(formatBRL(parsed));
    } else {
      setDisplayValue("");
      onChange?.(null);
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
          type="text"
          inputMode="decimal"
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

interface WeightInputProps {
  label?: string;
  value?: number | null;
  onChange?: (value: number | null) => void;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
}

function formatWeight(value: number | null | undefined): string {
  if (value === null || value === undefined || value === 0) return "";
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  });
}

function parseWeight(input: string): number | null {
  const cleaned = input.replace(/[^\d,]/g, "").replace(",", ".");
  const num = parseFloat(cleaned);
  return isNaN(num) ? null : num;
}

export function WeightInput({
  label,
  value,
  onChange,
  error,
  placeholder = "0,000",
  disabled,
}: WeightInputProps) {
  const [displayValue, setDisplayValue] = useState(formatWeight(value));
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (!focused) {
      setDisplayValue(formatWeight(value));
    }
  }, [value, focused]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let raw = e.target.value;
      raw = raw.replace(/[^\d,.]/g, "");
      const parts = raw.split(",");
      if (parts.length > 2) {
        raw = parts[0] + "," + parts.slice(1).join("");
      }
      if (parts.length === 2 && parts[1].length > 3) {
        raw = parts[0] + "," + parts[1].slice(0, 3);
      }
      setDisplayValue(raw);
      const parsed = parseWeight(raw);
      onChange?.(parsed);
    },
    [onChange]
  );

  const handleFocus = useCallback(() => {
    setFocused(true);
    if (value) {
      setDisplayValue(value.toFixed(3).replace(".", ","));
    }
  }, [value]);

  const handleBlur = useCallback(() => {
    setFocused(false);
    const parsed = parseWeight(displayValue);
    if (parsed !== null) {
      onChange?.(parsed);
      setDisplayValue(formatWeight(parsed));
    } else {
      setDisplayValue("");
      onChange?.(null);
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
          type="text"
          inputMode="decimal"
          value={displayValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            "flex h-10 w-full rounded-lg border border-[var(--brand-border)] bg-white px-3.5 text-sm text-[var(--brand-black)] transition-colors placeholder:text-muted-foreground focus:border-[var(--brand-black)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-black)]/10 disabled:cursor-not-allowed disabled:opacity-50",
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
