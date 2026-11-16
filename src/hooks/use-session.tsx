import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import type { StudentProfile } from '@/types/models';

const SESSION_KEY = 'due-dash:session:v2';

type SessionValue = {
  /** null while the persisted session is being read. */
  signedIn: boolean | null;
  /** Name + email entered on the sign-in screen. */
  profile: StudentProfile | null;
  signIn: (profile: StudentProfile) => Promise<void>;
  signOut: () => Promise<void>;
};

const SessionContext = createContext<SessionValue | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const [profile, setProfile] = useState<StudentProfile | null>(null);

  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(SESSION_KEY)
      .then((value) => {
        if (!active) return;
        if (!value) {
          setSignedIn(false);
          return;
        }
        try {
          const parsed = JSON.parse(value) as Partial<StudentProfile>;
          if (
            parsed &&
            typeof parsed.firstName === 'string' &&
            typeof parsed.lastName === 'string'
          ) {
            setProfile({
              firstName: parsed.firstName,
              lastName: parsed.lastName,
              email: typeof parsed.email === 'string' ? parsed.email : '',
            });
            setSignedIn(true);
            return;
          }
        } catch {
          // Corrupt payload — fall through to signed out.
        }
        setSignedIn(false);
      })
      .catch(() => {
        if (active) setSignedIn(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const signIn = useCallback(async (next: StudentProfile) => {
    setProfile(next);
    setSignedIn(true);
    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(next)).catch(() => {});
  }, []);

  const signOut = useCallback(async () => {
    setProfile(null);
    setSignedIn(false);
    await AsyncStorage.removeItem(SESSION_KEY).catch(() => {});
  }, []);

  const value = useMemo(
    () => ({ signedIn, profile, signIn, signOut }),
    [signedIn, profile, signIn, signOut],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionValue {
  const context = useContext(SessionContext);
  if (!context) throw new Error('useSession must be used inside <SessionProvider>');
  return context;
}
