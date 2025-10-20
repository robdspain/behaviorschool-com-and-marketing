'use client';

import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper, NodeViewProps } from '@tiptap/react';
import { useState } from 'react';
import { X, Settings } from 'lucide-react';

export const ImageWithCaption = Node.create({
  name: 'imageWithCaption',

  group: 'block',

  atom: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
      alt: {
        default: null,
      },
      title: {
        default: null,
      },
      caption: {
        default: null,
      },
      width: {
        default: '100%',
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'figure[data-type="image-with-caption"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'figure',
      { 'data-type': 'image-with-caption', class: 'image-with-caption' },
      [
        'img',
        mergeAttributes(HTMLAttributes, {
          draggable: false,
          contenteditable: false,
        }),
      ],
      HTMLAttributes.caption
        ? ['figcaption', { class: 'caption' }, HTMLAttributes.caption]
        : '',
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageWithCaptionView);
  },
});

function ImageWithCaptionView({ node, updateAttributes, deleteNode }: NodeViewProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [caption, setCaption] = useState(node.attrs.caption || '');
  const [alt, setAlt] = useState(node.attrs.alt || '');
  const [width, setWidth] = useState(node.attrs.width || '100%');

  const handleSave = () => {
    updateAttributes({
      caption,
      alt,
      width,
    });
    setShowSettings(false);
  };

  return (
    <NodeViewWrapper className="image-with-caption-wrapper my-4">
      <figure className="relative group">
        <div className="relative">
          <img
            src={node.attrs.src}
            alt={node.attrs.alt || ''}
            title={node.attrs.title || ''}
            style={{ width: node.attrs.width || '100%', height: 'auto' }}
            className="rounded-lg max-w-full"
          />
          
          {/* Controls overlay */}
          <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 bg-white rounded-lg shadow-lg hover:bg-slate-50 transition-colors"
              title="Settings"
            >
              <Settings className="w-4 h-4 text-slate-700" />
            </button>
            <button
              onClick={deleteNode}
              className="p-2 bg-white rounded-lg shadow-lg hover:bg-red-50 transition-colors"
              title="Remove"
            >
              <X className="w-4 h-4 text-red-600" />
            </button>
          </div>
        </div>

        {node.attrs.caption && !showSettings && (
          <figcaption className="text-sm text-slate-600 text-center mt-2 italic">
            {node.attrs.caption}
          </figcaption>
        )}

        {/* Settings Panel */}
        {showSettings && (
          <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Caption
                </label>
                <input
                  type="text"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Image caption"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Alt Text (for accessibility)
                </label>
                <input
                  type="text"
                  value={alt}
                  onChange={(e) => setAlt(e.target.value)}
                  placeholder="Describe the image"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Width
                </label>
                <select
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="100%">Full width</option>
                  <option value="75%">75%</option>
                  <option value="50%">50%</option>
                  <option value="33%">33%</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm font-medium"
                >
                  Save
                </button>
                <button
                  onClick={() => setShowSettings(false)}
                  className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 text-sm font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </figure>
    </NodeViewWrapper>
  );
}

