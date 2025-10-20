'use client';

import { Node } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react';
import { useState } from 'react';
import { X, Upload } from 'lucide-react';

export const GalleryCard = Node.create({
  name: 'gallery',

  group: 'block',

  atom: true,

  addAttributes() {
    return {
      images: {
        default: [],
      },
      columns: {
        default: 3,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="gallery"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const images = HTMLAttributes.images || [];
    const columns = HTMLAttributes.columns || 3;

    return [
      'div',
      { 'data-type': 'gallery', class: `gallery-grid grid-cols-${columns}` },
      ...images.map((img: { src: string; alt: string }) => [
        'img',
        {
          src: img.src,
          alt: img.alt || '',
          class: 'gallery-image',
        },
      ]),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(GalleryView);
  },
});

interface GalleryImage {
  src: string;
  alt: string;
}

interface GalleryViewProps {
  node: {
    attrs: {
      images: GalleryImage[];
      columns: number;
    };
  };
  updateAttributes: (attrs: { images: GalleryImage[]; columns: number }) => void;
  deleteNode: () => void;
}

function GalleryView({ node, updateAttributes, deleteNode }: GalleryViewProps) {
  const [images, setImages] = useState<GalleryImage[]>(node.attrs.images || []);
  const [columns, setColumns] = useState(node.attrs.columns || 3);
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    const uploadedImages = [];

    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch('/api/admin/blog/images', {
          method: 'POST',
          body: formData,
        });
        const result = await response.json();
        
        if (result.success && result.images?.[0]) {
          uploadedImages.push({
            src: result.images[0].url,
            alt: file.name,
          });
        }
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }

    const newImages = [...images, ...uploadedImages];
    setImages(newImages);
    updateAttributes({ images: newImages, columns });
    setUploading(false);
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    updateAttributes({ images: newImages, columns });
  };

  const updateColumns = (newColumns: number) => {
    setColumns(newColumns);
    updateAttributes({ images, columns: newColumns });
  };

  return (
    <NodeViewWrapper className="gallery-wrapper my-6">
      <div className="border-2 border-dashed border-slate-300 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-medium text-slate-700">Image Gallery</h4>
          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-600">Columns:</label>
            <select
              value={columns}
              onChange={(e) => updateColumns(Number(e.target.value))}
              className="px-2 py-1 border border-slate-300 rounded text-sm"
            >
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
            </select>
            <button
              onClick={deleteNode}
              className="p-1 hover:bg-red-50 rounded transition-colors"
              title="Delete gallery"
            >
              <X className="w-4 h-4 text-red-600" />
            </button>
          </div>
        </div>

        {images.length > 0 ? (
          <div
            className={`grid gap-2 mb-4`}
            style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
          >
            {images.map((img, index) => (
              <div key={index} className="relative group">
                <img
                  src={img.src}
                  alt={img.alt || ''}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <button
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3 text-red-600" />
                </button>
              </div>
            ))}
          </div>
        ) : null}

        <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-emerald-500 hover:bg-emerald-50 transition-colors">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => handleFileUpload(e.target.files)}
            className="hidden"
            disabled={uploading}
          />
          {uploading ? (
            <div className="text-sm text-slate-600">Uploading...</div>
          ) : (
            <>
              <Upload className="w-8 h-8 text-slate-400 mb-2" />
              <div className="text-sm text-slate-600">
                {images.length > 0 ? 'Add more images' : 'Click to upload images'}
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Select multiple files
              </div>
            </>
          )}
        </label>
      </div>
    </NodeViewWrapper>
  );
}

