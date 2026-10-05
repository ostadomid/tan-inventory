import { SortIcon } from '#/components/sort-icon'
import { Card, CardContent, CardHeader } from '#/components/ui/card'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from '#/components/ui/pagination'
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
import { cn, toJalaliStr } from '#/lib/utils'
import { usePagination } from '@mantine/hooks'
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
    cell(props) {
      const value = props.getValue() as number
      return Math.abs(value)
    },
    filterFn: 'numeral',
  },
  {
    accessorKey: 'ordered_at',
    header: () => <span>زمان سفارش</span>,
    filterFn: 'includeString',
    cell(props) {
      const value = props.getValue() as string
      const [year, month, day, day_name] = value.split('-')
      return (
        <div className="flex flex-col">
          <div dir="rtl" className="flex justify-center items-center gap-0.5">
            <span>{day}</span>
            <span className="text-gray-400">&#47;</span>
            <span>{month}</span>
            <span className="text-gray-400">&#47;</span>
            <span>{year}</span>
            <span className="ps-2 text-xs">{day_name}</span>
          </div>
        </div>
      )
    },
  },
]
function RouteComponent() {
  const { data: orders } = useQuery<Order[]>({
    queryKey: ['logs'],
    queryFn: () =>
      get_orders().then((items) =>
        items.map((o) => ({
          ...o,
          ordered_at: toJalaliStr(o.ordered_at, 'yyyy-MMMM-dd-EEEE'),
        })),
      ),
  })
  const table = useTable({
    data: orders || [],
    features,
    columns,
    initialState: {
      pagination: { pageSize: 15, pageIndex: 0 },
      columnFilters: [{ id: 'card_id', value: '' }],
    },
  })
  const paginate = usePagination({
    total: table.getPageCount(),
    initialPage: 1,
  })

  return (
    <div>
      <Card>
        <CardHeader>لیست سفارشات</CardHeader>
        <CardContent className="space-y-4">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((gh) => (
                <TableRow key={gh.id}>
                  {gh.headers.map((h) => (
                    <TableHead key={h.id}>
                      {h.isPlaceholder ? null : (
                        <div
                          className="flex gap-1 items-center cursor-pointer justify-center"
                          onClick={(e) => {
                            if (h.column.getCanSort()) {
                              h.column.getToggleSortingHandler()?.(e)
                              paginate.setPage(1)
                            }
                          }}
                        >
                          <table.FlexRender header={h} />
                          <SortIcon sort={h.column.getIsSorted()} />
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
                  {row.getAllCells().map((c) => {
                    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
                    const count = c.row.getValue('count') as number
                    return (
                      <TableCell
                        key={c.id}
                        style={{ direction: 'ltr' }}
                        className={cn('text-center', {
                          'bg-rose-100/85': count < 0,
                          'bg-green-100/85': count > 0,
                        })}
                      >
                        <table.FlexRender cell={c} />
                      </TableCell>
                    )
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Pagination className={cn({ hidden: !orders || orders.length == 0 })}>
            <PaginationContent>
              {paginate.range.map((e) =>
                e === 'dots' ? (
                  <PaginationItem key="pagination-elips">
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem
                    key={e}
                    onClick={(_) => {
                      paginate.setPage(e)
                      table.setPageIndex(e - 1)
                    }}
                  >
                    <PaginationLink isActive={paginate.active == e}>
                      {e}
                    </PaginationLink>
                  </PaginationItem>
                ),
              )}
            </PaginationContent>
          </Pagination>
        </CardContent>
      </Card>
    </div>
  )
}
