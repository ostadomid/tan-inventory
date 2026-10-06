import { LoginForm } from '#/components/login-form'
import { is_guest } from '#/lib/actions'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/login')({
  async beforeLoad() {
    if (!(await is_guest())) {
      throw redirect({ to: '/dashboard' })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="w-full h-screen grid place-items-center p-4">
      <LoginForm className="w-full sm:max-w-sm" />
    </div>
  )
}
