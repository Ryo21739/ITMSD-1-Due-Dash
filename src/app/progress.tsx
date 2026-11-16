import { router } from 'expo-router';
import { ChartNoAxesCombined, Check, CircleCheck } from 'lucide-react-native';
import React from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { AssignmentCard } from '@/components/cards/AssignmentCard';
import { EmptyState } from '@/components/common/EmptyState';
import { ProgressBar } from '@/components/common/ProgressBar';
import { SectionHeading } from '@/components/common/SectionHeading';
import { AppScreen } from '@/components/layout/AppScreen';
import { colors } from '@/constants/colors';
import { type } from '@/constants/typography';
import { useAppData } from '@/hooks/use-app-data';
import { useSession } from '@/hooks/use-session';
import {
  completedSorted,
  courseFor,
  recentlyCompleted,
} from '@/lib/selectors';

export default function ProgressScreen() {
  const { data, toggleCompleted, toggleGoal } = useAppData();
  const { profile } = useSession();
  const firstName = profile?.firstName.trim() || 'Gian';

  const recent = recentlyCompleted(data.assignments);
  const completed = recent.length;
  const percent = Math.max(0, Math.min(100, 60 + (completed - 4) * 10));
  const remaining = Math.max(0, 3 - (completed - 4));
  const goalsDone = data.goals.filter((goal) => goal.done).length;
  const latest = completedSorted(data.assignments).slice(0, 2);

  return (
    <AppScreen
      title="Your progress"
      subtitle="Small steps. Real momentum."
      onBack={() => router.back()}
      rightIcon={ChartNoAxesCombined}
      rightLabel="Semester summary"
      onRightPress={() =>
        Alert.alert(
          '1st semester 2026',
          `${completed} assignments completed recently · ${goalsDone} of ${data.goals.length} weekly goals done.`,
        )
      }
      active="tasks"
      topPadding={10}
      gap={18}>
      <View style={styles.hero}>
        <View style={styles.heroHeading}>
          <Text style={[type.label12, styles.period]}>1st SEMESTER 2026</Text>
          <CircleCheck size={22} color={colors.white} strokeWidth={1.5} />
        </View>

        <View style={styles.countRow}>
          <Text style={[type.display48, styles.count]}>{completed}</Text>
          <Text style={[type.body14, styles.countLabel]}>assignments completed</Text>
        </View>

        <ProgressBar
          value={percent / 100}
          height={6}
          trackColor="rgba(255, 255, 255, 0.35)"
          fillColor={colors.white}
        />

        <View style={styles.stats}>
          <Text style={[type.meta11Regular, styles.stat]}>{`${percent}% of 3 assignments`}</Text>
          <Text style={[type.meta11Regular, styles.stat]}>{`${remaining} to go`}</Text>
        </View>
      </View>

      <View style={styles.goals}>
        <SectionHeading
          title="This week’s goals"
          trailing={`${goalsDone} of ${data.goals.length} complete`}
        />
        <View style={styles.milestones}>
          {data.goals.map((goal) => (
            <Pressable
              key={goal.id}
              accessibilityRole="button"
              accessibilityState={{ selected: goal.done }}
              accessibilityLabel={goal.label}
              onPress={() => toggleGoal(goal.id)}
              style={({ pressed }) => [styles.milestone, pressed && styles.pressed]}>
              <View style={[styles.goalState, goal.done ? styles.goalDone : styles.goalTodo]}>
                {goal.done ? (
                  <Check size={17} color={colors.primary} strokeWidth={2} />
                ) : (
                  <Text style={[type.text12, styles.goalPlaceholder]}>–</Text>
                )}
              </View>
              <Text style={[type.micro10, styles.goalLabel]} numberOfLines={1}>
                {goal.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <SectionHeading
          title="Recently completed"
          trailing="View all"
          onTrailingPress={() => router.push('/assignments')}
        />
        {latest.length === 0 ? (
          <EmptyState message="Finish an assignment to start your streak." />
        ) : (
          latest.map((assignment) => (
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

      <Text style={[type.copy12, styles.footer]}>
        {`Keep showing up, ${firstName}. Every finished task makes room for what’s next.`}
      </Text>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  hero: {
    gap: 17,
    padding: 20,
    borderRadius: 16,
    backgroundColor: colors.primary,
  },
  heroHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 22,
  },
  period: {
    color: colors.mintOnGreen2,
  },
  countRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 7,
  },
  count: {
    color: colors.white,
  },
  countLabel: {
    color: colors.white,
    marginBottom: 10,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stat: {
    color: colors.white,
  },
  goals: {
    gap: 13,
    padding: 16,
    borderRadius: 16,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  milestones: {
    flexDirection: 'row',
    gap: 9,
  },
  milestone: {
    flex: 1,
    alignItems: 'center',
    gap: 7,
  },
  goalState: {
    width: 36,
    height: 36,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalDone: {
    backgroundColor: colors.mint,
  },
  goalTodo: {
    backgroundColor: colors.chip,
  },
  goalPlaceholder: {
    color: colors.muted,
  },
  goalLabel: {
    color: colors.muted,
    textAlign: 'center',
  },
  section: {
    gap: 10,
  },
  footer: {
    color: colors.primaryDeep,
  },
  pressed: {
    opacity: 0.7,
  },
});
