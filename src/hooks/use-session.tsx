import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

import type { StudentProfile } from '@/types/models';

type SessionValue = {
  /** In-memory only: restarting the app always starts signed out. */
  signedIn: boolean;
  /** Name + email entered on the sign-in screen. */
  profile: StudentProfile | null;
  signIn: (profile: StudentProfile) => void;
  signOut: () => void;
};

const SessionContext = createContext<SessionValue | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<StudentProfile | null>(null);

  const signIn = useCallback((next: StudentProfile) => {
    setProfile(next);
  }, []);

  const signOut = useCallback(() => {
    setProfile(null);
  }, []);

  const value = useMemo(
    () => ({ signedIn: profile !== null, profile, signIn, signOut }),
    [profile, signIn, signOut],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionValue {
  const context = useContext(SessionContext);
  if (!context) throw new Error('useSession must be used inside <SessionProvider>');
  return context;
}
