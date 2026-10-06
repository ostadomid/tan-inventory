import { createFileRoute } from '@tanstack/react-router'
import { Calendar } from 'react-multi-date-picker'
import persian from 'react-date-object/calendars/persian'
import persian_fa from 'react-date-object/locales/persian_fa'
import { format } from 'date-fns-jalali'
import { useDebouncedCallback, usePagination, useMounted } from '@mantine/hooks'
import {
  useTable,
  tableFeatures,
  createPaginatedRowModel,
  createSortedRowModel,
  rowSortingFeature,
  rowPaginationFeature,
  columnFilteringFeature,
  createFilteredRowModel,
  filterFn_includesString,
} from '@tanstack/react-table'
import type { ColumnDef } from '@tanstack/react-table'

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import { Button } from '#/components/ui/button'
import { useForm } from '@tanstack/react-form'
import { addOrderValidator } from '#/lib/validators'
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from '#/components/ui/field'
import { Input } from '#/components/ui/input'
import type { StockSummary } from '#/lib/actions'
import { add_new_order, get_card_ids, get_stock } from '#/lib/actions'
import { useQuery } from '@tanstack/react-query'

import { cn, convert_to_gregorian_sting } from '#/lib/utils'
import { toast } from '#/components/ui/toast'
import { RadioGroup, RadioGroupItem } from '#/components/ui/radio-group'
import ComboboxCreatable from '#/components/shadcn-space/combobox/combobox-10'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#/components/ui/table'
import { SortIcon } from '#/components/sort-icon'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '#/components/ui/tabs'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from '#/components/ui/pagination'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '#/components/ui/input-group'
import { Search, XCircle } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

export const Route = createFileRoute('/dashboard/inventory')({
  async loader({ context }) {
    await context.queryClient.query<string[]>({
      queryKey: ['cardIds'],
      queryFn: get_card_ids,
    })
  },
  component: RouteComponent,
})

const features = tableFeatures({
  rowSortingFeature,
  rowPaginationFeature,
  columnFilteringFeature,
  paginatedRowModel: createPaginatedRowModel(),
  sortedRowModel: createSortedRowModel(),
  filteredRowModel: createFilteredRowModel(),
  filterFns: {
    includeString: filterFn_includesString,
  },
})
const columns: Array<ColumnDef<typeof features, StockSummary>> = [
  {
    accessorKey: 'card_id',
    header: () => <div className="text-start">کارت</div>,
    filterFn: 'includeString',
  },
  {
    accessorKey: 'sum',
    header: () => <div className="text-start">موجودی</div>,
    cell(props) {
      const count = props.getValue() as number

      return <span>{count}</span>
    },
  },
]

function RouteComponent() {
  const isMounted = useMounted()
  const searchInputRef = useRef<HTMLInputElement | null>(null)
  const { data: cardIds, isFetching: fetchingCards } = useQuery<string[]>({
    queryKey: ['cardIds'],
    queryFn: get_card_ids,
  })
  const {
    data: stockSummary,
    refetch: refetchSummary,
    isFetching: fetchingStockSummary,
  } = useQuery<StockSummary[]>({
    queryKey: ['summary'],
    queryFn: get_stock,
  })

  const table = useTable({
    features,
    columns,
    data: stockSummary || [],
    initialState: {
      pagination: { pageIndex: 0, pageSize: 10 },
    },
  })

  const paginate = usePagination({
    total: table.getPageCount(),
    initialPage: 1,
  })
  const form = useForm({
    defaultValues: {
      cardId: '',
      count: 0,
      type: 'out',
      orderedAt: format(new Date(), 'yyyy-MM-dd'),
    },
    validators: {
      onChange: addOrderValidator,
    },
    async onSubmit({ value: { cardId, count, orderedAt, type } }) {
      const result = await add_new_order({
        data: {
          cardId,
          count,
          type: type as any,
          orderedAt: convert_to_gregorian_sting(orderedAt),
        },
      })
      if (result.ok) {
        const lastValueForType = form.getFieldValue('type')
        form.reset()
        form.setFieldValue('type', lastValueForType)
        toast.add({
          title: `سفارش جدید ثبت شد`,
          type: 'success',
        })
        refetchSummary({ cancelRefetch: true })
        table.resetSorting()
      } else {
        toast.add({
          title: result.msg,
          type: 'error',
        })
      }
    },
  })

  const setCardIdColumnFilter = useDebouncedCallback((value: string) => {
    table.getColumn('card_id')?.setFilterValue(value)
    table.resetSorting()
    paginate.setPage(1)
  }, 100)

  // useEffect(() => {
  //   if (search) {
  //     setCardIdColumnFilter(search)
  //   } else {
  //     table.resetColumnFilters()
  //   }
  //   return () => setCardIdColumnFilter.cancel()
  // }, [search])
  const [search, setSearch] = useState('')
  useEffect(() => {
    setCardIdColumnFilter(search)
    return () => setCardIdColumnFilter.cancel()
  }, [search])

  return (
    <div className="space-y-6">
      <Tabs
        defaultValue="one"
        className={cn({ 'opacity-25': fetchingCards || fetchingStockSummary })}
      >
        <TabsList className="bg-gray-300/45">
          <TabsTrigger value="one">سفارش جدید</TabsTrigger>
          <TabsTrigger value="two">موجودی انبار</TabsTrigger>
        </TabsList>
        <TabsContent value="one">
          <Card>
            <CardHeader>
              <CardTitle>ثبت سفارش جدید</CardTitle>
            </CardHeader>
            <CardContent>
              <form
                id="add-to-inventory-form"
                onSubmit={(e) => {
                  e.preventDefault()
                  form.handleSubmit()
                }}
              >
                <FieldGroup className="grid sm:grid-cols-2 gap-x-2 gap-y-4">
                  <form.Field name="cardId">
                    {(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid
                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor={field.name}>کد کارت</FieldLabel>

                          <ComboboxCreatable
                            initialItems={cardIds || []}
                            value={field.state.value}
                            triggerLabel="انتخاب کنید"
                            placeHolder="جستجو یا ایجاد کارت"
                            onValueChange={(cardId: string | null) => {
                              field.handleChange(cardId || '')
                            }}
                          />

                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </Field>
                      )
                    }}
                  </form.Field>
                  <form.Field name="count">
                    {(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid
                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor={field.name}>تعداد</FieldLabel>
                          <Input
                            dir="ltr"
                            className="text-center!"
                            id={field.name}
                            name={field.name}
                            inputMode="numeric"
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onFocus={(e) => {
                              e.target.select()
                            }}
                            onChange={(e) => {
                              if (isNaN(parseInt(e.target.value))) {
                                field.handleChange(0)
                              } else {
                                field.handleChange(parseInt(e.target.value))
                              }
                            }}
                            aria-invalid={isInvalid}
                            autoComplete="off"
                          />
                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </Field>
                      )
                    }}
                  </form.Field>
                  <form.Field name="type">
                    {(field) => (
                      <Field>
                        <FieldLabel>نوع سفارش</FieldLabel>
                        <RadioGroup
                          value={field.state.value}
                          onValueChange={field.handleChange}
                        >
                          <FieldLabel
                            htmlFor="out"
                            className="has-data-checked:border-red-200"
                          >
                            <Field
                              orientation="horizontal"
                              className=" rounded-md has-data-checked:bg-red-200  hoevr:bg-red-300"
                            >
                              <FieldContent>
                                <FieldTitle>فروش</FieldTitle>
                              </FieldContent>
                              <RadioGroupItem
                                value="out"
                                id="out"
                                className="data-checked:bg-red-400 data-checked:border-red-400"
                              />
                            </Field>
                          </FieldLabel>
                          <FieldLabel
                            htmlFor="in"
                            className="col-start-2 has-data-checked:border-green-200"
                          >
                            <Field
                              orientation="horizontal"
                              className=" rounded-md has-data-checked:bg-green-200  hoevr:bg-green-300"
                            >
                              <FieldContent>
                                <FieldTitle>خرید</FieldTitle>
                              </FieldContent>
                              <RadioGroupItem
                                value="in"
                                id="in"
                                className="data-checked:bg-green-400 data-checked:border-green-400"
                              />
                            </Field>
                          </FieldLabel>
                        </RadioGroup>
                      </Field>
                    )}
                  </form.Field>
                  <form.Field name="orderedAt">
                    {(field) => {
                      return (
                        <Field className="isolate col-span-2 items-center">
                          <FieldLabel>زمان سفارش</FieldLabel>
                          {isMounted ? (
                            <Calendar
                              calendar={persian}
                              locale={persian_fa}
                              value={field.state.value}
                              onChange={(e) => {
                                field.handleChange(
                                  e?.format('YYYY-MM-DD') || '',
                                )
                              }}
                            />
                          ) : (
                            <div className="h-70 w-full max-w-75 animate-pulse rounded-md bg-muted" />
                          )}
                        </Field>
                      )
                    }}
                  </form.Field>
                </FieldGroup>
              </form>
            </CardContent>
            <CardFooter className="justify-end">
              <form.Subscribe selector={(s) => s.isFormValid}>
                {(isValid) => (
                  <Button
                    variant="default"
                    form="add-to-inventory-form"
                    className="px-8"
                    type="submit"
                    disabled={!isValid}
                  >
                    ثبت انبار
                  </Button>
                )}
              </form.Subscribe>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="two">
          <Card className="mb-8">
            <CardHeader>موجودی کارت ها</CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <InputGroup>
                  <InputGroupInput
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <InputGroupAddon>
                    <Search size={12} />
                  </InputGroupAddon>
                  <InputGroupAddon
                    className="cursor-pointer"
                    align={'inline-end'}
                    onClick={(_e) => {
                      setSearch('')
                    }}
                  >
                    <XCircle size={12} />
                  </InputGroupAddon>
                </InputGroup>
              </div>
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((gh) => (
                    <TableRow key={gh.id}>
                      {gh.headers.map((h) => (
                        <TableHead key={h.id}>
                          {h.isPlaceholder ? null : (
                            <div
                              className="flex gap-1 items-center cursor-pointer"
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
                        const sum = c.row.getValue('sum') as number

                        return (
                          <TableCell
                            key={c.id}
                            className={cn({
                              'bg-rose-100/85': sum <= 100,
                              'bg-amber-100/85': sum > 100 && sum <= 250,
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
              <Pagination>
                <PaginationContent>
                  {paginate.range.map((e) =>
                    e === 'dots' ? (
                      <PaginationItem key="pagination-elips">
                        <PaginationEllipsis />{' '}
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
        </TabsContent>
      </Tabs>
    </div>
  )
}
