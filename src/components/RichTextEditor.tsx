'use client'

import { useState, useEffect } from 'react'

interface RichTextEditorProps {
  content: string
  onChange: (html: string) => void
  placeholder?: string
}

export function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
  const [value, setValue] = useState(content)

  useEffect(() => {
    setValue(content)
  }, [content])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    setValue(newValue)
    onChange(newValue)
  }

  return (
    <textarea
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      className="w-full px-3 py-2 border rounded-lg font-mono text-sm min-h-[120px] focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  )
}
