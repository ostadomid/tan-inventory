import { createFileRoute } from '@tanstack/react-router'
import { Calendar } from 'react-multi-date-picker'
import persian from 'react-date-object/calendars/persian'
import persian_fa from 'react-date-object/locales/persian_fa'
import { createServerFn } from '@tanstack/react-start'
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
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '#/components/ui/field'
import { Input } from '#/components/ui/input'
import { pocketbaseProvider } from '#/lib/middlewares'
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

export const Route = createFileRoute('/dashboard/inventory')({
  async loader({ context }) {
    await context.queryClient.query({
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
    onSubmit({ value: { cardId, count, orderedAt } }) {},
  })
  const { data: cardIds } = useQuery({
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
                        style={{ direction: 'ltr' }}
                        items={cardIds}
                        onValueChange={(e) => {
                          console.log({ e })
                        }}
                      >
                        <ComboboxInput placeholder="انتخاب کنید" />
                        <ComboboxContent>
                          <ComboboxEmpty>
                            کارتی برای انتخاب وجود ندارد
                          </ComboboxEmpty>
                          <ComboboxList>
                            {(item) => (
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
                        className="text-center"
                        style={{ direction: 'ltr' }}
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
              <form.Subscribe selector={(s) => s.isFormValid}>
                {(isValid) => (
                  <Button
                    variant="default"
                    type="submit"
                    className="col-start-2"
                    disabled={!isValid}
                  >
                    ثبت
                  </Button>
                )}
              </form.Subscribe>
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter className="justify-end">
          <Button variant={'secondary'}>ثبت انبار</Button>
        </CardFooter>
      </Card>
      <Calendar calendar={persian} locale={persian_fa} />
    </div>
  )
}
