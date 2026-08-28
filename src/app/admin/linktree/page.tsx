"use client";

import { useState, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Loader2,
  Save,
  Plus,
  Trash2,
  GripVertical,
  ExternalLink,
  Eye,
  Pencil,
  Smartphone,
  Copy,
  Check,
  Link2,
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Input, Textarea } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { LinkTypeIcon } from "@/components/ui/link-type-icon";
import {
  linktreeSchema,
  type LinktreeFormData,
  type LinktreePayload,
} from "@/lib/schemas/linktree";

const LINK_TYPES = [
  { value: "", label: "Link", color: "#6b7280" },
  { value: "instagram", label: "Instagram", color: "#c13584" },
  { value: "whatsapp", label: "WhatsApp", color: "#25d366" },
  { value: "tiktok", label: "TikTok", color: "#010101" },
  { value: "youtube", label: "YouTube", color: "#ff0000" },
  { value: "twitter", label: "Twitter/X", color: "#1da1f2" },
  { value: "facebook", label: "Facebook", color: "#1877f2" },
  { value: "website", label: "Website", color: "#6366f1" },
  { value: "email", label: "Email", color: "#ea580c" },
  { value: "phone", label: "Telefone", color: "#0d9488" },
  { value: "spotify", label: "Spotify", color: "#1db954" },
  { value: "linkedin", label: "LinkedIn", color: "#0a66c2" },
  { value: "pinterest", label: "Pinterest", color: "#e60023" },
  { value: "github", label: "GitHub", color: "#333333" },
];

function getLinkTypeInfo(type: string) {
  return LINK_TYPES.find((t) => t.value === type) || LINK_TYPES[0];
}

function generateId() {
  return "tmp_" + Math.random().toString(36).slice(2, 11);
}

export default function LinktreePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [mobileTab, setMobileTab] = useState<"edit" | "preview">("edit");
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [storeSlug, setStoreSlug] = useState<string>("");

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors },
  } = useForm<LinktreeFormData>({
    resolver: zodResolver(linktreeSchema),
    defaultValues: {
      title: "",
      description: "",
      backgroundColor: "#1a1a2e",
      textColor: "#e2e8f0",
      links: [],
    },
  });

  const watchedTitle = useWatch({ control, name: "title" });
  const watchedDescription = useWatch({ control, name: "description" });
  const watchedBg = useWatch({ control, name: "backgroundColor" });
  const watchedText = useWatch({ control, name: "textColor" });
  const watchedLinks = useWatch({ control, name: "links" });

  // Load existing linktree + store slug
  useEffect(() => {
    async function load() {
      try {
        const [linktreeRes, storeRes] = await Promise.all([
          fetch("/api/linktree"),
          fetch("/api/stores"),
        ]);
        const linktreeData = await linktreeRes.json();
        const storeData = await storeRes.json();

        if (storeData.store?.slug) {
          setStoreSlug(storeData.store.slug);
        }

        if (linktreeData.linktree) {
          const linktree = linktreeData.linktree as LinktreePayload;
          reset({
            title: linktree.title,
            description: linktree.description || "",
            backgroundColor: linktree.backgroundColor || "#1a1a2e",
            textColor: linktree.textColor || "#e2e8f0",
            links: linktree.links.map((l) => ({
              id: l.id,
              title: l.title,
              url: l.url,
              linkType: l.linkType || "",
              order: l.order,
            })),
          });
        }
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [reset]);

  function addLink() {
    const current = watchedLinks || [];
    setValue("links", [
      ...current,
      {
        id: generateId(),
        title: "",
        url: "",
        linkType: "",
        order: current.length,
      },
    ]);
  }

  function removeLink(index: number) {
    const current = watchedLinks || [];
    setValue(
      "links",
      current.filter((_, i) => i !== index).map((l, i) => ({ ...l, order: i }))
    );
  }

  function handleDragStart(index: number) {
    setDragIndex(index);
  }

  function handleDragOver(e: React.DragEvent, index: number) {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;
    const current = [...(watchedLinks || [])];
    const [moved] = current.splice(dragIndex, 1);
    current.splice(index, 0, moved);
    setValue(
      "links",
      current.map((l, i) => ({ ...l, order: i }))
    );
    setDragIndex(index);
  }

  function handleDragEnd() {
    setDragIndex(null);
  }

  function copyLink() {
    if (!storeSlug) return;
    const url = `${window.location.origin}/${storeSlug}/links`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function onSubmit(data: LinktreeFormData) {
    setServerError(null);
    setSuccess(false);
    setSaving(true);

    try {
      const res = await fetch("/api/linktree", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        setServerError(result.error || "Erro ao salvar o Linktree.");
        return;
      }

      if (result.linktree) {
        const linktree = result.linktree as LinktreePayload;
        reset({
          title: linktree.title,
          description: linktree.description || "",
          backgroundColor: linktree.backgroundColor || "#1a1a2e",
          textColor: linktree.textColor || "#e2e8f0",
          links: linktree.links.map((l) => ({
            id: l.id,
            title: l.title,
            url: l.url,
            linkType: l.linkType || "",
            order: l.order,
          })),
        });
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setServerError("Erro de conexão. Tente novamente.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="size-8 animate-spin rounded-full border-2 border-[var(--brand-yellow)] border-t-transparent" />
      </div>
    );
  }

  const links = watchedLinks || [];
  const bg = watchedBg || "#1a1a2e";
  const textColor = watchedText || "#e2e8f0";
  const publicUrl = storeSlug
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/${storeSlug}/links`
    : "";

  return (
    <div>
      <PageHeader
        title="Linktree"
        subtitle="Configure seus links e visualize como ficará para os visitantes"
        action={
          <div className="flex items-center gap-2">
            {storeSlug && (
              <button
                type="button"
                onClick={copyLink}
                className="flex items-center gap-2 rounded-xl border border-[var(--brand-border)] bg-white px-4 py-2.5 text-sm font-bold text-[var(--brand-black)] transition-all hover:bg-[var(--brand-tertiary)]"
              >
                {copied ? (
                  <Check size={16} className="text-green-600" />
                ) : (
                  <Copy size={16} />
                )}
                {copied ? "Copiado!" : "Copiar link"}
              </button>
            )}
            <button
              onClick={handleSubmit(onSubmit)}
              disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-[var(--brand-yellow)] px-4 py-2.5 text-sm font-bold text-[var(--brand-black)] transition-all hover:shadow-md disabled:opacity-60"
            >
              {saving ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Save size={16} />
              )}
              {saving ? "Salvando..." : "Salvar"}
            </button>
          </div>
        }
      />

      {/* Shareable link banner */}
      {storeSlug && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-[var(--brand-border)] bg-white px-4 py-3">
          <Link2 size={18} className="shrink-0 text-muted-foreground" />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Seu link público
            </p>
            <p className="truncate text-sm font-medium text-[var(--brand-black)]">
              {publicUrl}
            </p>
          </div>
          <a
            href={`/${storeSlug}/links`}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 rounded-lg p-2 text-muted-foreground transition-colors hover:bg-[var(--brand-tertiary)] hover:text-[var(--brand-black)]"
          >
            <ExternalLink size={16} />
          </a>
        </div>
      )}

      {/* Mobile tab switcher */}
      <div className="mb-4 flex gap-2 lg:hidden">
        <button
          onClick={() => setMobileTab("edit")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold transition-colors ${
            mobileTab === "edit"
              ? "bg-[var(--brand-black)] text-white"
              : "bg-[var(--brand-tertiary)] text-[var(--brand-black)]"
          }`}
        >
          <Pencil size={16} />
          Editar
        </button>
        <button
          onClick={() => setMobileTab("preview")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold transition-colors ${
            mobileTab === "preview"
              ? "bg-[var(--brand-black)] text-white"
              : "bg-[var(--brand-tertiary)] text-[var(--brand-black)]"
          }`}
        >
          <Eye size={16} />
          Preview
        </button>
      </div>

      {serverError && (
        <div className="mb-4 rounded-lg bg-[var(--brand-error-light)] px-4 py-3 text-sm font-medium text-[var(--brand-error)]">
          {serverError}
        </div>
      )}

      {success && (
        <div className="mb-4 rounded-lg bg-[var(--brand-success-light)] px-4 py-3 text-sm font-medium text-[var(--brand-success)]">
          Linktree salvo com sucesso!
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
        {/* ── Editor ── */}
        <div className={`space-y-6 ${mobileTab === "preview" ? "hidden lg:block" : ""}`}>
          {/* Info */}
          <Card>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-[var(--brand-black)]/40">
              Informações
            </h3>
            <div className="space-y-4">
              <Input
                label="Título"
                placeholder="Meu Linktree"
                {...register("title")}
                error={errors.title?.message}
              />
              <Textarea
                label="Descrição"
                placeholder="Uma breve descrição sobre você"
                rows={2}
                {...register("description")}
                error={errors.description?.message}
              />
            </div>
          </Card>

          {/* Appearance */}
          <Card>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-[var(--brand-black)]/40">
              Aparência
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[var(--brand-black)]">
                  Cor de fundo
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={bg}
                    onChange={(e) =>
                      setValue("backgroundColor", e.target.value, { shouldValidate: true })
                    }
                    className="size-10 cursor-pointer rounded-lg border border-[var(--brand-border)]"
                  />
                  <input
                    type="text"
                    value={bg}
                    onChange={(e) =>
                      setValue("backgroundColor", e.target.value, { shouldValidate: true })
                    }
                    placeholder="#1a1a2e"
                    className="flex h-10 flex-1 rounded-lg border border-[var(--brand-border)] bg-white px-3 text-sm font-mono text-[var(--brand-black)] outline-none focus:border-[var(--brand-black)]"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[var(--brand-black)]">
                  Cor do texto
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={textColor}
                    onChange={(e) =>
                      setValue("textColor", e.target.value, { shouldValidate: true })
                    }
                    className="size-10 cursor-pointer rounded-lg border border-[var(--brand-border)]"
                  />
                  <input
                    type="text"
                    value={textColor}
                    onChange={(e) =>
                      setValue("textColor", e.target.value, { shouldValidate: true })
                    }
                    placeholder="#e2e8f0"
                    className="flex h-10 flex-1 rounded-lg border border-[var(--brand-border)] bg-white px-3 text-sm font-mono text-[var(--brand-black)] outline-none focus:border-[var(--brand-black)]"
                  />
                </div>
              </div>
            </div>
            {/* Preset themes */}
            <div className="mt-4">
              <p className="mb-2 text-xs font-bold text-muted-foreground">Temas rápidos</p>
              <div className="flex gap-2">
                {[
                  { bg: "#1a1a2e", text: "#e2e8f0", label: "Dark" },
                  { bg: "#0f172a", text: "#f8fafc", label: "Midnight" },
                  { bg: "#1e293b", text: "#e2e8f0", label: "Slate" },
                  { bg: "#fafafa", text: "#171717", label: "Light" },
                  { bg: "#fdf2f8", text: "#831843", label: "Rose" },
                  { bg: "#ecfdf5", text: "#064e3b", label: "Emerald" },
                ].map((theme) => (
                  <button
                    key={theme.label}
                    type="button"
                    onClick={() => {
                      setValue("backgroundColor", theme.bg, { shouldValidate: true });
                      setValue("textColor", theme.text, { shouldValidate: true });
                    }}
                    className="flex size-8 items-center justify-center rounded-full border-2 transition-all hover:scale-110"
                    style={{
                      backgroundColor: theme.bg,
                      borderColor: bg === theme.bg ? textColor : "transparent",
                    }}
                    title={theme.label}
                  >
                    <span className="text-[8px] font-bold" style={{ color: theme.text }}>
                      Aa
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </Card>

          {/* Links */}
          <Card>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--brand-black)]/40">
                Meus links ({links.length})
              </h3>
              <button
                type="button"
                onClick={addLink}
                className="flex items-center gap-1.5 rounded-lg bg-[var(--brand-yellow)] px-3 py-1.5 text-xs font-bold text-[var(--brand-black)] transition-all hover:shadow-md"
              >
                <Plus size={14} />
                Adicionar link
              </button>
            </div>

            {links.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[var(--brand-border)] py-12 text-center">
                <p className="text-sm font-medium text-[var(--brand-black)]/50">
                  Nenhum link adicionado
                </p>
                <button
                  type="button"
                  onClick={addLink}
                  className="mt-3 flex items-center gap-1.5 rounded-lg bg-[var(--brand-yellow)] px-4 py-2 text-xs font-bold text-[var(--brand-black)]"
                >
                  <Plus size={14} />
                  Adicionar primeiro link
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {links.map((link, index) => {
                  const typeInfo = getLinkTypeInfo(link.linkType || "");
                  return (
                    <div
                      key={link.id || index}
                      draggable
                      onDragStart={() => handleDragStart(index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDragEnd={handleDragEnd}
                      className={`rounded-xl border border-[var(--brand-border)] bg-white p-4 transition-all ${
                        dragIndex === index ? "opacity-50 shadow-lg" : ""
                      }`}
                    >
                      <div className="mb-3 flex items-center gap-2">
                        <div className="cursor-grab text-[var(--brand-black)]/20 active:cursor-grabbing">
                          <GripVertical size={16} />
                        </div>
                        <div
                          className="flex size-7 items-center justify-center rounded-md text-white"
                          style={{ backgroundColor: typeInfo.color }}
                        >
                          <LinkTypeIcon type={link.linkType || ""} className="h-4 w-4" />
                        </div>
                        <select
                          {...register(`links.${index}.linkType`)}
                          className="rounded-lg border border-[var(--brand-border)] bg-[var(--brand-tertiary)] px-2 py-1 text-xs font-bold text-[var(--brand-black)]"
                        >
                          {LINK_TYPES.map((t) => (
                            <option key={t.value} value={t.value}>
                              {t.label}
                            </option>
                          ))}
                        </select>
                        <div className="flex-1" />
                        <button
                          type="button"
                          onClick={() => removeLink(index)}
                          className="rounded-lg p-1.5 text-red-400 transition-colors hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        <div>
                          <input
                            {...register(`links.${index}.title`)}
                            placeholder="Título do link"
                            className="h-9 w-full rounded-lg border border-[var(--brand-border)] bg-white px-3 text-sm text-[var(--brand-black)] outline-none focus:border-[var(--brand-black)]"
                          />
                          {errors.links?.[index]?.title && (
                            <p className="mt-1 text-xs text-[var(--brand-error)]">
                              {errors.links[index]?.title?.message}
                            </p>
                          )}
                        </div>
                        <div>
                          <input
                            {...register(`links.${index}.url`)}
                            placeholder="https://..."
                            className="h-9 w-full rounded-lg border border-[var(--brand-border)] bg-white px-3 text-sm text-[var(--brand-black)] outline-none focus:border-[var(--brand-black)]"
                          />
                          {errors.links?.[index]?.url && (
                            <p className="mt-1 text-xs text-[var(--brand-error)]">
                              {errors.links[index]?.url?.message}
                            </p>
                          )}
                        </div>
                      </div>
                      <input type="hidden" {...register(`links.${index}.order`)} value={index} />
                      <input type="hidden" {...register(`links.${index}.id`)} />
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>

        {/* ── Preview ── */}
        <div className={`${mobileTab === "edit" ? "hidden lg:block" : ""}`}>
          <div className="sticky top-6">
            <div className="mb-3 flex items-center gap-2">
              <Smartphone size={16} className="text-muted-foreground" />
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Preview
              </span>
            </div>

            {/* Phone frame */}
            <div className="mx-auto overflow-hidden rounded-[2.5rem] border-4 border-neutral-800 bg-neutral-800 shadow-2xl">
              <div className="h-6 bg-neutral-800" />
              <div
                className="min-h-[600px] px-6 py-8"
                style={{ backgroundColor: bg }}
              >
                <div className="flex flex-col items-center text-center">
                  {/* Avatar */}
                  <div
                    className="mb-4 flex size-20 items-center justify-center rounded-full text-3xl font-extrabold"
                    style={{
                      backgroundColor: textColor + "15",
                      color: textColor,
                      border: `2px solid ${textColor}25`,
                    }}
                  >
                    {(watchedTitle || "M").charAt(0).toUpperCase()}
                  </div>

                  {/* Title */}
                  <h1 className="text-xl font-extrabold" style={{ color: textColor }}>
                    {watchedTitle || "Meu Linktree"}
                  </h1>

                  {/* Description */}
                  {watchedDescription && (
                    <p className="mt-2 max-w-xs text-sm" style={{ color: textColor, opacity: 0.6 }}>
                      {watchedDescription}
                    </p>
                  )}

                  {/* Links */}
                  <div className="mt-8 flex w-full max-w-xs flex-col gap-3">
                    {links.map((link, i) => {
                      const typeInfo = getLinkTypeInfo(link.linkType || "");
                      return (
                        <a
                          key={link.id || i}
                          href={link.url || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex items-center gap-3 rounded-2xl px-5 py-3.5 text-sm font-semibold transition-all hover:scale-[1.02] hover:shadow-lg"
                          style={{
                            backgroundColor: typeInfo.color + "18",
                            color: textColor,
                            border: `1px solid ${typeInfo.color}30`,
                          }}
                        >
                          <span
                            className="flex size-8 shrink-0 items-center justify-center rounded-xl text-white"
                            style={{ backgroundColor: typeInfo.color + "cc" }}
                          >
                            <LinkTypeIcon type={link.linkType || ""} className="h-4 w-4" />
                          </span>
                          <span className="flex-1 truncate text-left">
                            {link.title || "Link"}
                          </span>
                          <ExternalLink
                            size={14}
                            className="shrink-0 opacity-30 transition-opacity group-hover:opacity-60"
                          />
                        </a>
                      );
                    })}

                    {links.length === 0 && (
                      <p className="py-8 text-sm" style={{ color: textColor, opacity: 0.3 }}>
                        Adicione links para visualizar
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="h-6 bg-neutral-800" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
