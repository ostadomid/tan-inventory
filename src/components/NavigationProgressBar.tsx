// app/components/navigation-progress-bar.tsx
import { useRouterState } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

export function NavigationProgressBar() {
  const isLoading = useRouterState({
    select: (state) => state.status === 'pending',
  })

  // برای کنترل انیمیشن و جلوگیری از پرش ناگهانی (Flicker)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    let timeout: NodeJS.Timeout
    if (isLoading) {
      // تاخیر کوتاه اختیاری برای جلوگیری از نمایش لودر در ناوبری‌های لحظه‌ای
      timeout = setTimeout(() => setVisible(true), 50)
    } else {
      setVisible(false)
    }

    return () => clearTimeout(timeout)
  }, [isLoading])

  if (!visible) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-2 bg-transparent overflow-hidden">
      <div className="h-full bg-primary animate-pulse w-full origin-left transition-all duration-300" />
    </div>
  )
}
