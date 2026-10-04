import { Card, CardContent, CardHeader } from '#/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#/components/ui/table'
import type { Order } from '#/lib/actions'
import { get_orders } from '#/lib/actions'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import {
  columnFilteringFeature,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFn_equals,
  filterFn_includesString,
  rowPaginationFeature,
  rowSortingFeature,
  tableFeatures,
  useTable,
} from '@tanstack/react-table'
import type { ColumnDef } from '@tanstack/react-table'

export const Route = createFileRoute('/dashboard/logs')({
  component: RouteComponent,
})

const features = tableFeatures({
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  columnFilteringFeature,
  filteredRowModel: createFilteredRowModel(),
  filterFns: {
    includeString: filterFn_includesString,
    numeral: filterFn_equals,
  },
})
const columns: Array<ColumnDef<typeof features, Order>> = [
  {
    accessorKey: 'card_id',
    header: () => <span>کارت</span>,
    filterFn: 'includeString',
  },
  {
    accessorKey: 'count',
    header: () => <span>تعداد سفارش</span>,
    filterFn: 'numeral',
  },
  {
    accessorKey: 'ordered_at',
    header: () => <span>زمان سفارش</span>,
    filterFn: 'includeString',
  },
]
function RouteComponent() {
  const { data: orders } = useQuery<Order[]>({
    queryKey: ['orders'],
    queryFn: get_orders,
  })
  const table = useTable({
    data: orders || [],
    features,
    columns,
    initialState: {
      pagination: { pageSize: 10, pageIndex: 0 },
      columnFilters: [{ id: 'card_id', value: '' }],
    },
  })

  return (
    <div>
      <Card>
        <CardHeader>لیست سفارشات</CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((gh) => (
                <TableRow key={gh.id}>
                  {gh.headers.map((h) => (
                    <TableHead key={h.id}>
                      {h.isPlaceholder ? null : (
                        <div
                          onClick={(e) => {
                            if (h.column.getCanSort()) {
                              h.column.getToggleSortingHandler()?.(e)
                            }
                          }}
                        >
                          <table.FlexRender header={h} />
                        </div>
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getAllCells().map((c) => (
                    <TableCell key={c.id}>
                      <table.FlexRender cell={c} />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
