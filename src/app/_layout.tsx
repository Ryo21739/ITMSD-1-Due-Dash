import { Inter_400Regular } from '@expo-google-fonts/inter/400Regular';
import { Inter_500Medium } from '@expo-google-fonts/inter/500Medium';
import { Inter_600SemiBold } from '@expo-google-fonts/inter/600SemiBold';
import { Inter_700Bold } from '@expo-google-fonts/inter/700Bold';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { colors } from '@/constants/colors';
import { AppDataProvider } from '@/hooks/use-app-data';
import { SessionProvider } from '@/hooks/use-session';

SplashScreen.preventAutoHideAsync().catch(() => {
  // Already hidden (fast refresh) — safe to ignore.
});

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <SessionProvider>
        <AppDataProvider>
          <StatusBar style="light" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: colors.bg },
              animation: 'slide_from_right',
            }}>
            <Stack.Screen name="index" options={{ animation: 'none' }} />
            <Stack.Screen name="welcome" options={{ animation: 'fade' }} />
            <Stack.Screen name="login" />
            <Stack.Screen name="home" options={{ animation: 'fade' }} />
            <Stack.Screen name="calendar" />
            <Stack.Screen name="assignments" />
            <Stack.Screen name="courses" />
            <Stack.Screen name="reminders" />
            <Stack.Screen name="progress" />
            <Stack.Screen name="assignment/new" />
            <Stack.Screen name="assignment/[id]/index" />
            <Stack.Screen name="assignment/[id]/edit" />
          </Stack>
        </AppDataProvider>
      </SessionProvider>
    </SafeAreaProvider>
  );
}
