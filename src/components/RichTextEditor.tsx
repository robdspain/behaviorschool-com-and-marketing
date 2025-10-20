'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import TextAlign from '@tiptap/extension-text-align'
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
  Redo,
  MousePointerClick,
  Mail
} from 'lucide-react'
import { useState } from 'react'

interface RichTextEditorProps {
  content: string
  onChange: (html: string) => void
  placeholder?: string
}

export function RichTextEditor({ content, onChange, placeholder = 'Start writing...' }: RichTextEditorProps) {
  const [showCTAModal, setShowCTAModal] = useState(false)
  const [ctaText, setCtaText] = useState('')
  const [ctaUrl, setCtaUrl] = useState('')
  const [ctaStyle, setCtaStyle] = useState<'primary' | 'secondary'>('primary')

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
      TextAlign.configure({
        types: ['heading', 'paragraph'],
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

  const insertCTA = () => {
    if (!ctaText || !ctaUrl) {
      alert('Please enter both button text and URL')
      return
    }

    if (editor) {
      const buttonClass = ctaStyle === 'primary'
        ? 'inline-block px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors text-center no-underline'
        : 'inline-block px-8 py-4 bg-white hover:bg-slate-50 text-emerald-700 font-bold rounded-lg border-2 border-emerald-600 transition-colors text-center no-underline'

      const buttonHtml = `<p style="text-align: center; margin: 2rem 0;"><a href="${ctaUrl}" class="${buttonClass}" style="text-decoration: none;">${ctaText}</a></p>`
      
      editor.commands.insertContent(buttonHtml)
      
      // Reset form
      setCtaText('')
      setCtaUrl('')
      setCtaStyle('primary')
      setShowCTAModal(false)
    }
  }

  const insertContactButton = () => {
    if (editor) {
      const buttonHtml = `<p style="text-align: center; margin: 2rem 0;"><a href="https://behaviorschool.com/contact" class="inline-block px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors text-center no-underline" style="text-decoration: none;">Contact Us</a></p>`
      editor.commands.insertContent(buttonHtml)
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

        <div className="w-px bg-slate-300 mx-1" />

        <button
          onClick={() => setShowCTAModal(true)}
          className="p-2 rounded hover:bg-slate-200 transition-colors text-emerald-600 font-medium flex items-center gap-1"
          title="Insert CTA Button"
          type="button"
        >
          <MousePointerClick className="w-4 h-4" />
          <span className="text-xs">CTA</span>
        </button>

        <button
          onClick={insertContactButton}
          className="p-2 rounded hover:bg-slate-200 transition-colors text-blue-600 font-medium flex items-center gap-1"
          title="Insert Contact Button"
          type="button"
        >
          <Mail className="w-4 h-4" />
          <span className="text-xs">Contact</span>
        </button>
      </div>

      {/* Editor */}
      <div className="bg-white">
        <EditorContent editor={editor} />
      </div>

      {/* CTA Modal */}
      {showCTAModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Insert Call-to-Action Button</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Button Text
                </label>
                <input
                  type="text"
                  value={ctaText}
                  onChange={(e) => setCtaText(e.target.value)}
                  placeholder="e.g., Get Started, Learn More"
                  className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Button URL
                </label>
                <input
                  type="url"
                  value={ctaUrl}
                  onChange={(e) => setCtaUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Button Style
                </label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setCtaStyle('primary')}
                    className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all ${
                      ctaStyle === 'primary'
                        ? 'bg-emerald-600 text-white ring-2 ring-emerald-600 ring-offset-2'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    Primary
                  </button>
                  <button
                    type="button"
                    onClick={() => setCtaStyle('secondary')}
                    className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all ${
                      ctaStyle === 'secondary'
                        ? 'bg-white text-emerald-700 ring-2 ring-emerald-600 ring-offset-2 border-2 border-emerald-600'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    Secondary
                  </button>
                </div>
              </div>

              {/* Preview */}
              {ctaText && (
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-600 mb-2">Preview:</p>
                  <div className="text-center">
                    <span
                      className={`inline-block px-8 py-4 font-bold rounded-lg ${
                        ctaStyle === 'primary'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-white text-emerald-700 border-2 border-emerald-600'
                      }`}
                    >
                      {ctaText}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => {
                  setShowCTAModal(false)
                  setCtaText('')
                  setCtaUrl('')
                  setCtaStyle('primary')
                }}
                className="flex-1 px-4 py-2 bg-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={insertCTA}
                disabled={!ctaText || !ctaUrl}
                className="flex-1 px-4 py-2 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Insert Button
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

