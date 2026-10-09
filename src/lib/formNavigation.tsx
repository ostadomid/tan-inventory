import React, { createContext, useContext, useMemo } from 'react'

type ContextValue = {
  register: (fieldName: string, focus: () => void) => () => void
  focusNext: (currentFieldName: string) => void
}
const formNavigationContext = createContext<ContextValue | null>(null)

export function FormNavigationProvider({
  order,
  children,
}: {
  children: React.ReactNode
  order: string[]
}) {
  const map: Map<string, () => void> = useMemo(() => new Map(), [])

  const value: ContextValue = {
    register(fieldName, focus) {
      if (!map.get(fieldName)) {
        map.set(fieldName, focus)
      }
      return () => {
        console.log('deleteing from Map ', fieldName)
        map.delete(fieldName)
      }
    },
    focusNext(currentFieldName) {
      console.log('Inside focusNext------')
      console.log('Current filed name = ', currentFieldName)
      const index = order.findIndex((e) => e === currentFieldName)

      console.log({ order, index })
      if (index >= 0 && index < order.length - 1) {
        console.log('Finding proper function for ' + order[index + 1])
        console.log('Map size = ', map.size)
        for (const k of map.keys()) {
          console.log(k)
        }
        const fn = map.get(order[index + 1])
        fn?.()
        console.log('End of focusNext------')
      }
    },
  }
  return (
    <formNavigationContext.Provider value={value}>
      {children}
    </formNavigationContext.Provider>
  )
}
export const useNavigationForm = () => {
  const ctx = useContext(formNavigationContext)
  if (!ctx) {
    throw 'No Context Found'
  }
  return ctx
}
