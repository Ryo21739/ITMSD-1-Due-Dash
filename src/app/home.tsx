import { router } from 'expo-router';
import { Bell, Plus, TrendingUp } from 'lucide-react-native';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AssignmentCard } from '@/components/cards/AssignmentCard';
import { MetricCard } from '@/components/cards/MetricCard';
import { EmptyState } from '@/components/common/EmptyState';
import { PrimaryButton } from '@/components/common/PrimaryButton';
import { ProgressBar } from '@/components/common/ProgressBar';
import { SectionHeading } from '@/components/common/SectionHeading';
import { AppScreen } from '@/components/layout/AppScreen';
import { colors } from '@/constants/colors';
import { type } from '@/constants/typography';
import { useAppData } from '@/hooks/use-app-data';
import { useSession } from '@/hooks/use-session';
import {
  formatHeaderDate,
  formatShortDate,
  greetingFor,
  isSameDay,
  isTomorrow,
} from '@/lib/dates';
import {
  courseFor,
  dueThisWeek,
  dueToday,
  openOnly,
  sortByDue,
  upcomingAssignments,
} from '@/lib/selectors';

export default function HomeScreen() {
  const { data, toggleCompleted } = useAppData();
  const { profile } = useSession();
  const now = new Date();

  const firstName = profile?.firstName.trim() || 'Gian';
  const initials = profile
    ? `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`.toUpperCase()
    : 'AL';

  const today = dueToday(data.assignments, now);
  /**
   * The Due today list keeps finished tasks visible (checked) for the rest of
   * the day, so an accidental check can be undone in place.
   */
  const todayList = sortByDue(
    data.assignments.filter((assignment) => isSameDay(new Date(assignment.dueAt), now)),
  );
  const week = dueThisWeek(data.assignments, now);
  const open = openOnly(data.assignments);
  const upNext = upcomingAssignments(data.assignments, now)[0] ?? null;
  const goalsDone = data.goals.filter((goal) => goal.done).length;

  const upNextTrailing = upNext
    ? isTomorrow(new Date(upNext.dueAt), now)
      ? 'Tomorrow'
      : formatShortDate(new Date(upNext.dueAt))
    : 'All clear';

  return (
    <AppScreen
      title="My planner"
      subtitle={formatHeaderDate(now)}
      rightIcon={Bell}
      rightLabel="Open reminders"
      onRightPress={() => router.push('/reminders')}
      active="home"
      topPadding={15}
      gap={14}>
      <View style={styles.greeting}>
        <View style={styles.greetingCopy}>
          <Text style={[type.title23, styles.greetingTitle]}>{`${greetingFor(now)}, ${firstName}.`}</Text>
          <Text style={[type.copy12, styles.greetingBody]}>A clear plan for a busy week.</Text>
        </View>
        <View style={styles.avatar}>
          <Text style={[type.label14, styles.initials]}>{initials}</Text>
        </View>
      </View>

      <View style={styles.metrics}>
        <MetricCard value={today.length} label="Due today" highlighted />
        <MetricCard value={week.length} label="This week" />
        <MetricCard value={open.length} label="Open tasks" />
      </View>

      <View style={styles.section}>
        <SectionHeading
          title="Due today"
          trailing="View all"
          onTrailingPress={() => router.push('/assignments')}
        />
        {todayList.length === 0 ? (
          <EmptyState message="Nothing due today. Enjoy the breathing room." />
        ) : (
          todayList.map((assignment) => (
            <AssignmentCard
              key={assignment.id}
              assignment={assignment}
              course={courseFor(data.courses, assignment.courseId)}
              onPress={() => router.push(`/assignment/${assignment.id}`)}
              onToggleComplete={() => toggleCompleted(assignment.id)}
            />
          ))
        )}
      </View>

      <View style={styles.section}>
        <SectionHeading title="Up next" trailing={upNextTrailing} />
        {upNext ? (
          <AssignmentCard
            assignment={upNext}
            course={courseFor(data.courses, upNext.courseId)}
            onPress={() => router.push(`/assignment/${upNext.id}`)}
            onToggleComplete={() => toggleCompleted(upNext.id)}
          />
        ) : (
          <EmptyState message="No upcoming deadlines. A rare and beautiful thing." />
        )}
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Open weekly progress"
        onPress={() => router.push('/progress')}
        style={({ pressed }) => [styles.progressCard, pressed && styles.pressed]}>
        <View style={styles.progressHeading}>
          <Text style={[type.label12, styles.progressLabel]}>You’re building momentum</Text>
          <TrendingUp size={16} color={colors.primary} strokeWidth={1.5} />
        </View>
        <ProgressBar value={goalsDone / data.goals.length} height={5} />
        <Text style={[type.note11, styles.progressCopy]}>
          {`${goalsDone} of ${data.goals.length} weekly goals completed · View progress`}
        </Text>
      </Pressable>

      <PrimaryButton
        label="Add assignment"
        icon={Plus}
        onPress={() => router.push('/assignment/new')}
      />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  greeting: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  greetingCopy: {
    flex: 1,
    gap: 4,
  },
  greetingTitle: {
    color: colors.ink,
  },
  greetingBody: {
    color: colors.muted,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 100,
    backgroundColor: colors.mint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: colors.primary,
  },
  metrics: {
    flexDirection: 'row',
    gap: 10,
  },
  section: {
    gap: 10,
  },
  progressCard: {
    gap: 10,
    padding: 16,
    borderRadius: 16,
    backgroundColor: colors.mint,
  },
  progressHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressLabel: {
    color: colors.primaryDeep,
  },
  progressCopy: {
    color: colors.primaryDeep,
  },
  pressed: {
    opacity: 0.9,
  },
});
