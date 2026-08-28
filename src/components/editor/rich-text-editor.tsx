"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import Strike from "@tiptap/extension-strike";
import Code from "@tiptap/extension-code";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Link as LinkIcon,
  Quote,
  Minus,
  Undo2,
  Redo2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Code as CodeIcon,
  RemoveFormatting,
} from "lucide-react";
import { useCallback, useEffect } from "react";

interface RichTextEditorProps {
  value?: string | null;
  onChange?: (html: string, json: any) => void;
  placeholder?: string;
}

function ToolbarButton({
  onClick,
  active,
  disabled,
  children,
  title,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`flex size-8 items-center justify-center rounded-lg text-sm transition-colors ${
        active
          ? "bg-[var(--brand-black)] text-white"
          : "text-[var(--brand-black)]/60 hover:bg-[var(--brand-tertiary)] hover:text-[var(--brand-black)]"
      } disabled:cursor-not-allowed disabled:opacity-30`}
    >
      {children}
    </button>
  );
}

function ToolbarDivider() {
  return <div className="mx-1 h-6 w-px bg-[var(--brand-border)]" />;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Descreva seu produto...",
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-[var(--brand-black)] underline" },
      }),
      Underline,
      Strike,
      Code,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: value || "",
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none min-h-[200px] px-4 py-3 focus:outline-none text-[var(--brand-black)]",
      },
    },
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML(), editor.getJSON());
    },
  });

  useEffect(() => {
    if (editor && value !== undefined && value !== null) {
      const currentHtml = editor.getHTML();
      if (value !== currentHtml) {
        editor.commands.setContent(value, { emitUpdate: false });
      }
    }
  }, [value, editor]);

  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL do link:", previousUrl);
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  if (!editor) return null;

  return (
    <div className="overflow-hidden rounded-lg border border-[var(--brand-border)] bg-white">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 border-b border-[var(--brand-border)] bg-[var(--brand-tertiary)] px-2 py-1.5">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
          title="Negrito"
        >
          <Bold size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
          title="Itálico"
        >
          <Italic size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive("underline")}
          title="Sublinhado"
        >
          <UnderlineIcon size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive("strike")}
          title="Tachado"
        >
          <Strikethrough size={16} />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          active={editor.isActive("heading", { level: 1 })}
          title="Título 1"
        >
          <Heading1 size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive("heading", { level: 2 })}
          title="Título 2"
        >
          <Heading2 size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive("heading", { level: 3 })}
          title="Título 3"
        >
          <Heading3 size={16} />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
          title="Lista"
        >
          <List size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
          title="Lista numerada"
        >
          <ListOrdered size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive("blockquote")}
          title="Citação"
        >
          <Quote size={16} />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Separador"
        >
          <Minus size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={setLink}
          active={editor.isActive("link")}
          title="Link"
        >
          <LinkIcon size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          active={editor.isActive("code")}
          title="Código"
        >
          <CodeIcon size={16} />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          active={editor.isActive({ textAlign: "left" })}
          title="Alinhar à esquerda"
        >
          <AlignLeft size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          active={editor.isActive({ textAlign: "center" })}
          title="Centralizar"
        >
          <AlignCenter size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          active={editor.isActive({ textAlign: "right" })}
          title="Alinhar à direita"
        >
          <AlignRight size={16} />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton
          onClick={() => editor.chain().focus().unsetAllMarks().run()}
          title="Limpar formatação"
        >
          <RemoveFormatting size={16} />
        </ToolbarButton>

        <div className="mx-1" />

        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Desfazer"
        >
          <Undo2 size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Refazer"
        >
          <Redo2 size={16} />
        </ToolbarButton>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />
    </div>
  );
}
