import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#/components/ui/table'
import { useDebouncedCallback } from '@mantine/hooks'
import { createFileRoute } from '@tanstack/react-router'
import {
  columnFilteringFeature,
  createFilteredRowModel,
  filterFn_includesString,
  globalFilteringFeature,
  tableFeatures,
  useTable,
} from '@tanstack/react-table'
import type { ColumnDef } from '@tanstack/react-table'
import { useState } from 'react'

import { useQuery } from '@tanstack/react-query'
import { get_orders } from '#/lib/actions'
import type { Order } from '#/lib/actions'
import { toJalaliStr } from '#/lib/utils'

export const Route = createFileRoute('/global')({
  component: RouteComponent,
})

const features = tableFeatures({
  // rowPaginationFeature,
  // paginatedRowModel: createPaginatedRowModel(),
  // rowSortingFeature,
  // sortedRowModel: createSortedRowModel(),
  columnFilteringFeature,
  globalFilteringFeature,
  filteredRowModel: createFilteredRowModel(),
  filterFns: {
    includeString: filterFn_includesString,
  },
})

const columns: Array<ColumnDef<typeof features, Order>> = [
  { accessorKey: 'card_id', header: 'کارت', filterFn: 'includeString' },
  { accessorKey: 'count', header: 'تعداد', filterFn: 'includeString' },
  {
    accessorKey: 'ordered_at',
    header: 'زمان سفارش',
    filterFn: 'includeString',
  },
]

function RouteComponent() {
  const { data } = useQuery({
    queryKey: ['lab', 'logs'],
    queryFn: () =>
      get_orders().then((orders) =>
        orders.map((o) => ({
          ...o,
          ordered_at: toJalaliStr(o.ordered_at, 'yyyy-MMMM-dd-EEEE'),
        })),
      ),
  })
  const [search, setSearch] = useState('')
  const table = useTable({
    features,
    columns,
    data: data || [],
    initialState: {
      globalFilter: '',
    },
  })
  const setGlobalFilter = useDebouncedCallback((term: string) => {
    table.setGlobalFilter(term)
  }, 100)

  return (
    <div className="max-w-lg mx-auto p-4 space-y-4">
      <input
        className="rounded-lg border border-rose-300 px-4 py-1"
        value={search}
        onChange={(e) => {
          const newSearch = e.target.value.trim()
          setGlobalFilter(newSearch)
          setSearch(newSearch)
        }}
      />
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((hg) => (
            <TableRow key={hg.id}>
              {hg.headers.map((h) => (
                <TableHead key={h.id}>
                  <table.FlexRender header={h} />
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getAllCells().map((cell) => (
                <TableCell key={cell.id}>
                  <table.FlexRender cell={cell} />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
