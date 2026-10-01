import { createFileRoute } from '@tanstack/react-router'
import { Calendar } from 'react-multi-date-picker'
import persian from 'react-date-object/calendars/persian'
import persian_fa from 'react-date-object/locales/persian_fa'
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
  FieldError,
  FieldGroup,
  FieldLabel,
} from '#/components/ui/field'
import { Input } from '#/components/ui/input'
import { get_card_ids } from '#/lib/actions'
import { useQuery } from '@tanstack/react-query'
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '#/components/ui/combobox'
import { DirectionProvider } from '#/components/ui/direction'

export const Route = createFileRoute('/dashboard/inventory')({
  async loader({ context }) {
    await context.queryClient.query<string[]>({
      queryKey: ['cardIds'],
      queryFn: get_card_ids,
    })
  },
  component: RouteComponent,
})

function RouteComponent() {
  const form = useForm({
    defaultValues: {
      cardId: '',
      count: 0,
      orderedAt: new Date().toISOString().substring(0, 10),
    },
    validators: {
      onChange: addOrderValidator,
    },
  })
  const { data: cardIds } = useQuery<string[]>({
    queryKey: ['cardIds'],
    queryFn: get_card_ids,
  })
  return (
    <div className="space-y-6">
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

                      <Combobox
                        items={cardIds}
                        value={field.state.value}
                        onValueChange={(cardId: string | null) => {
                          field.handleChange(cardId || '')
                        }}
                      >
                        <ComboboxInput
                          placeholder="انتخاب کنید"
                          style={{ textAlign: 'center' }}
                        />
                        <ComboboxContent dir="ltr">
                          <ComboboxEmpty>
                            کارتی برای انتخاب وجود ندارد
                          </ComboboxEmpty>
                          <ComboboxList>
                            {(item: string) => (
                              <ComboboxItem key={item} value={item}>
                                {item}
                              </ComboboxItem>
                            )}
                          </ComboboxList>
                        </ComboboxContent>
                      </Combobox>

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
              <form.Field name="orderedAt">
                {(field) => {
                  return (
                    <Field>
                      <FieldLabel>زمان سفارش</FieldLabel>
                      <Calendar
                        calendar={persian}
                        locale={persian_fa}
                        value={field.state.value}
                        onChange={(e) => {
                          field.handleChange(e?.format('YYYY-MM-DD') || '')
                        }}
                      />
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
      <form.Subscribe
        selector={(s) => ({ cardId: s.values.cardId, count: s.values.count })}
      >
        {(value) => <pre dir="ltr">{JSON.stringify(value, null, 2)}</pre>}
      </form.Subscribe>
      <pre dir="ltr">{JSON.stringify(form.state.values, null, 2)}</pre>
    </div>
  )
}
