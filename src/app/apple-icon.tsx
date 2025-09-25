import { ImageResponse } from 'next/og'

// Route segment config
export const runtime = 'edge'

// Image metadata
export const size = {
  width: 180,
  height: 180,
}
export const contentType = 'image/png'

// Image generation
export default function AppleIcon() {
  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          fontSize: 72,
          background: 'linear-gradient(135deg, #1F4D3F 0%, #2D7A6B 50%, #3A9B7A 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          borderRadius: '22px',
          fontWeight: 'bold',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          textAlign: 'center',
          boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.1)',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
          }}
        >
          <div style={{ fontSize: '64px', lineHeight: '1' }}>BS</div>
          <div style={{ fontSize: '16px', opacity: 0.9, fontWeight: 500 }}>Behavior School</div>
        </div>
      </div>
    ),
    // ImageResponse options
    {
      ...size,
    }
  )
}