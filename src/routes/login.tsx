import { is_guest, login } from '#/lib/actions'
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/login')({
  async beforeLoad() {
    if (!(await is_guest())) {
      throw redirect({ to: '/dashboard' })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  return (
    <div>
      <h1>Login Now!</h1>
      <button
        onClick={async () => {
          const { ok } = await login({
            data: { email: 'kambiz@io.net', password: '14251425' },
          })
          if (ok) {
            navigate({ to: '/dashboard' })
          } else {
            alert('Invalid Credentials')
          }
        }}
        className="rounded-lg px-4 py-1 bg-purple-200"
      >
        Log me in
      </button>
    </div>
  )
}
