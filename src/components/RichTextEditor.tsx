'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Quote, 
  Heading2, 
  Link as LinkIcon,
  Image as ImageIcon,
  Undo,
  Redo
} from 'lucide-react'

interface RichTextEditorProps {
  content: string
  onChange: (html: string) => void
  placeholder?: string
}

export function RichTextEditor({ content, onChange, placeholder = 'Start writing...' }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-emerald-600 hover:text-emerald-700 underline',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class: 'prose prose-slate max-w-none focus:outline-none min-h-[400px] px-4 py-3',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  const addLink = () => {
    const url = window.prompt('Enter URL:')
    if (url && editor) {
      editor.chain().focus().setLink({ href: url }).run()
    }
  }

  const addImage = () => {
    const url = window.prompt('Enter image URL:')
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }

  if (!editor) {
    return null
  }

  return (
    <div className="border-2 border-slate-200 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="bg-slate-50 border-b-2 border-slate-200 p-2 flex flex-wrap gap-1">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-slate-200 transition-colors ${
            editor.isActive('bold') ? 'bg-slate-200 text-emerald-600' : 'text-slate-700'
          }`}
          title="Bold (Ctrl+B)"
          type="button"
        >
          <Bold className="w-4 h-4" />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-slate-200 transition-colors ${
            editor.isActive('italic') ? 'bg-slate-200 text-emerald-600' : 'text-slate-700'
          }`}
          title="Italic (Ctrl+I)"
          type="button"
        >
          <Italic className="w-4 h-4" />
        </button>

        <div className="w-px bg-slate-300 mx-1" />

        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded hover:bg-slate-200 transition-colors ${
            editor.isActive('heading', { level: 2 }) ? 'bg-slate-200 text-emerald-600' : 'text-slate-700'
          }`}
          title="Heading 2"
          type="button"
        >
          <Heading2 className="w-4 h-4" />
        </button>

        <div className="w-px bg-slate-300 mx-1" />

        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-slate-200 transition-colors ${
            editor.isActive('bulletList') ? 'bg-slate-200 text-emerald-600' : 'text-slate-700'
          }`}
          title="Bullet List"
          type="button"
        >
          <List className="w-4 h-4" />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-slate-200 transition-colors ${
            editor.isActive('orderedList') ? 'bg-slate-200 text-emerald-600' : 'text-slate-700'
          }`}
          title="Numbered List"
          type="button"
        >
          <ListOrdered className="w-4 h-4" />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded hover:bg-slate-200 transition-colors ${
            editor.isActive('blockquote') ? 'bg-slate-200 text-emerald-600' : 'text-slate-700'
          }`}
          title="Quote"
          type="button"
        >
          <Quote className="w-4 h-4" />
        </button>

        <div className="w-px bg-slate-300 mx-1" />

        <button
          onClick={addLink}
          className={`p-2 rounded hover:bg-slate-200 transition-colors ${
            editor.isActive('link') ? 'bg-slate-200 text-emerald-600' : 'text-slate-700'
          }`}
          title="Add Link"
          type="button"
        >
          <LinkIcon className="w-4 h-4" />
        </button>

        <button
          onClick={addImage}
          className="p-2 rounded hover:bg-slate-200 transition-colors text-slate-700"
          title="Add Image"
          type="button"
        >
          <ImageIcon className="w-4 h-4" />
        </button>

        <div className="w-px bg-slate-300 mx-1" />

        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-2 rounded hover:bg-slate-200 transition-colors text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Undo (Ctrl+Z)"
          type="button"
        >
          <Undo className="w-4 h-4" />
        </button>

        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-2 rounded hover:bg-slate-200 transition-colors text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Redo (Ctrl+Y)"
          type="button"
        >
          <Redo className="w-4 h-4" />
        </button>
      </div>

      {/* Editor */}
      <div className="bg-white">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}

