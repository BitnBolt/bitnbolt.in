'use client';

import { useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { getGuestCart } from '@/lib/guest-cart';
import { mergeGuestCartToServer } from '@/lib/client-cart';

/** After login, merge any local guest cart into the server cart. */
export default function GuestCartSync() {
  const { status } = useSession();
  const merging = useRef(false);

  useEffect(() => {
    if (status !== 'authenticated' || merging.current) return;
    if (getGuestCart().length === 0) return;

    merging.current = true;
    mergeGuestCartToServer()
      .catch((err) => console.error('Failed to merge guest cart:', err))
      .finally(() => {
        merging.current = false;
      });
  }, [status]);

  return null;
}
