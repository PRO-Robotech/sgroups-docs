import React, { useEffect, useRef } from 'react'
import { Fancybox as NativeFancybox } from '@fancyapps/ui'
import '@fancyapps/ui/dist/fancybox/fancybox.css'

export default function Root({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    NativeFancybox.bind(container, '[data-fancybox]', {
      Carousel: { infinite: false },
      animated: true,
      showClass: 'fancybox-fadeIn',
      hideClass: 'fancybox-fadeOut',
    })

    return () => {
      NativeFancybox.unbind(container)
      NativeFancybox.close()
    }
  }, [])

  useEffect(() => {
    function wrapImages() {
      const container = containerRef.current
      if (!container) return

      container.querySelectorAll('article img').forEach((img: Element) => {
        const imgEl = img as HTMLImageElement
        if (imgEl.closest('[data-fancybox]') || imgEl.dataset.wrapped) return
        imgEl.dataset.wrapped = 'true'

        const a = document.createElement('a')
        a.setAttribute('data-fancybox', 'gallery')
        a.setAttribute('href', imgEl.src)
        a.style.cursor = 'zoom-in'
        imgEl.parentNode?.insertBefore(a, imgEl)
        a.appendChild(imgEl)
      })
    }

    wrapImages()
    const observer = new MutationObserver(() => wrapImages())
    observer.observe(document.body, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [])

  return <div ref={containerRef}>{children}</div>
}
