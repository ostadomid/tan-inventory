import { cn } from 'cn'
import { useForm } from '@tanstack/react-form'

import { Button } from '#/components/ui/button.tsx'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/components/ui/card.tsx'
import {
  Field,
  FieldError,
  // FieldDescription,
  FieldGroup,
  FieldLabel,
} from '#/components/ui/field.tsx'
import { Input } from '#/components/ui/input.tsx'
import z from 'zod'
import { login } from '#/lib/actions'
import { useNavigate } from '@tanstack/react-router'

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const navigate = useNavigate()
  const form = useForm({
    defaultValues: { email: '', password: '' },
    validators: {
      onChange: z.object({ email: z.email(), password: z.string().min(6) }),
    },
    async onSubmit({ value: { email, password } }) {
      const { ok } = await login({
        data: { email, password },
      })
      if (ok) {
        navigate({ to: '/dashboard' })
      } else {
        alert('Invalid Credentials')
      }
    },
  })
  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>ورود کاربران</CardTitle>
          <CardDescription>
            جهت ورود مشخصات ایمیل خود را وارد نمایید
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              form.handleSubmit()
            }}
          >
            <FieldGroup>
              <form.Field name="email">
                {(field) => (
                  <Field>
                    <FieldLabel htmlFor="email">ایمیل</FieldLabel>
                    <Input
                      dir="ltr"
                      id={field.name}
                      name={field.name}
                      type="email"
                      placeholder="m@example.com"
                      required
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                    />
                    {field.state.meta.isDirty && !field.state.meta.isValid && (
                      <FieldError>
                        {field.state.meta.errors[0]?.message}
                      </FieldError>
                    )}
                  </Field>
                )}
              </form.Field>
              <form.Field name="password">
                {(field) => (
                  <Field>
                    <div className="flex items-center">
                      <FieldLabel htmlFor="password">رمز عبور</FieldLabel>
                      {/* <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a> */}
                    </div>
                    <Input
                      dir="ltr"
                      id={field.name}
                      name={field.name}
                      type="password"
                      required
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                    />
                    {field.state.meta.isDirty && !field.state.meta.isValid && (
                      <FieldError>
                        {field.state.meta.errors[0]?.message}
                      </FieldError>
                    )}
                  </Field>
                )}
              </form.Field>

              <Field>
                <Button type="submit">ورود</Button>
                {/* <Button variant="outline" type="button">
                  Login with Google
                </Button>
                <FieldDescription className="text-center">
                  Don&apos;t have an account? <a href="#">Sign up</a>
                </FieldDescription> */}
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
