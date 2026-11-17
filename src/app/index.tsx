import { Redirect } from 'expo-router';
import React from 'react';

/**
 * App entry point: every cold start opens the login screen so the app always
 * knows who is using it. The session is intentionally not persisted.
 */
export default function Index() {
  return <Redirect href="/login" />;
}
