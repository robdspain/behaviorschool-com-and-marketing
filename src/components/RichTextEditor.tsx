'use client'

import { useEffect, useMemo } from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import Underline from '@tiptap/extension-underline'
import Strike from '@tiptap/extension-strike'
import TextAlign from '@tiptap/extension-text-align'
import Youtube from '@tiptap/extension-youtube'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { common, createLowlight } from 'lowlight'

interface RichTextEditorProps {
  content: string
  onChange: (html: string) => void
  placeholder?: string
}

export function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
  const lowlight = useMemo(() => createLowlight(common), [])
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: { keepMarks: true },
        orderedList: { keepMarks: true },
      }),
      Link.configure({ openOnClick: true }),
      Image.configure({ inline: false }),
      Placeholder.configure({ placeholder: placeholder || 'Write something…' }),
      Underline,
      Strike,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Youtube.configure({ controls: true, nocookie: true }),
      CodeBlockLowlight.configure({ lowlight }),
    ],
    content,
    onUpdate: ({ editor }) => {
      try {
        onChange(editor.getHTML())
      } catch {}
    },
    editorProps: {
      attributes: {
        class: 'prose prose-slate max-w-none focus:outline-none p-4 border-2 border-slate-200 rounded-lg min-h-[240px] bg-white',
      },
    },
  })

  // Keep external content prop in sync when it changes from the outside
  useEffect(() => {
    if (!editor) return
    const current = editor.getHTML()
    if (content && content !== current) {
      editor.commands.setContent(content, { emitUpdate: false })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content, editor])

  const Toolbar = useMemo(() => {
    if (!editor) return null
    const btn = (
      onClick: () => void,
      active: boolean,
      label: string
    ) => (
      <button
        type="button"
        onClick={onClick}
        className={`px-2 py-1 text-sm rounded ${active ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}
      >
        {label}
      </button>
    )

    return (
      <div className="flex flex-wrap gap-2 mb-2">
        {btn(() => editor.chain().focus().toggleBold().run(), editor.isActive('bold'), 'B')}
        {btn(() => editor.chain().focus().toggleItalic().run(), editor.isActive('italic'), 'I')}
        {btn(() => editor.chain().focus().toggleUnderline().run(), editor.isActive('underline'), 'U')}
        {btn(() => editor.chain().focus().toggleStrike().run(), editor.isActive('strike'), 'S')}
        {btn(() => editor.chain().focus().toggleHeading({ level: 2 }).run(), editor.isActive('heading', { level: 2 }), 'H2')}
        {btn(() => editor.chain().focus().toggleHeading({ level: 3 }).run(), editor.isActive('heading', { level: 3 }), 'H3')}
        {btn(() => editor.chain().focus().toggleBulletList().run(), editor.isActive('bulletList'), '• List')}
        {btn(() => editor.chain().focus().toggleOrderedList().run(), editor.isActive('orderedList'), '1. List')}
        {btn(() => editor.chain().focus().setTextAlign('left').run(), editor.isActive({ textAlign: 'left' }), 'Left')}
        {btn(() => editor.chain().focus().setTextAlign('center').run(), editor.isActive({ textAlign: 'center' }), 'Center')}
        {btn(() => editor.chain().focus().setTextAlign('right').run(), editor.isActive({ textAlign: 'right' }), 'Right')}
        {btn(() => editor.chain().focus().toggleCodeBlock().run(), editor.isActive('codeBlock'), '</>')}
        {btn(() => editor.chain().focus().setHorizontalRule().run(), false, 'HR')}
      </div>
    )
  }, [editor])

  if (!editor) return null

  return (
    <div>
      {Toolbar}
      <EditorContent editor={editor} />
    </div>
  )
}
