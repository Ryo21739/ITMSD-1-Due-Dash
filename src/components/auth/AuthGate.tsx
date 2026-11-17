import { Redirect, usePathname } from 'expo-router';
import React from 'react';

import { useSession } from '@/hooks/use-session';

const PUBLIC_ROUTES = new Set(['/', '/login', '/welcome']);

/**
 * Keeps protected screens behind the login screen. This also catches the case
 * where a signed-out user presses Android back after logging out.
 */
export function AuthGate({ children }: { children: React.ReactNode }) {
  const { signedIn } = useSession();
  const pathname = usePathname();

  if (!signedIn && !PUBLIC_ROUTES.has(pathname)) {
    return <Redirect href="/login" />;
  }

  return <>{children}</>;
}
