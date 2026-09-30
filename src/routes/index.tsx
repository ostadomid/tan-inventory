import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Home,
  // async loader() {
  //   const { user, cards } = await fetch_session()
  //   if (!user) {
  //     throw redirect({ to: '/login' })
  //   }
  //   return { cards }
  // },
})

function Home() {
  // const { cards } = Route.useLoaderData()

  return (
    <div className="w-full h-full grid place-items-center">
      <Link
        to="/dashboard"
        className="border border-green-400 text-white rounded-xl px-4 py-2 bg-green-200 hover:bg-green-600/75 cursor-pointer delay-75 transition-all"
      >
        Start Here...
      </Link>
    </div>
  )
}
