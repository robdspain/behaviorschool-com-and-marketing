'use client';

import { Editor } from '@tiptap/react';
import { useState, forwardRef, useImperativeHandle } from 'react';
import {
  Type,
  Image as ImageIcon,
  Youtube,
  Code,
  Table,
  Minus,
  Phone,
  MousePointer,
  Images,
} from 'lucide-react';

interface CommandItem {
  title: string;
  description: string;
  icon: React.ReactNode;
  command: (editor: Editor) => void;
}

interface SlashCommandMenuProps {
  editor: Editor;
  onInsertGallery: () => void;
  onAddCTA: () => void;
  onAddContact: () => void;
}

export interface SlashCommandMenuRef {
  onKeyDown: (props: { event: KeyboardEvent }) => boolean;
}

export const SlashCommandMenu = forwardRef<SlashCommandMenuRef, SlashCommandMenuProps>(
  ({ editor, onInsertGallery, onAddCTA, onAddContact }, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const commands: CommandItem[] = [
      {
        title: 'Heading 2',
        description: 'Large section heading',
        icon: <Type className="w-4 h-4" />,
        command: (editor) => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      },
      {
        title: 'Heading 3',
        description: 'Medium section heading',
        icon: <Type className="w-4 h-4" />,
        command: (editor) => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      },
      {
        title: 'Image',
        description: 'Upload an image',
        icon: <ImageIcon className="w-4 h-4" />,
        command: () => {
          const input = document.createElement('input');
          input.type = 'file';
          input.accept = 'image/*';
          input.onchange = async (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (!file) return;

            const formData = new FormData();
            formData.append('file', file);

            try {
              const response = await fetch('/api/admin/blog/images', {
                method: 'POST',
                body: formData,
              });
              const result = await response.json();
              if (result.success && result.images?.[0]) {
                editor.chain().focus().setImage({ src: result.images[0].url }).run();
              }
            } catch (error) {
              console.error('Error uploading image:', error);
            }
          };
          input.click();
        },
      },
      {
        title: 'Gallery',
        description: 'Multiple images in a grid',
        icon: <Images className="w-4 h-4" />,
        command: () => onInsertGallery(),
      },
      {
        title: 'YouTube',
        description: 'Embed a YouTube video',
        icon: <Youtube className="w-4 h-4" />,
        command: (editor) => {
          const url = prompt('Enter YouTube URL:');
          if (url) {
            editor.chain().focus().setYoutubeVideo({ src: url }).run();
          }
        },
      },
      {
        title: 'Code Block',
        description: 'Code snippet with syntax highlighting',
        icon: <Code className="w-4 h-4" />,
        command: (editor) => editor.chain().focus().toggleCodeBlock().run(),
      },
      {
        title: 'Table',
        description: 'Insert a table',
        icon: <Table className="w-4 h-4" />,
        command: (editor) =>
          editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(),
      },
      {
        title: 'Divider',
        description: 'Horizontal line',
        icon: <Minus className="w-4 h-4" />,
        command: (editor) => editor.chain().focus().setHorizontalRule().run(),
      },
      {
        title: 'Call to Action',
        description: 'Add a CTA button',
        icon: <MousePointer className="w-4 h-4" />,
        command: () => onAddCTA(),
      },
      {
        title: 'Contact',
        description: 'Add contact link',
        icon: <Phone className="w-4 h-4" />,
        command: () => onAddContact(),
      },
    ];

    const filteredCommands = commands;

    const selectItem = (index: number) => {
      const item = filteredCommands[index];
      if (item) {
        item.command(editor);
      }
    };

    const upHandler = () => {
      setSelectedIndex((selectedIndex + filteredCommands.length - 1) % filteredCommands.length);
    };

    const downHandler = () => {
      setSelectedIndex((selectedIndex + 1) % filteredCommands.length);
    };

    const enterHandler = () => {
      selectItem(selectedIndex);
    };

    useImperativeHandle(ref, () => ({
      onKeyDown: ({ event }) => {
        if (event.key === 'ArrowUp') {
          upHandler();
          return true;
        }

        if (event.key === 'ArrowDown') {
          downHandler();
          return true;
        }

        if (event.key === 'Enter') {
          enterHandler();
          return true;
        }

        return false;
      },
    }));

    return (
      <div className="bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden w-72">
        {filteredCommands.length > 0 ? (
          <div className="max-h-80 overflow-y-auto">
            {filteredCommands.map((item, index) => (
              <button
                key={index}
                className={`w-full px-4 py-3 flex items-start gap-3 text-left hover:bg-slate-50 transition-colors ${
                  index === selectedIndex ? 'bg-emerald-50' : ''
                }`}
                onClick={() => selectItem(index)}
              >
                <div className="mt-0.5 text-slate-600">{item.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm text-slate-900">{item.title}</div>
                  <div className="text-xs text-slate-500">{item.description}</div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="px-4 py-6 text-center text-sm text-slate-500">No results found</div>
        )}
      </div>
    );
  }
);

SlashCommandMenu.displayName = 'SlashCommandMenu';

