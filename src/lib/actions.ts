import PocketBase from 'pocketbase'
import { createServerFn } from '@tanstack/react-start'
import * as z from 'zod'
import { pocketbaseProvider } from './middlewares'
import { redirect } from '@tanstack/react-router'
import { addOrderValidator } from './validators'

export const get_session = createServerFn()
  .middleware([pocketbaseProvider])
  .handler(async ({ context }) => {
    if (!context.user) {
      throw redirect({ to: '/login' })
    }
    return { user: context.user }
  })
export const is_guest = createServerFn()
  .middleware([pocketbaseProvider])
  .handler(async ({ context }) => {
    return !context.user
  })

export const login = createServerFn({ method: 'POST' })
  .validator(
    z.object({
      email: z
        .email()
        .refine((e) => e.endsWith('io.net'), 'invalid email provider'),
      password: z.string({ error: 'password is required' }).min(3),
    }),
  )
  .handler(async ({ data: { email, password } }) => {
    // console.log('Check-A')
    const { setResponseHeader } = await import('@tanstack/react-start/server')
    const pb = new PocketBase('http://127.0.0.1:8090')

    try {
      await pb.collection('users').authWithPassword(email, password)
      // console.log('Check-B')
      const cookie = pb.authStore.exportToCookie({
        secure: false,
        httpOnly: true,
        sameSite: 'lax',
      })
      setResponseHeader('Set-Cookie', cookie)
      return { ok: true }
    } catch (err) {
      console.log({ err })
      return { ok: false }
    }
  })

export const logout = createServerFn({ method: 'POST' }).handler(async () => {
  const { setResponseHeader } = await import('@tanstack/react-start/server')
  const pb = new PocketBase('http://localhost:8090')
  pb.authStore.clear()
  const cookie = pb.authStore.exportToCookie({
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    expires: new Date(1970, 12),
  })
  setResponseHeader('Set-Cookie', cookie)
  return { ok: true, msg: 'Bye' }
})

export const get_card_ids = createServerFn()
  .middleware([pocketbaseProvider])
  .handler(async ({ context: { pb } }) => {
    const result = await pb
      .collection('cards')
      .getFullList({ sort: 'card_id', fields: 'card_id' })
    const cardIds = [...new Set(result.map((r) => r.card_id))]
    // console.log(cardIds)
    return cardIds
  })

export const add_new_order = createServerFn({ method: 'POST' })
  .middleware([pocketbaseProvider])
  .validator(addOrderValidator)
  .handler(async ({ data, context: { pb } }) => {
    try {
      const { id } = await pb.collection('cards').create({
        card_id: data.cardId,
        count: data.type == 'in' ? data.count : -data.count,
        ordered_at: data.orderedAt,
      })
      return { ok: true, id }
    } catch (err) {
      return { ok: false, msg: (err as Error).message }
    }
  })

export interface StockSummary {
  card_id: string
  sum: number
}
export const get_stock = createServerFn()
  .middleware([pocketbaseProvider])
  .handler(async ({ context: { pb } }) => {
    // console.log('Hello')
    try {
      const rows = await pb.collection('stock').getFullList<StockSummary>()
      // console.log(rows)
      return rows
    } catch (err) {
      console.log(err)
      return []
    }
  })

export interface Order {
  card_id: string
  count: number
  ordered_at: string
}
export const get_orders = createServerFn()
  .middleware([pocketbaseProvider])
  .handler(async ({ context: { pb } }) => {
    const orders = await pb.collection('cards').getFullList<Order>({sort:"-ordered_at"})
    // console.log({orders})
    return orders
  })
