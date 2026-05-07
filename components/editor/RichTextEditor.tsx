"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";

interface Props {
  content: string;
  onChange: (html: string) => void;
}

type ToolbarItem =
  | { label: string; title: string; action: () => void; active: boolean }
  | { type: "divider" };

export default function RichTextEditor({ content, onChange }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: "Write your post content here..." }),
    ],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  if (!editor) return null;

  const toolbar: ToolbarItem[] = [
    { label: "B", title: "Bold", action: () => editor.chain().focus().toggleBold().run(), active: editor.isActive("bold") },
    { label: "I", title: "Italic", action: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive("italic") },
    { label: "S̶", title: "Strike", action: () => editor.chain().focus().toggleStrike().run(), active: editor.isActive("strike") },
    { type: "divider" },
    { label: "H2", title: "Heading 2", action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: editor.isActive("heading", { level: 2 }) },
    { label: "H3", title: "Heading 3", action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), active: editor.isActive("heading", { level: 3 }) },
    { type: "divider" },
    { label: "≡", title: "Bullet list", action: () => editor.chain().focus().toggleBulletList().run(), active: editor.isActive("bulletList") },
    { label: "1.", title: "Ordered list", action: () => editor.chain().focus().toggleOrderedList().run(), active: editor.isActive("orderedList") },
    { type: "divider" },
    { label: "</>", title: "Code block", action: () => editor.chain().focus().toggleCodeBlock().run(), active: editor.isActive("codeBlock") },
    { label: "❝", title: "Blockquote", action: () => editor.chain().focus().toggleBlockquote().run(), active: editor.isActive("blockquote") },
    { label: "—", title: "Horizontal rule", action: () => editor.chain().focus().setHorizontalRule().run(), active: false },
  ];

  return (
    <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
      <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 border-b border-slate-100 bg-slate-50">
        {toolbar.map((item, i) => {
          if ("type" in item && item.type === "divider") {
            return <div key={i} className="w-px h-5 bg-slate-200 mx-1" />;
          }
          const btn = item as { label: string; title: string; action: () => void; active: boolean };
          return (
            <button
              key={btn.label}
              type="button"
              title={btn.title}
              onClick={btn.action}
              className={`px-2.5 py-1.5 text-sm rounded-lg font-medium transition-all ${
                btn.active
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-200 hover:text-slate-900"
              }`}
            >
              {btn.label}
            </button>
          );
        })}
      </div>
      <EditorContent editor={editor} className="prose max-w-none px-6 py-5 min-h-[360px] focus:outline-none text-slate-800" />
    </div>
  );
}
