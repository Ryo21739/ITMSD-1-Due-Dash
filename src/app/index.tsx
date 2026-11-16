import { Redirect } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

import { colors } from '@/constants/colors';
import { useSession } from '@/hooks/use-session';

export default function Index() {
  const { signedIn } = useSession();

  if (signedIn === null) {
    return <View style={{ flex: 1, backgroundColor: colors.inkDeep }} />;
  }

  return <Redirect href={signedIn ? '/home' : '/welcome'} />;
}
