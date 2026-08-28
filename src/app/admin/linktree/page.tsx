"use client";

import { useState, useEffect, useCallback } from "react";
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
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Input, Textarea } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  linktreeSchema,
  type LinktreeFormData,
  type LinkFormData,
} from "@/lib/schemas/linktree";

const LINK_TYPES = [
  { value: "", label: "Link" },
  { value: "instagram", label: "Instagram" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "tiktok", label: "TikTok" },
  { value: "youtube", label: "YouTube" },
  { value: "twitter", label: "Twitter/X" },
  { value: "facebook", label: "Facebook" },
  { value: "website", label: "Website" },
  { value: "email", label: "Email" },
  { value: "phone", label: "Telefone" },
];

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
      backgroundColor: "#7c3aed",
      textColor: "#ffffff",
      links: [],
    },
  });

  const watchedTitle = useWatch({ control, name: "title" });
  const watchedDescription = useWatch({ control, name: "description" });
  const watchedBg = useWatch({ control, name: "backgroundColor" });
  const watchedText = useWatch({ control, name: "textColor" });
  const watchedLinks = useWatch({ control, name: "links" });

  // Load existing linktree
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/linktree");
        const data = await res.json();
        if (data.linktree) {
          reset({
            title: data.linktree.title,
            description: data.linktree.description || "",
            backgroundColor: data.linktree.backgroundColor || "#7c3aed",
            textColor: data.linktree.textColor || "#ffffff",
            links: data.linktree.links.map((l: any) => ({
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

  // Add new link
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

  // Remove link
  function removeLink(index: number) {
    const current = watchedLinks || [];
    setValue(
      "links",
      current.filter((_, i) => i !== index).map((l, i) => ({ ...l, order: i }))
    );
  }

  // Drag and drop
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

  // Submit
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

      // Update form with returned IDs
      if (result.linktree) {
        reset({
          title: result.linktree.title,
          description: result.linktree.description || "",
          backgroundColor: result.linktree.backgroundColor || "#7c3aed",
          textColor: result.linktree.textColor || "#ffffff",
          links: result.linktree.links.map((l: any) => ({
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
  const bg = watchedBg || "#7c3aed";
  const textColor = watchedText || "#ffffff";

  return (
    <div>
      <PageHeader
        title="Linktree"
        subtitle="Configure seus links e visualize como ficará para os visitantes"
        action={
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
        }
      />

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
        <div
          className={`space-y-6 ${mobileTab === "preview" ? "hidden lg:block" : ""}`}
        >
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
                      setValue("backgroundColor", e.target.value, {
                        shouldValidate: true,
                      })
                    }
                    className="size-10 cursor-pointer rounded-lg border border-[var(--brand-border)]"
                  />
                  <input
                    type="text"
                    value={bg}
                    onChange={(e) =>
                      setValue("backgroundColor", e.target.value, {
                        shouldValidate: true,
                      })
                    }
                    placeholder="#7c3aed"
                    className="flex h-10 flex-1 rounded-lg border border-[var(--brand-border)] bg-white px-3 text-sm font-mono text-[var(--brand-black)] outline-none focus:border-[var(--brand-black)]"
                  />
                </div>
                {errors.backgroundColor && (
                  <p className="mt-1 text-xs text-[var(--brand-error)]">
                    {errors.backgroundColor.message}
                  </p>
                )}
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
                      setValue("textColor", e.target.value, {
                        shouldValidate: true,
                      })
                    }
                    className="size-10 cursor-pointer rounded-lg border border-[var(--brand-border)]"
                  />
                  <input
                    type="text"
                    value={textColor}
                    onChange={(e) =>
                      setValue("textColor", e.target.value, {
                        shouldValidate: true,
                      })
                    }
                    placeholder="#ffffff"
                    className="flex h-10 flex-1 rounded-lg border border-[var(--brand-border)] bg-white px-3 text-sm font-mono text-[var(--brand-black)] outline-none focus:border-[var(--brand-black)]"
                  />
                </div>
                {errors.textColor && (
                  <p className="mt-1 text-xs text-[var(--brand-error)]">
                    {errors.textColor.message}
                  </p>
                )}
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
                {links.map((link, index) => (
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
                    <input
                      type="hidden"
                      {...register(`links.${index}.order`)}
                      value={index}
                    />
                    <input
                      type="hidden"
                      {...register(`links.${index}.id`)}
                    />
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* ── Preview ── */}
        <div
          className={`${mobileTab === "edit" ? "hidden lg:block" : ""}`}
        >
          <div className="sticky top-6">
            <div className="mb-3 flex items-center gap-2">
              <Smartphone size={16} className="text-muted-foreground" />
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Preview
              </span>
            </div>

            {/* Phone frame */}
            <div className="mx-auto overflow-hidden rounded-[2.5rem] border-4 border-[var(--brand-black)] bg-[var(--brand-black)] shadow-2xl">
              <div className="h-6 bg-[var(--brand-black)]" />
              <div
                className="min-h-[600px] px-6 py-8"
                style={{ backgroundColor: bg }}
              >
                <div className="flex flex-col items-center text-center">
                  {/* Avatar */}
                  <div
                    className="mb-4 flex size-20 items-center justify-center rounded-full text-3xl font-extrabold"
                    style={{
                      backgroundColor: textColor + "20",
                      color: textColor,
                    }}
                  >
                    {(watchedTitle || "M").charAt(0).toUpperCase()}
                  </div>

                  {/* Title */}
                  <h1
                    className="text-xl font-extrabold"
                    style={{ color: textColor }}
                  >
                    {watchedTitle || "Meu Linktree"}
                  </h1>

                  {/* Description */}
                  {watchedDescription && (
                    <p
                      className="mt-2 max-w-xs text-sm"
                      style={{ color: textColor, opacity: 0.7 }}
                    >
                      {watchedDescription}
                    </p>
                  )}

                  {/* Links */}
                  <div className="mt-8 flex w-full max-w-xs flex-col gap-3">
                    {links.map((link, i) => (
                      <a
                        key={link.id || i}
                        href={link.url || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between rounded-xl px-5 py-3.5 text-sm font-bold transition-all hover:scale-[1.02]"
                        style={{
                          backgroundColor: textColor + "15",
                          color: textColor,
                          border: `1px solid ${textColor}30`,
                        }}
                      >
                        <span className="truncate">
                          {link.title || "Link"}
                        </span>
                        <ExternalLink size={14} className="shrink-0 opacity-50" />
                      </a>
                    ))}

                    {links.length === 0 && (
                      <p
                        className="py-8 text-sm"
                        style={{ color: textColor, opacity: 0.4 }}
                      >
                        Adicione links para visualizar
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="h-6 bg-[var(--brand-black)]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
