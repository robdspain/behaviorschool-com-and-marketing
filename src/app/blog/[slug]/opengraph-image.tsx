import { ImageResponse } from 'next/og';
import { getPostBySlug } from '@/lib/ghost';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug, { include: 'tags,authors', formats: 'html,plaintext' });
  const title = post?.title || 'Behavior School';

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          background: 'linear-gradient(135deg, #eef2ff 0%, #e0f2fe 100%)',
          padding: '72px',
          fontFamily: 'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial',
        }}
      >
        <div
          style={{
            fontSize: 52,
            fontWeight: 700,
            color: '#0f172a',
            lineHeight: 1.2,
            maxWidth: 960,
            whiteSpace: 'pre-wrap',
          }}
        >
          {title}
        </div>
        <div style={{ marginTop: 24, fontSize: 28, color: '#334155', fontWeight: 500 }}>Behavior School</div>
      </div>
    ),
    {
      ...size,
    }
  );
}


