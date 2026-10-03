import { createMiddleware } from '@tanstack/react-start'
import PocketBase from 'pocketbase'

export const pocketbaseProvider = createMiddleware().server(
  async ({ next }) => {
    const { getRequestHeader, setResponseHeader } =
      await import('@tanstack/react-start/server')
    const pb = new PocketBase('http://127.0.0.1:8090')
    let cookie = getRequestHeader('Cookie') || ''
    pb.authStore.loadFromCookie(cookie)
    if (pb.authStore.isValid) {
      try {
        await pb.collection('users').authRefresh()
      } catch (err) {
        pb.authStore.clear()
      }
    }
    cookie = pb.authStore.exportToCookie({ secure:false, httpOnly: true, sameSite: 'lax' })
    setResponseHeader('Set-Cookie', cookie)
    return next({
      context: {
        pb,
        user: pb.authStore.record,
      },
    })
  },
)
