import { router } from 'expo-router';
import { ArrowLeft, ArrowRight, Eye, EyeOff } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/common/PrimaryButton';
import { Field, Input } from '@/components/forms/Fields';
import { colors } from '@/constants/colors';
import { layout } from '@/constants/layout';
import { type } from '@/constants/typography';
import { useSession } from '@/hooks/use-session';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { signIn } = useSession();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = async () => {
    if (!firstName.trim()) {
      Alert.alert('Add your first name', 'We use it to greet you on your planner.');
      return;
    }
    if (!lastName.trim()) {
      Alert.alert('Add your last name', 'This completes your student profile.');
      return;
    }
    if (!email.trim() || !password.trim()) {
      Alert.alert(
        'Almost there',
        'Enter your student email and password to sign in. This demo keeps everything on your device.',
      );
      return;
    }
    await signIn({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
    });
    router.replace('/home');
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View style={[styles.intro, { paddingTop: Math.max(insets.top, 44) }]}>
          <View style={styles.backRow}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Back to welcome"
              onPress={() => router.back()}
              style={({ pressed }) => [styles.backAction, pressed && styles.pressed]}>
              <ArrowLeft size={18} color={colors.white} strokeWidth={1.5} />
            </Pressable>
            <Text style={[type.label14, styles.backLabel]}>My planner</Text>
          </View>

          <View style={styles.message}>
            <Text style={[type.display40, styles.heading]}>Welcome back.</Text>
            <Text style={[type.body15, styles.copy]}>
              Your deadlines, tasks and reminders. Right where you left them.
            </Text>
          </View>
        </View>

        <View style={styles.form}>
          <View style={styles.credentials}>
            <View style={styles.nameRow}>
              <Field label="First name" style={styles.half}>
                <Input
                  value={firstName}
                  onChangeText={setFirstName}
                  placeholder="Gian"
                  autoCapitalize="words"
                  autoCorrect={false}
                  autoComplete="given-name"
                  textContentType="givenName"
                  style={styles.input}
                />
              </Field>
              <Field label="Last name" style={styles.half}>
                <Input
                  value={lastName}
                  onChangeText={setLastName}
                  placeholder="Dela Cruz"
                  autoCapitalize="words"
                  autoCorrect={false}
                  autoComplete="family-name"
                  textContentType="familyName"
                  style={styles.input}
                />
              </Field>
            </View>

            <Field label="Student email">
              <Input
                value={email}
                onChangeText={setEmail}
                placeholder="you@university.edu"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
                textContentType="emailAddress"
                style={styles.input}
              />
            </Field>

            <Field label="Password">
              <View style={styles.passwordWrap}>
                <Input
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter your password"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  textContentType="password"
                  style={[styles.input, styles.passwordInput]}
                />
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
                  onPress={() => setShowPassword((value) => !value)}
                  hitSlop={8}
                  style={styles.show}>
                  {showPassword ? (
                    <EyeOff size={18} color={colors.muted} strokeWidth={1.5} />
                  ) : (
                    <Eye size={18} color={colors.muted} strokeWidth={1.5} />
                  )}
                  <Text style={[type.label12, styles.showLabel]}>
                    {showPassword ? 'Hide' : 'Show'}
                  </Text>
                </Pressable>
              </View>
            </Field>

            <Pressable
              onPress={() =>
                Alert.alert(
                  'Password recovery',
                  'This planner runs entirely on your device, so there is no password to reset. Sign in with any email to continue.',
                )
              }
              hitSlop={8}
              style={styles.forgot}>
              <Text style={[type.label12, styles.link]}>Forgot password?</Text>
            </Pressable>
          </View>

          <PrimaryButton label="Sign in" icon={ArrowRight} onPress={handleSignIn} />

          <Pressable
            onPress={() =>
              Alert.alert(
                'Create an account',
                'Sign up is not part of this demo build. Enter your name, student email and password to explore the planner.',
              )
            }
            hitSlop={8}>
            <Text style={[type.text12, styles.signUp]}>New to the planner? Sign up</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  intro: {
    backgroundColor: colors.inkDeep,
  },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingTop: 12,
    paddingBottom: 20,
    paddingHorizontal: layout.page,
  },
  backAction: {
    width: layout.action,
    height: layout.action,
    borderRadius: layout.pillRadius,
    backgroundColor: colors.headerAction,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backLabel: {
    color: colors.white,
  },
  message: {
    gap: 18,
    paddingTop: 8,
    paddingBottom: 32,
    paddingHorizontal: 26,
  },
  heading: {
    color: colors.white,
  },
  copy: {
    color: colors.onDarkBody,
  },
  form: {
    gap: 24,
    paddingTop: 32,
    paddingBottom: 24,
    paddingHorizontal: layout.page,
  },
  credentials: {
    gap: 20,
  },
  nameRow: {
    flexDirection: 'row',
    gap: 12,
  },
  half: {
    flex: 1,
  },
  input: {
    height: 52,
    fontSize: 14,
    lineHeight: 17,
  },
  passwordWrap: {
    justifyContent: 'center',
  },
  passwordInput: {
    paddingRight: 96,
  },
  show: {
    position: 'absolute',
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  showLabel: {
    color: colors.primaryDeep,
  },
  forgot: {
    alignSelf: 'flex-end',
  },
  link: {
    color: colors.primaryDeep,
  },
  signUp: {
    color: colors.muted,
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.72,
  },
});
