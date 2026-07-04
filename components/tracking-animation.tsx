'use client'

import { DotLottieReact } from '@lottiefiles/dotlottie-react'

export function TrackingAnimation({ className }: { className?: string }) {
  return (
    <DotLottieReact
      src="/animations/tracking.json"
      autoplay
      loop
      className={className}
      aria-label="Ilustração animada de trabalho em equipe e acompanhamento de progresso"
      role="img"
    />
  )
}
