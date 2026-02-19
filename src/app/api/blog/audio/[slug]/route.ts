import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getPostBySlug } from '@/lib/ghost-hybrid';
import fs from 'fs';
import path from 'path';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Strip HTML and normalize text for TTS
function stripHtmlForTts(html: string): string {
  if (!html) return '';
  
  let text = html
    // Remove script and style tags with their content
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    // Convert common block elements to paragraphs
    .replace(/<\/?(p|div|section|article|header|footer|main|aside|nav)[^>]*>/gi, '\n\n')
    // Convert headings with pauses
    .replace(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/gi, '\n\n$1.\n\n')
    // Convert list items
    .replace(/<li[^>]*>/gi, '\n• ')
    .replace(/<\/li>/gi, '')
    // Convert line breaks
    .replace(/<br\s*\/?>/gi, '\n')
    // Remove all other HTML tags
    .replace(/<[^>]+>/g, '')
    // Decode HTML entities
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8212;/g, '—')
    .replace(/&#8211;/g, '–')
    // Clean up whitespace
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]+/g, ' ')
    .trim();
  
  return text;
}

// Split text into chunks (OpenAI TTS has a 4096 character limit)
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
      // If single paragraph is too long, split by sentences
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

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: 'Audio generation not configured' },
      { status: 500 }
    );
  }
  
  try {
    // Check if audio already exists
    const audioDir = path.join(process.cwd(), 'public', 'audio', 'blog');
    const audioPath = path.join(audioDir, `${slug}.mp3`);
    
    if (fs.existsSync(audioPath)) {
      return NextResponse.json({
        audioUrl: `/audio/blog/${slug}.mp3`,
        cached: true,
      });
    }
    
    // Fetch the blog post content
    const post = await getPostBySlug(slug);
    
    if (!post || !post.html) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }
    
    // Prepare text for TTS
    const title = post.title || '';
    const content = stripHtmlForTts(post.html);
    const fullText = `${title}.\n\n${content}`;
    
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
    
    // Combine audio buffers (simple concatenation for MP3)
    const combinedBuffer = Buffer.concat(audioBuffers);
    
    // Ensure directory exists
    if (!fs.existsSync(audioDir)) {
      fs.mkdirSync(audioDir, { recursive: true });
    }
    
    // Save the audio file
    fs.writeFileSync(audioPath, combinedBuffer);
    
    return NextResponse.json({
      audioUrl: `/audio/blog/${slug}.mp3`,
      duration: chunks.length, // Approximate chunk count
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

// GET returns the audio file if it exists
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  
  const audioPath = path.join(process.cwd(), 'public', 'audio', 'blog', `${slug}.mp3`);
  
  if (!fs.existsSync(audioPath)) {
    return NextResponse.json(
      { error: 'Audio not found. Use POST to generate.' },
      { status: 404 }
    );
  }
  
  const audioBuffer = fs.readFileSync(audioPath);
  
  return new NextResponse(audioBuffer, {
    headers: {
      'Content-Type': 'audio/mpeg',
      'Content-Length': audioBuffer.length.toString(),
      'Cache-Control': 'public, max-age=31536000',
    },
  });
}
