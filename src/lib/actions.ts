import { createServerFn } from "@tanstack/react-start"
import { authMiddleware } from "./auth-middleware"

export const fetch_session = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .handler(async ({ context: { pb, user } }) => {
    const r = await pb.collection('cards').getList(1, 10)
    return { user, cards: r.items }
  })