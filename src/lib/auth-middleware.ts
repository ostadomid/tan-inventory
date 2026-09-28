// app/lib/auth-middleware.ts
import { createMiddleware } from '@tanstack/react-start'

// import { createPocketBase } from './pocket';
import PocketBase from 'pocketbase'

export const authMiddleware = createMiddleware().server(async ({ next }) => {
  const { getRequestHeader, setResponseHeader } =
    await import('@tanstack/react-start/server')
  // const cookieHeader = getRequestHeader('cookie') || '';

  // const pb = createPocketBase(cookieHeader);
  const pb = new PocketBase('http://127.0.0.1:8090')
  await pb.collection('users').authWithPassword('kami@io.net', '14251425')

  // Auto-refresh token if valid/expired
  if (pb.authStore.isValid) {
    try {
      await pb.collection('users').authRefresh()
    } catch {
      pb.authStore.clear()
    }
  }

  // If token refreshed or cleared, set the updated cookie in the response
  const cookie = pb.authStore.exportToCookie({
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Lax',
  })

  setResponseHeader('Set-Cookie', cookie)

  return next({
    context: {
      pb,
      user: pb.authStore.record,
    },
  })
})
