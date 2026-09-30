import { Button } from '#/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from '#/components/ui/dropdown-menu'
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
      <div className="flex gap-2">
        <div id="logo"></div>
        <ul className="w-full flex  ">
          <li>Welcome {user.name || user.email}</li>
          <li className="flex-1">
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/dashboard/inventory">Inventory</Link>
          </li>
          <li>
            <Link to="/dashboard/logs">Logs</Link>
          </li>
        </ul>
        <div id="user-actions">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button>Welcome {user.name}</Button>
            </DropdownMenuTrigger>
          </DropdownMenu>
        </div>
      </div>
      <Outlet />
    </div>
  )
}
