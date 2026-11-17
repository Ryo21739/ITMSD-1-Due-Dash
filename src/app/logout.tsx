import { router } from 'expo-router';
import { LogOut } from 'lucide-react-native';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/components/common/PrimaryButton';
import { AppScreen } from '@/components/layout/AppScreen';
import { colors } from '@/constants/colors';
import { type } from '@/constants/typography';
import { useSession } from '@/hooks/use-session';

export default function LogoutScreen() {
  const { profile, signOut } = useSession();

  const firstName = profile?.firstName.trim() || 'there';
  const fullName = profile
    ? `${profile.firstName.trim()} ${profile.lastName.trim()}`.trim()
    : 'No active session';
  const initials = profile
    ? `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`.toUpperCase()
    : '—';

  const handleLogout = () => {
    signOut();
    router.replace('/login');
  };

  return (
    <AppScreen
      title="Log out"
      subtitle="Switch to another user"
      onBack={() => router.back()}
      backStyle="circle"
      backLabel="My planner"
      topPadding={24}
      gap={22}
      scroll={false}>
      <View style={styles.accountCard}>
        <View style={styles.avatar}>
          <Text style={[type.title23, styles.initials]}>{initials}</Text>
        </View>
        <View style={styles.accountCopy}>
          <Text style={[type.section17, styles.name]}>{fullName}</Text>
          <Text style={[type.text12, styles.email]}>
            {profile?.email || 'No email on this session'}
          </Text>
        </View>
      </View>

      <View style={styles.explainer}>
        <Text style={[type.body15, styles.explainerTitle]}>{`Leaving already, ${firstName}?`}</Text>
        <Text style={[type.body14, styles.explainerCopy]}>
          Logging out ends this session. The next person to open Due Dash will be asked to sign in
          with their own name.
        </Text>
      </View>

      <View style={styles.actions}>
        <PrimaryButton label="Log out" icon={LogOut} onPress={handleLogout} />

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Stay signed in"
          onPress={() => router.back()}
          hitSlop={8}
          style={({ pressed }) => [styles.cancel, pressed && styles.pressed]}>
          <Text style={[type.label14, styles.cancelLabel]}>Cancel — stay signed in</Text>
        </Pressable>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  accountCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 18,
    borderRadius: 16,
    backgroundColor: colors.mint,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 100,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: colors.white,
  },
  accountCopy: {
    flex: 1,
    gap: 4,
  },
  name: {
    color: colors.ink,
  },
  email: {
    color: colors.muted,
  },
  explainer: {
    gap: 10,
  },
  explainerTitle: {
    color: colors.ink,
  },
  explainerCopy: {
    color: colors.muted,
  },
  actions: {
    gap: 18,
  },
  cancel: {
    alignSelf: 'center',
  },
  cancelLabel: {
    color: colors.primaryDeep,
  },
  pressed: {
    opacity: 0.7,
  },
});
