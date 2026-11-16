import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Checkbox } from '@/components/common/Checkbox';
import { colors } from '@/constants/colors';
import { layout } from '@/constants/layout';
import { type } from '@/constants/typography';
import { confirmFinished } from '@/lib/confirm';
import { formatCompleted, formatDeadline, formatTimeDay, isToday } from '@/lib/dates';
import { checklistLabel, courseLabel } from '@/lib/selectors';
import type { Assignment, Course } from '@/types/models';

type Props = {
  assignment: Assignment;
  course?: Course;
  onPress?: () => void;
  onToggleComplete?: () => void;
  /** Calendar cards print the time before the day ("11:59 PM · Tomorrow"). */
  timeFirst?: boolean;
};

/**
 * 87px list card (104px when the title wraps to two lines).
 * Used on Home, Calendar, Assignments and Progress.
 */
export function AssignmentCard({
  assignment,
  course,
  onPress,
  onToggleComplete,
  timeFirst = false,
}: Props) {
  const completed = assignment.completed;
  const due = new Date(assignment.dueAt);
  const dueText = completed
    ? formatCompleted(new Date(assignment.completedAt ?? assignment.dueAt))
    : timeFirst
      ? formatTimeDay(due)
      : formatDeadline(due);
  const dueColor = !completed && isToday(due) ? colors.warning : colors.primaryDeep;

  const handleToggleComplete = () => {
    if (!onToggleComplete) return;
    if (completed) {
      onToggleComplete();
      return;
    }
    confirmFinished(assignment.title, onToggleComplete);
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${assignment.title}, ${courseLabel(course)}`}
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <Checkbox
        checked={completed}
        size={22}
        radius={layout.controlRadius}
        onPress={handleToggleComplete}
        label={completed ? 'Mark as not completed' : 'Mark as completed'}
      />
      <View style={styles.info}>
        <Text
          numberOfLines={2}
          style={[type.label14, styles.title, completed && styles.titleCompleted]}>
          {assignment.title}
        </Text>
        <Text numberOfLines={1} style={[type.meta11Regular, styles.course]}>
          {courseLabel(course)}
        </Text>
        <View style={styles.metadata}>
          <Text numberOfLines={1} style={[type.meta11, { color: dueColor }]}>
            {dueText}
          </Text>
          {assignment.checklist.length > 0 ? (
            <Text style={[type.micro10, styles.progress]}>{checklistLabel(assignment)}</Text>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: 12,
    padding: layout.cardPad,
    borderRadius: layout.cardRadius,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pressed: {
    opacity: 0.9,
  },
  info: {
    flex: 1,
    gap: 7,
  },
  title: {
    color: colors.ink,
  },
  titleCompleted: {
    color: colors.muted,
  },
  course: {
    color: colors.muted,
  },
  metadata: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    minHeight: 13,
  },
  progress: {
    color: colors.muted,
  },
});
