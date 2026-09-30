import { get_session } from '#/lib/actions'
import { createFileRoute, Link, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard')({
  async beforeLoad() {
    const { user } = await get_session()
    return { user }
  },

  component: RouteComponent,
})

function RouteComponent() {
  const { user } = Route.useRouteContext()
  return (
    <div className="max-w-lg mx-auto flex flex-col gap-2">
      <ul className="w-full flex ">
        <li>Welcome {user.id}</li>
        <li className="flex-1">
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/dashboard/profile">Profile</Link>
        </li>
        <li>
          <Link to="/dashboard/settings">Settings</Link>
        </li>
      </ul>
      <Outlet />
    </div>
  )
}
