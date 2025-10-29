"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect, useState } from 'react';

export default function SlideRichEditor({ title, initialBullets, onSave, onClose }: { title: string; initialBullets: string[]; onSave: (bullets: string[])=>void; onClose: ()=>void }) {
  const [content, setContent] = useState(initialBullets.join('\n'));
  const editor = useEditor({
    extensions: [StarterKit],
    content: `<h2>${escapeHtml(title)}</h2><ul>${initialBullets.map(b=>`<li>${escapeHtml(b)}</li>`).join('')}</ul>`,
  });

  useEffect(()=>{ setContent(initialBullets.join('\n')); }, [JSON.stringify(initialBullets)]);

  const save = () => {
    try {
      const html = editor?.getHTML() || '';
      // Extract list items and paragraphs
      const div = document.createElement('div');
      div.innerHTML = html;
      const items: string[] = [];
      div.querySelectorAll('li').forEach(li => items.push((li.textContent||'').trim()));
      if (items.length === 0) {
        // fallback: split by lines from plain text
        const text = editor?.getText() || content;
        text.split('\n').map(s=>s.trim()).filter(Boolean).forEach(s=> items.push(s));
      }
      onSave(items);
    } catch {
      onSave(content.split('\n').map(s=> s.trim()).filter(Boolean));
    }
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-slate-900/50" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl border-2 border-slate-200 max-w-3xl w-full max-h-[85vh] overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b-2 border-slate-200">
            <h4 className="text-lg font-bold text-slate-900">Edit Slide Content</h4>
            <button onClick={onClose} className="px-3 py-1 border-2 border-slate-200 rounded">Close</button>
          </div>
          <div className="p-4 space-y-3">
            {editor ? (
              <>
                <div className="flex items-center gap-2 flex-wrap">
                  <button onClick={()=> editor.chain().focus().toggleBold().run()} className="px-2 py-1 border-2 border-slate-200 rounded text-sm">Bold</button>
                  <button onClick={()=> editor.chain().focus().toggleItalic().run()} className="px-2 py-1 border-2 border-slate-200 rounded text-sm">Italic</button>
                  <button onClick={()=> editor.chain().focus().toggleBulletList().run()} className="px-2 py-1 border-2 border-slate-200 rounded text-sm">• List</button>
                  <button onClick={()=> editor.chain().focus().toggleOrderedList().run()} className="px-2 py-1 border-2 border-slate-200 rounded text-sm">1. List</button>
                  <button onClick={()=> editor.chain().focus().undo().run()} className="px-2 py-1 border-2 border-slate-200 rounded text-sm">Undo</button>
                  <button onClick={()=> editor.chain().focus().redo().run()} className="px-2 py-1 border-2 border-slate-200 rounded text-sm">Redo</button>
                </div>
                <div className="border-2 border-slate-200 rounded p-2">
                  <EditorContent editor={editor} />
                </div>
              </>
            ) : (
              <textarea value={content} onChange={(e)=> setContent(e.target.value)} rows={10} className="w-full px-3 py-2 border-2 border-slate-200 rounded" />
            )}
          </div>
          <div className="px-4 py-3 border-t-2 border-slate-200 flex items-center justify-end gap-2">
            <button onClick={onClose} className="px-4 py-2 border-2 border-slate-200 rounded">Cancel</button>
            <button onClick={save} className="px-4 py-2 bg-emerald-600 text-white rounded">Save</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function escapeHtml(s: string) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}
