import { FormNavigationProvider, useNavigationForm } from '#/lib/formNavigation'
import { useMounted } from '@mantine/hooks'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'

export const Route = createFileRoute('/lab')({
  component: RouteComponent,
})

function Select({
  name,
  items,
  value,
  onChange,
}: {
  name: string
  items: string[]
  value: string
  onChange: (value: string) => void
}) {
  const r = useRef<HTMLSelectElement | null>(null)
  const { register, focusNext } = useNavigationForm()
  const isMounted = useMounted()
  useEffect(() => {
    if (!isMounted) return
    return register(name, () => r.current?.focus())
  }, [isMounted])
  return (
    <select
      ref={r}
      value={value}
      onChange={(e) => {
        onChange(e.target.value)
        focusNext(name)
      }}
    >
      {items.map((e) => (
        <option key={e} value={e}>
          {e}
        </option>
      ))}
    </select>
  )
}

function Input({ name }: { name: string }) {
  const { register, focusNext } = useNavigationForm()
  const r = useRef<HTMLInputElement | null>(null)
  const isMounted = useMounted()
  useEffect(() => {
    if (!isMounted) return
    return register(name, () => {
      r.current?.focus()
    })
  }, [isMounted])
  return (
    <div>
      <input
        className="border border-purple-400 rounded-md px-4 py-1 ring-offset-2 ring-1 ring-purple-500"
        ref={r}
        onKeyDown={(e) => {
          if (e.key == 'Enter' || e.key == 'NumpadEnter') {
            e.preventDefault()
            console.log('I am calling focusNext()')
            focusNext(name)
          }
        }}
      />
    </div>
  )
}

function RouteComponent() {
  const [fruit, setFruit] = useState('Cucumber')
  return (
    <div className="flex flex-col gap-2 items-center">
      <FormNavigationProvider order={['email', 'fruit', 'password']}>
        <form className="space-y-3 p-4">
          <Input name="email" />
          <Select
            items={['Apple', 'Banana', 'Cucumber']}
            value={fruit}
            name="fruit"
            onChange={setFruit}
          />
          <Input name="password" />
        </form>
      </FormNavigationProvider>
    </div>
  )
}
