import type { SortDirection } from '@tanstack/react-table'
import {
  ArrowDownNarrowWide,
  ArrowUpDown,
  ArrowUpNarrowWide,
} from 'lucide-react'

type Props = { sort: false | SortDirection }
export function SortIcon({ sort }: Props) {
  if (sort === false) return <ArrowUpDown size={16} className="text-gray-600" />
  return sort === 'desc' ? (
    <ArrowDownNarrowWide size={16} className="text-gray-600" />
  ) : (
    <ArrowUpNarrowWide size={16} className="text-gray-600" />
  )
}
