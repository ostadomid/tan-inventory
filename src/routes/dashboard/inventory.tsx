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

const get_names = createServerFn().handler(async () => ['Alice', 'Bob'])
export const Route = createFileRoute('/dashboard/inventory')({
  async loader({ context }) {
    // await context.queryClient.query({ queryKey: ['names'], queryFn: get_names })
  },
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>ثبت سفارش جدید</CardTitle>
        </CardHeader>
        <CardContent>مشخصات سفارش اینجا قرار میگیرد</CardContent>
        <CardFooter className="justify-end">
          <Button variant={'secondary'}>ثبت انبار</Button>
        </CardFooter>
      </Card>
      <Calendar calendar={persian} locale={persian_fa} />
    </div>
  )
}
