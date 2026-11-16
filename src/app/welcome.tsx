import { router } from 'expo-router';
import { ArrowRight, BellRing, CalendarDays } from 'lucide-react-native';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AssignmentCard } from '@/components/cards/AssignmentCard';
import { PrimaryButton } from '@/components/common/PrimaryButton';
import { colors } from '@/constants/colors';
import { fonts, type } from '@/constants/typography';
import { addDays, formatMonthYear, isSameDay, startOfWeek, WEEKDAYS_SHORT } from '@/lib/dates';
import { courseFor } from '@/lib/selectors';
import { useAppData } from '@/hooks/use-app-data';

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();
  const { data } = useAppData();

  const now = new Date();
  const week = Array.from({ length: 7 }, (_, index) =>
    addDays(startOfWeek(now), index),
  );
  const preview =
    data.assignments.find((assignment) => !assignment.completed && assignment.id === 'a-hackathon') ??
    data.assignments.find((assignment) => !assignment.completed);
  const previewDay = preview ? new Date(preview.dueAt) : now;
  const activeDay = week.some((day) => isSameDay(day, previewDay)) ? previewDay : now;

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={[styles.intro, { paddingTop: Math.max(insets.top, 44) }]}>
          <View style={styles.message}>
            <Text style={[type.display40, styles.headline]}>Less deadline stress. More progress.</Text>
            <Text style={[type.body15, styles.copy]}>
              Your homework, tasks and reminders. One smart planner to stay a step ahead.
            </Text>
          </View>
        </View>

        <View style={styles.preview}>
          <View style={styles.previewHeading}>
            <Text style={[type.section17, styles.month]}>{formatMonthYear(now)}</Text>
            <CalendarDays size={20} color={colors.primary} strokeWidth={1.5} />
          </View>

          <View style={styles.week}>
            {week.map((day) => {
              const active = isSameDay(day, activeDay);
              return (
                <View key={day.toISOString()} style={[styles.day, active && styles.dayActive]}>
                  <Text style={[type.micro10, { color: active ? colors.white : colors.muted }]}>
                    {WEEKDAYS_SHORT[day.getDay()].charAt(0)}
                  </Text>
                  <Text
                    style={[
                      styles.date,
                      { color: active ? colors.white : colors.ink },
                    ]}>
                    {day.getDate()}
                  </Text>
                </View>
              );
            })}
          </View>

          {preview ? (
            <AssignmentCard
              assignment={preview}
              course={courseFor(data.courses, preview.courseId)}
              onPress={() => router.push('/login')}
            />
          ) : null}
        </View>

        <View style={styles.gettingStarted}>
          <View style={styles.feature}>
            <BellRing size={20} color={colors.primary} strokeWidth={1.5} />
            <View style={styles.featureCopy}>
              <Text style={[type.body14, styles.featureTitle]}>
                A little reminder. A lot less worry.
              </Text>
              <Text style={[type.copy12, styles.featureBody]}>
                Plan by deadline and make room to focus.
              </Text>
            </View>
          </View>

          <PrimaryButton
            label="Start planning"
            icon={ArrowRight}
            onPress={() => router.push('/login')}
          />

          <View style={styles.signInRow}>
            <Text style={[type.text12, styles.signIn]}>Already have an account?</Text>
            <Pressable onPress={() => router.push('/login')} hitSlop={8}>
              <Text style={[type.label12, styles.signInLink]}>Sign in</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
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
  message: {
    gap: 18,
    paddingTop: 16,
    paddingBottom: 34,
    paddingHorizontal: 26,
  },
  headline: {
    color: colors.white,
  },
  copy: {
    color: colors.onDarkBody,
  },
  preview: {
    gap: 16,
    paddingTop: 24,
    paddingBottom: 20,
    paddingHorizontal: 24,
    backgroundColor: colors.mint,
  },
  previewHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  month: {
    color: colors.ink,
  },
  week: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  day: {
    width: 40,
    height: 66,
    borderRadius: 10,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
  },
  dayActive: {
    backgroundColor: colors.primary,
  },
  date: {
    fontFamily: fonts.regular,
    fontSize: 18,
    lineHeight: 22,
    includeFontPadding: false,
  },
  gettingStarted: {
    gap: 20,
    padding: 24,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureCopy: {
    flex: 1,
    gap: 3,
  },
  featureTitle: {
    color: colors.ink,
  },
  featureBody: {
    color: colors.muted,
  },
  signInRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  signIn: {
    color: colors.muted,
  },
  signInLink: {
    color: colors.primaryDeep,
  },
});
