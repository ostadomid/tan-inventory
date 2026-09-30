import PocketBase from 'pocketbase'
import { createServerFn } from '@tanstack/react-start'
import * as z from 'zod'
import { pocketbaseProvider } from './middlewares'
import { redirect } from '@tanstack/react-router'

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
    const { setResponseHeader } = await import('@tanstack/react-start/server')
    const pb = new PocketBase('http://127.0.0.1:8090')
    try {
      await pb.collection('users').authWithPassword(email, password)
      const cookie = pb.authStore.exportToCookie({
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
