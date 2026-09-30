import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/inventory')({
  async loader() {},
  component: RouteComponent,
})

function RouteComponent() {
  return <div></div>
}
