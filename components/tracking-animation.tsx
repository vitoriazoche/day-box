'use client'

import { DotLottieReact } from '@lottiefiles/dotlottie-react'

export function TrackingAnimation({ className }: { className?: string }) {
  return (
    <DotLottieReact
      src="/animations/tracking.lottie"
      autoplay
      loop
      className={className}
      aria-label="Ilustração animada de acompanhamento de progresso"
      role="img"
    />
  )
}
