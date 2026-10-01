import { Button } from '#/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '#/components/ui/dropdown-menu'
import { get_session } from '#/lib/actions'
import { createFileRoute, Link, Outlet } from '@tanstack/react-router'
import { ClipboardList, ScrollText, UserRound } from 'lucide-react'

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
      <div className="flex gap-2 items-center bg-green-400/20 rounded-full p-2 mt-4">
        <ul className="flex flex-1 gap-x-4 gap-y-6">
          <li>
            <Link
              to="/dashboard/inventory"
              className="px-4 py-1 bg-green-100/50 hover:bg-green-100/75 rounded-full flex gap-2 "
            >
              <ClipboardList className="" />
              <span>انــــبار</span>
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard/logs"
              className="px-4 py-1 bg-green-100/50 hover:bg-green-100/75 rounded-full flex gap-2 "
            >
              <ScrollText />
              <span>سابقه</span>
            </Link>
          </li>
        </ul>
        <div id="user-actions" className="px-4">
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="ghost" />}>
              <UserRound className="text-green-800 hover:text-green-600 cursor-pointer" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup>
                <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
                <DropdownMenuItem>Profile</DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <Outlet />
    </div>
  )
}
