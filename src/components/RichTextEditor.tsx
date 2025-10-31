'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import Strike from '@tiptap/extension-strike'
import CodeBlock from '@tiptap/extension-code-block-lowlight'
import Youtube from '@tiptap/extension-youtube'
import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableCell } from '@tiptap/extension-table-cell'
import { TableHeader } from '@tiptap/extension-table-header'
import { common, createLowlight } from 'lowlight'
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon,
  Strikethrough,
  List, 
  ListOrdered, 
  Quote, 
  Heading2,
  Heading3,
  Link as LinkIcon,
  Image as ImageIcon,
  Code,
  Youtube as YoutubeIcon,
  Table as TableIcon,
  Minus,
  Undo,
  Redo,
  MousePointerClick,
  Mail,
  AlignLeft,
  AlignCenter,
  AlignRight
} from 'lucide-react'
import { useState, useEffect } from 'react'

const lowlight = createLowlight(common)

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
  const [wordCount, setWordCount] = useState(0)
  const [readingTime, setReadingTime] = useState(0)
  const [showImageModal, setShowImageModal] = useState(false)
  const [imgMode, setImgMode] = useState<'url'|'generate'>('generate')
  const [imgUrl, setImgUrl] = useState('')
  const [imgPrompt, setImgPrompt] = useState('')
  const [imgProvider, setImgProvider] = useState<'gemini'|'openai'>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('google_api_key') ? 'gemini' : 'openai'
    }
    return 'openai'
  })
  const [imgSize, setImgSize] = useState<'512x512'|'1024x1024'|'2048x2048'>('1024x1024')
  const [imgLoading, setImgLoading] = useState(false)
  const [imgCrop, setImgCrop] = useState<boolean>(true)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
        codeBlock: false, // Disable default code block to use lowlight version
      }),
      Underline,
      Strike,
      CodeBlock.configure({
        lowlight,
        HTMLAttributes: {
          class: 'bg-slate-900 text-white p-4 rounded-lg my-4 overflow-x-auto',
        },
      }),
      Youtube.configure({
        width: 640,
        height: 360,
        HTMLAttributes: {
          class: 'w-full aspect-video rounded-lg my-4',
        },
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'border-collapse table-auto w-full my-4',
        },
      }),
      TableRow,
      TableCell.configure({
        HTMLAttributes: {
          class: 'border border-slate-300 px-4 py-2',
        },
      }),
      TableHeader.configure({
        HTMLAttributes: {
          class: 'border border-slate-300 px-4 py-2 bg-slate-100 font-bold',
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
      updateStats(editor)
    },
  })

  useEffect(() => {
    if (editor) {
      updateStats(editor)
    }
  }, [editor])

  const updateStats = (editorInstance: typeof editor) => {
    if (!editorInstance) return
    const text = editorInstance.getText()
    const words = text.trim().split(/\s+/).filter((word: string) => word.length > 0).length
    setWordCount(words)
    // Average reading speed: 200 words per minute
    setReadingTime(Math.ceil(words / 200))
  }

  const addLink = () => {
    const url = window.prompt('Enter URL:')
    if (url && editor) {
      editor.chain().focus().setLink({ href: url }).run()
    }
  }

  const addImage = () => {
    setImgPrompt('')
    setImgUrl('')
    setImgMode('generate')
    setShowImageModal(true)
  }

  const addYoutube = () => {
    const url = window.prompt('Enter YouTube URL:')
    if (url && editor) {
      editor.commands.setYoutubeVideo({
        src: url,
      })
    }
  }

  const insertTable = () => {
    if (editor) {
      editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
    }
  }

  const insertDivider = () => {
    if (editor) {
      editor.chain().focus().setHorizontalRule().run()
    }
  }

  const insertCodeBlock = () => {
    if (editor) {
      editor.chain().focus().setCodeBlock().run()
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
    <>
    <div className="border-2 border-slate-200 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="bg-slate-50 border-b-2 border-slate-200 p-2 flex flex-wrap gap-1">
        {/* Text Formatting */}
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

        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-2 rounded hover:bg-slate-200 transition-colors ${
            editor.isActive('underline') ? 'bg-slate-200 text-emerald-600' : 'text-slate-700'
          }`}
          title="Underline"
          type="button"
        >
          <UnderlineIcon className="w-4 h-4" />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`p-2 rounded hover:bg-slate-200 transition-colors ${
            editor.isActive('strike') ? 'bg-slate-200 text-emerald-600' : 'text-slate-700'
          }`}
          title="Strikethrough"
          type="button"
        >
          <Strikethrough className="w-4 h-4" />
        </button>

        <div className="w-px bg-slate-300 mx-1" />

        {/* Headings */}
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

        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-2 rounded hover:bg-slate-200 transition-colors ${
            editor.isActive('heading', { level: 3 }) ? 'bg-slate-200 text-emerald-600' : 'text-slate-700'
          }`}
          title="Heading 3"
          type="button"
        >
          <Heading3 className="w-4 h-4" />
        </button>

        <div className="w-px bg-slate-300 mx-1" />

        {/* Alignment */}
        <button
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={`p-2 rounded hover:bg-slate-200 transition-colors ${
            editor.isActive({ textAlign: 'left' }) ? 'bg-slate-200 text-emerald-600' : 'text-slate-700'
          }`}
          title="Align Left"
          type="button"
        >
          <AlignLeft className="w-4 h-4" />
        </button>

        <button
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={`p-2 rounded hover:bg-slate-200 transition-colors ${
            editor.isActive({ textAlign: 'center' }) ? 'bg-slate-200 text-emerald-600' : 'text-slate-700'
          }`}
          title="Align Center"
          type="button"
        >
          <AlignCenter className="w-4 h-4" />
        </button>

        <button
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={`p-2 rounded hover:bg-slate-200 transition-colors ${
            editor.isActive({ textAlign: 'right' }) ? 'bg-slate-200 text-emerald-600' : 'text-slate-700'
          }`}
          title="Align Right"
          type="button"
        >
          <AlignRight className="w-4 h-4" />
        </button>

        <div className="w-px bg-slate-300 mx-1" />

        {/* Lists */}
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

        {/* Insert Content */}
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

        <button
          onClick={addYoutube}
          className="p-2 rounded hover:bg-slate-200 transition-colors text-red-600"
          title="Embed YouTube"
          type="button"
        >
          <YoutubeIcon className="w-4 h-4" />
        </button>

        <button
          onClick={insertCodeBlock}
          className={`p-2 rounded hover:bg-slate-200 transition-colors ${
            editor.isActive('codeBlock') ? 'bg-slate-200 text-emerald-600' : 'text-slate-700'
          }`}
          title="Code Block"
          type="button"
        >
          <Code className="w-4 h-4" />
        </button>

        <button
          onClick={insertTable}
          className={`p-2 rounded hover:bg-slate-200 transition-colors ${
            editor.isActive('table') ? 'bg-slate-200 text-emerald-600' : 'text-slate-700'
          }`}
          title="Insert Table"
          type="button"
        >
      <TableIcon className="w-4 h-4" />
    </button>

    <button
      onClick={insertDivider}
          className="p-2 rounded hover:bg-slate-200 transition-colors text-slate-700"
          title="Horizontal Divider"
          type="button"
        >
          <Minus className="w-4 h-4" />
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

      {/* Stats Bar */}
      <div className="bg-slate-50 border-t-2 border-slate-200 px-4 py-2 flex items-center justify-between text-sm text-slate-600">
        <div className="flex items-center gap-4">
          <span>
            {wordCount} {wordCount === 1 ? 'word' : 'words'}
          </span>
          <span className="text-slate-400">•</span>
          <span>
            {readingTime} min read
          </span>
        </div>
        <div className="text-xs text-slate-500">
          Markdown shortcuts: ## H2, * List, &gt; Quote
        </div>
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
    {showImageModal && (
      <div className="fixed inset-0 z-50">
        <div className="absolute inset-0 bg-slate-900/50" onClick={()=> setShowImageModal(false)} />
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border-2 border-slate-200 max-w-lg w-full overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b-2 border-slate-200">
              <h4 className="text-lg font-bold text-slate-900">Add Image</h4>
              <button onClick={()=> setShowImageModal(false)} className="px-3 py-1 border-2 border-slate-200 rounded">Close</button>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <label className="flex items-center gap-2"><input type="radio" checked={imgMode==='generate'} onChange={()=> setImgMode('generate')} /> Generate</label>
                <label className="flex items-center gap-2"><input type="radio" checked={imgMode==='url'} onChange={()=> setImgMode('url')} /> From URL</label>
              </div>
              {imgMode === 'url' ? (
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-1">Image URL</label>
                  <input value={imgUrl} onChange={(e)=> setImgUrl(e.target.value)} className="w-full px-3 py-2 border-2 border-slate-200 rounded" placeholder="https://..." />
                  <div className="mt-2 flex items-center gap-2 text-sm text-slate-700">
                    <input id="cropToSquare" type="checkbox" checked={imgCrop} onChange={(e)=> setImgCrop(e.target.checked)} />
                    <label htmlFor="cropToSquare">Center-crop to square</label>
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-1">Prompt</label>
                    <input value={imgPrompt} onChange={(e)=> setImgPrompt(e.target.value)} className="w-full px-3 py-2 border-2 border-slate-200 rounded" placeholder="Describe the image you want..." />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-bold text-slate-900 mb-1">Provider</label>
                      <select value={imgProvider} onChange={(e)=> setImgProvider(e.target.value as any)} className="w-full px-3 py-2 border-2 border-slate-200 rounded">
                        <option value="gemini" disabled={!localStorage.getItem('google_api_key')}>Gemini</option>
                        <option value="openai" disabled={!localStorage.getItem('openai_api_key')}>OpenAI</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-900 mb-1">Size</label>
                      <select value={imgSize} onChange={(e)=> setImgSize(e.target.value as any)} className="w-full px-3 py-2 border-2 border-slate-200 rounded">
                        <option value="512x512">512x512</option>
                        <option value="1024x1024">1024x1024</option>
                        <option value="2048x2048">2048x2048</option>
                      </select>
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="px-4 py-3 border-t-2 border-slate-200 flex items-center justify-end gap-2">
              <button onClick={()=> setShowImageModal(false)} className="px-4 py-2 border-2 border-slate-200 rounded">Cancel</button>
              <button
                disabled={imgLoading || (imgMode==='url' ? !imgUrl : !imgPrompt)}
                onClick={async ()=>{
                  try {
                    setImgLoading(true)
                    let src = imgUrl
                    if (imgMode === 'generate') {
                      const apiKey = imgProvider === 'gemini' ? localStorage.getItem('google_api_key') : localStorage.getItem('openai_api_key')
                      if (!apiKey) { alert('Set your API key in Settings first'); setImgLoading(false); return }
                      const resp = await fetch('/api/admin/presentations/images/generate', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ prompt: imgPrompt, provider: imgProvider, apiKey, size: imgSize }) })
                      if (!resp.ok) { const j = await resp.json().catch(()=>({})); throw new Error(j.error || 'Generation failed') }
                      const j = await resp.json()
                      src = j.url
                    }
                    if (src && editor) {
                      if (imgCrop) {
                        try {
                          const dim = parseInt(imgSize.split('x')[0]) || 1024
                          const cropped = await cropToSquare(src, dim)
                          editor.chain().focus().setImage({ src: cropped }).run()
                        } catch {
                          editor.chain().focus().setImage({ src }).run()
                        }
                      } else {
                        editor.chain().focus().setImage({ src }).run()
                      }
                    }
                    setShowImageModal(false)
                  } catch (e) {
                    alert(e instanceof Error ? e.message : 'Image insert failed')
                  } finally { setImgLoading(false) }
                }}
                className="px-4 py-2 bg-emerald-600 text-white rounded disabled:opacity-50"
              >
                {imgLoading ? 'Working…' : (imgMode==='url' ? 'Insert' : 'Generate & Insert')}
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
    </>
  )
}

async function cropToSquare(src: string, size: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const ImgCtor: any = (typeof window !== 'undefined' && (window as any).Image) ? (window as any).Image : null;
    const img = ImgCtor ? new ImgCtor() : ({} as any);
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const s = Math.min(img.width, img.height);
        const sx = Math.max(0, Math.floor((img.width - s) / 2));
        const sy = Math.max(0, Math.floor((img.height - s) / 2));
        const canvas = document.createElement('canvas');
        canvas.width = size; canvas.height = size;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, sx, sy, s, s, 0, 0, size, size);
        resolve(canvas.toDataURL('image/png'));
      } catch (e) { reject(e); }
    };
    img.onerror = reject;
    img.src = src;
  });
}
