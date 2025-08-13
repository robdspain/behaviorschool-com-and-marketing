'use client'

import { Suspense, lazy } from 'react'
const Spline = lazy(() => import('@splinetool/react-spline'))

interface SplineSceneProps {
  scene?: string
  className?: string
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  const envScene = process.env.NEXT_PUBLIC_SPLINE_SCENE_URL
  const url = scene || envScene || ''
  const isPlaceholder = !url || url.includes('placeholder')
  return (
    <Suspense 
      fallback={
        <div className="w-full h-full flex items-center justify-center">
          <span className="loader"></span>
        </div>
      }
    >
      {isPlaceholder ? (
        <div className={className}>
          <div className="w-full h-full bg-gradient-to-br from-emerald-50 via-white to-blue-50" />
        </div>
      ) : (
        <Spline scene={url} className={className} />
      )}
    </Suspense>
  )
}