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
    <div className="max-w-lg mx-auto p-4">
      <LoginForm />
    </div>
  )
}
