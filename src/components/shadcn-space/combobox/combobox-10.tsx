'use client'

import { useId, useRef, useState, useEffect } from 'react'

import { CheckIcon, ChevronsUpDownIcon, PlusIcon } from 'lucide-react'

import { Badge } from '#/components/ui/badge.tsx'
import { Button } from '#/components/ui/button.tsx'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '#/components/ui/command.tsx'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '#/components/ui/popover.tsx'
import { cn } from '#/lib/utils.ts'

type Props = {
  initialItems: string[]
  value: string
  triggerLabel: string
  placeHolder: string
  onValueChange: (value: string) => void
}
const ComboboxCreatable = ({
  initialItems,
  value,
  triggerLabel,
  placeHolder,
  onValueChange,
}: Props) => {
  const id = useId()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [items, setItems] = useState(initialItems)
  // const [value, setValue] = useState(value)
  const [mounted, setMounted] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  // useEffect(() => {
  //   if (value) {
  //     onValueChange(value)
  //   }
  // }, [value])

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        setMounted(true)
        console.log({ searchInputRef })
        searchInputRef.current?.focus({ focusVisible: true })
      }, 50)
      return () => clearTimeout(timer)
    } else {
      setMounted(false)
    }
  }, [open])

  const selected = items.find((e) => e === value)

  const trimmed = query.trim()
  const exactMatch = items.some(
    (e) => e.toLowerCase() === trimmed.toLowerCase(),
  )
  const showCreate = trimmed.length > 0 && !exactMatch

  const handleCreate = () => {
    const newItem = trimmed.toUpperCase().replace(/\s+/g, '-')
    setItems((prev) => [...prev, newItem])
    onValueChange(newItem)
    setQuery('')
    setOpen(false)
  }

  return (
    <div className="w-full max-w-xs">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          render={
            <Button
              id={id}
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="bg-background hover:bg-background border-input w-full justify-between px-3 font-normal outline-offset-0 outline-none focus-visible:outline-2 cursor-pointer"
            >
              {selected ? (
                <span className="truncate">{selected}</span>
              ) : (
                <span className="text-muted-foreground">{triggerLabel}</span>
              )}
              <ChevronsUpDownIcon
                className="text-muted-foreground/80 shrink-0 size-4"
                aria-hidden="true"
              />
            </Button>
          }
        />
        <PopoverContent
          className="border-input w-full p-0"
          align="start"
          initialFocus={searchInputRef}
        >
          {mounted && (
            <Command>
              <CommandInput
                ref={searchInputRef}
                placeholder={placeHolder}
                value={query}
                onValueChange={setQuery}
              />
              <CommandList>
                <CommandEmpty className={cn(showCreate && 'hidden')}>
                  چیزی پیدا نشد!
                </CommandEmpty>
                <CommandGroup>
                  {items.map((item) => (
                    <CommandItem
                      key={item}
                      value={item}
                      onSelect={() => {
                        // setValue(item === value ? '' : item)
                        onValueChange(item)
                        setQuery('')
                        setOpen(false)
                      }}
                      className="[&>svg:last-of-type]:hidden"
                    >
                      <span className="flex grow items-center gap-2">
                        {item}
                      </span>
                      <CheckIcon
                        className={cn(
                          'size-4 transition-opacity',
                          value === item ? 'opacity-100' : 'opacity-0',
                        )}
                      />
                    </CommandItem>
                  ))}
                  {showCreate && (
                    <CommandItem
                      value={`__create__${trimmed}`}
                      onSelect={handleCreate}
                      className="[&>svg:last-of-type]:hidden text-muted-foreground"
                    >
                      <PlusIcon className="size-4 shrink-0" />
                      ایجاد
                      <Badge
                        variant="secondary"
                        className="ml-1 rounded px-1.5 py-0 font-medium leading-5"
                      >
                        {trimmed}
                      </Badge>
                    </CommandItem>
                  )}
                </CommandGroup>
              </CommandList>
            </Command>
          )}
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default ComboboxCreatable
