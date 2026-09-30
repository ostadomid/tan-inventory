import { createMiddleware } from '@tanstack/react-start'
import PocketBase from 'pocketbase'

export const auth = createMiddleware().server(async ({ next }) => {
  const pb = new PocketBase('http://127.0.0.1:8090')
  const { getRequestHeader, setResponseHeader } =
    await import('@tanstack/react-start/server')
  let cookie = getRequestHeader('Cookie') || ''
  pb.authStore.loadFromCookie(cookie)
  if (pb.authStore.isValid) {
    try {
      pb.collection('users').authRefresh()
    } catch (err) {
      pb.authStore.clear()
    }
  }
  cookie = pb.authStore.exportToCookie({ httpOnly: false, sameSite: 'Lax' })
  setResponseHeader('Set-Cookie', cookie)

  return next({
    context: {
      pb,
      user: pb.authStore.record,
    },
  })
})
