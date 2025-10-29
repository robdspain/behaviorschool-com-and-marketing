import { NextRequest } from 'next/server';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: string, data: any) => {
        controller.enqueue(encoder.encode(`event: ${event}\n`));
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };
      send('status', { step: 'queued', progress: 0 });
      await new Promise(r => setTimeout(r, 300));
      send('status', { step: 'running', progress: 30 });
      await new Promise(r => setTimeout(r, 300));
      send('status', { step: 'rendering', progress: 70 });
      await new Promise(r => setTimeout(r, 300));
      send('complete', { id: params.id, progress: 100 });
      controller.close();
    }
  });
  return new Response(stream, { headers: { 'Content-Type':'text/event-stream', 'Cache-Control':'no-cache' } });
}

