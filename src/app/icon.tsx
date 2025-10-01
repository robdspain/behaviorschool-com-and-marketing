import { ImageResponse } from 'next/og'

// Route segment config
export const runtime = 'edge'

// Image metadata
export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      // ImageResponse JSX element with logo-inspired design
      <div
        style={{
          background: 'linear-gradient(135deg, #1F4D3F 0%, #2D7A6B 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          borderRadius: '4px',
        }}
      >
        {/* Grid lines background */}
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            background: `
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(0deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '6px 6px',
          }}
        />
        {/* Upward arrow */}
        <div
          style={{
            width: '0',
            height: '0',
            borderLeft: '8px solid transparent',
            borderRight: '8px solid transparent',
            borderBottom: '12px solid #F7F7F7',
            position: 'absolute',
            top: '6px',
            right: '6px',
            transform: 'rotate(45deg)',
          }}
        />
        {/* Data point circles */}
        <div
          style={{
            width: '4px',
            height: '4px',
            borderRadius: '50%',
            background: '#F7F7F7',
            position: 'absolute',
            top: '10px',
            left: '8px',
          }}
        />
        <div
          style={{
            width: '4px',
            height: '4px',
            borderRadius: '50%',
            background: '#F7F7F7',
            position: 'absolute',
            bottom: '8px',
            left: '14px',
          }}
        />
      </div>
    ),
    // ImageResponse options
    {
      ...size,
    }
  )
}