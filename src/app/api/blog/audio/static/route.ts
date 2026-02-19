import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Strip markdown formatting for TTS
function stripMarkdownForTts(markdown: string): string {
  if (!markdown) return '';
  
  let text = markdown
    // Remove code blocks
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]+`/g, '')
    // Convert headers to text with pauses
    .replace(/^#{1,6}\s+(.+)$/gm, '\n\n$1.\n\n')
    // Remove images
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '')
    // Convert links to just the text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove bold/italic markers
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    // Remove horizontal rules
    .replace(/^[-*_]{3,}$/gm, '')
    // Convert bullet lists
    .replace(/^[\s]*[-*+]\s+/gm, '• ')
    // Convert numbered lists
    .replace(/^[\s]*\d+\.\s+/gm, '')
    // Remove blockquotes marker
    .replace(/^>\s+/gm, '')
    // Clean up HTML that might be in markdown
    .replace(/<[^>]+>/g, '')
    // Clean up whitespace
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]+/g, ' ')
    .trim();
  
  return text;
}

// Split text into chunks
function splitTextIntoChunks(text: string, maxLength: number = 4000): string[] {
  const chunks: string[] = [];
  const paragraphs = text.split('\n\n');
  let currentChunk = '';
  
  for (const paragraph of paragraphs) {
    if (!paragraph.trim()) continue;
    
    if (currentChunk.length + paragraph.length + 2 > maxLength) {
      if (currentChunk) {
        chunks.push(currentChunk.trim());
      }
      if (paragraph.length > maxLength) {
        const sentences = paragraph.match(/[^.!?]+[.!?]+/g) || [paragraph];
        currentChunk = '';
        for (const sentence of sentences) {
          if (currentChunk.length + sentence.length > maxLength) {
            if (currentChunk) chunks.push(currentChunk.trim());
            currentChunk = sentence;
          } else {
            currentChunk += sentence;
          }
        }
      } else {
        currentChunk = paragraph;
      }
    } else {
      currentChunk += (currentChunk ? '\n\n' : '') + paragraph;
    }
  }
  
  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }
  
  return chunks;
}

export async function POST(request: NextRequest) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: 'Audio generation not configured' },
      { status: 500 }
    );
  }
  
  try {
    const { slug, title, content } = await request.json();
    
    if (!slug || !content) {
      return NextResponse.json(
        { error: 'Missing required fields: slug, content' },
        { status: 400 }
      );
    }
    
    // Check if audio already exists
    const audioDir = path.join(process.cwd(), 'public', 'audio', 'blog');
    const audioPath = path.join(audioDir, `${slug}.mp3`);
    
    if (fs.existsSync(audioPath)) {
      return NextResponse.json({
        audioUrl: `/audio/blog/${slug}.mp3`,
        cached: true,
      });
    }
    
    // Prepare text for TTS
    const cleanContent = stripMarkdownForTts(content);
    const fullText = title ? `${title}.\n\n${cleanContent}` : cleanContent;
    
    // Split into chunks
    const chunks = splitTextIntoChunks(fullText);
    
    if (chunks.length === 0) {
      return NextResponse.json(
        { error: 'No content to narrate' },
        { status: 400 }
      );
    }
    
    // Generate audio for each chunk
    const audioBuffers: Buffer[] = [];
    
    for (const chunk of chunks) {
      const response = await openai.audio.speech.create({
        model: 'tts-1-hd',
        voice: 'onyx', // Deep male voice
        input: chunk,
        response_format: 'mp3',
        speed: 0.95, // Slightly slower for clarity
      });
      
      const arrayBuffer = await response.arrayBuffer();
      audioBuffers.push(Buffer.from(arrayBuffer));
    }
    
    // Combine audio buffers
    const combinedBuffer = Buffer.concat(audioBuffers);
    
    // Ensure directory exists
    if (!fs.existsSync(audioDir)) {
      fs.mkdirSync(audioDir, { recursive: true });
    }
    
    // Save the audio file
    fs.writeFileSync(audioPath, combinedBuffer);
    
    return NextResponse.json({
      audioUrl: `/audio/blog/${slug}.mp3`,
      chunks: chunks.length,
      generated: true,
    });
    
  } catch (error) {
    console.error('Audio generation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate audio' },
      { status: 500 }
    );
  }
}
