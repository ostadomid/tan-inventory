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
    <div className="w-full h-screen grid place-items-center place-content-center">
      <Link
        to="/dashboard"
        className="border border-green-400 text-white rounded-xl px-4 py-2 bg-green-200 hover:bg-green-200/75 cursor-pointer delay-75 transition-all"
      >
        برای شروع اینجا بزنید
      </Link>
    </div>
  )
}
