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
    <div className="p-8">
      <Link to="/dashboard">Dashboard</Link>
      {/* <h1 className="text-4xl font-bold">Cards</h1>
      <ul>
        {cards.map((c) => (
          <li key={c.id}>{c['card_id']}</li>
        ))}
      </ul> */}
    </div>
  )
}
