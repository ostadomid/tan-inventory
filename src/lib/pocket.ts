// app/lib/pocketbase.ts
import PocketBase from 'pocketbase';

export const PB_URL = process.env.POCKETBASE_URL || 'http://127.0.0.1:8090';

/**
 * Creates or configures a PocketBase instance.
 * @param cookieHeader Optional raw cookie string from incoming request
 */
export function createPocketBase(cookieHeader?: string) {
  const pb = new PocketBase(PB_URL);

  if (cookieHeader) {
    pb.authStore.loadFromCookie(cookieHeader);
  }

  return pb;
}

// Client-side singleton for browser runtime
let clientPb: PocketBase | null = null;

export function getClientPocketBase(): PocketBase {
  if (typeof window === 'undefined') {
    throw new Error('getClientPocketBase should only be called in the browser');
  }

  if (!clientPb) {
    clientPb = new PocketBase(PB_URL);
    // Load existing auth from browser cookies
    clientPb.authStore.loadFromCookie(document.cookie);

    // Sync auth changes back to browser cookies
    clientPb.authStore.onChange(() => {
      document.cookie = clientPb!.authStore.exportToCookie({
        httpOnly: false, // Must be false if client needs to read it
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax',
      });
    });
  }

  return clientPb;
}
