// app/lib/auth-middleware.ts
import { createMiddleware } from '@tanstack/react-start';
import {getRequestHeader, setResponseHeader} from '@tanstack/react-start/server'
import { createPocketBase } from './pocket';

export const authMiddleware = createMiddleware().server(async ({ next }) => {

  const cookieHeader = getRequestHeader('cookie') || '';

  const pb = createPocketBase(cookieHeader);

  // Auto-refresh token if valid/expired
  if (pb.authStore.isValid) {
    try {
      await pb.collection('users').authRefresh();
    } catch {
      pb.authStore.clear();
    }
  }

  // If token refreshed or cleared, set the updated cookie in the response
  const cookie = pb.authStore.exportToCookie({
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Lax',
  });

  setResponseHeader('Set-Cookie', cookie);

  return next({
    context: {
      pb,
      user: pb.authStore.record,
    },
  });
});
