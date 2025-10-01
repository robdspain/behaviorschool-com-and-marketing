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
      // Apple icon with logo-inspired design
      <div
        style={{
          background: 'linear-gradient(135deg, #1F4D3F 0%, #2D7A6B 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          borderRadius: '32px',
        }}
      >
        {/* Grid lines background */}
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            background: `
              linear-gradient(90deg, rgba(255,255,255,0.08) 2px, transparent 2px),
              linear-gradient(0deg, rgba(255,255,255,0.08) 2px, transparent 2px)
            `,
            backgroundSize: '24px 24px',
            borderRadius: '32px',
          }}
        />
        {/* Upward trending arrow - larger for Apple icon */}
        <div
          style={{
            width: '0',
            height: '0',
            borderLeft: '28px solid transparent',
            borderRight: '28px solid transparent',
            borderBottom: '42px solid #F7F7F7',
            position: 'absolute',
            top: '30px',
            right: '30px',
            transform: 'rotate(45deg)',
          }}
        />
        {/* Data point circles - larger for Apple icon */}
        <div
          style={{
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            background: '#F7F7F7',
            position: 'absolute',
            top: '40px',
            left: '40px',
          }}
        />
        <div
          style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            background: '#F7F7F7',
            position: 'absolute',
            bottom: '60px',
            left: '60px',
          }}
        />
        <div
          style={{
            width: '14px',
            height: '14px',
            borderRadius: '50%',
            background: '#F7F7F7',
            position: 'absolute',
            bottom: '40px',
            right: '80px',
          }}
        />
        {/* Simple chart line */}
        <div
          style={{
            position: 'absolute',
            width: '80px',
            height: '4px',
            background: '#F7F7F7',
            bottom: '50px',
            left: '50px',
            transform: 'rotate(15deg)',
            borderRadius: '2px',
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