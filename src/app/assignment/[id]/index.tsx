import { router, useLocalSearchParams } from 'expo-router';
import { Bell, CalendarDays, Check, Paperclip, Pencil } from 'lucide-react-native';
import React from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { Badge } from '@/components/common/Badge';
import { Checkbox } from '@/components/common/Checkbox';
import { EmptyState } from '@/components/common/EmptyState';
import { PrimaryButton } from '@/components/common/PrimaryButton';
import { ProgressBar } from '@/components/common/ProgressBar';
import { SectionHeading } from '@/components/common/SectionHeading';
import { AppScreen } from '@/components/layout/AppScreen';
import { colors } from '@/constants/colors';
import { type } from '@/constants/typography';
import { useAppData } from '@/hooks/use-app-data';
import {
  formatLongDate,
  formatLongDateNoYear,
  formatShortDate,
  formatTime,
  isToday,
  isTomorrow,
} from '@/lib/dates';
import { checklistDone, courseFor, courseLabel } from '@/lib/selectors';

export default function AssignmentDetailScreen() {
  const params = useLocalSearchParams<{ id?: string }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const { data, toggleChecklist, toggleCompleted } = useAppData();

  const assignment = data.assignments.find((item) => item.id === id);
  const course = assignment ? courseFor(data.courses, assignment.courseId) : undefined;

  if (!assignment) {
    return (
      <AppScreen
        title="Assignment detail"
        subtitle="Your next step, made clear"
        onBack={() => router.back()}
        active="tasks"
        topPadding={24}
        gap={16}>
        <EmptyState message="This assignment no longer exists." />
        <PrimaryButton label="Back to assignments" onPress={() => router.replace('/assignments')} />
      </AppScreen>
    );
  }

  const due = new Date(assignment.dueAt);
  const now = new Date();
  const done = checklistDone(assignment);
  const total = assignment.checklist.length;

  const dueLabel = assignment.completed
    ? `Completed ${formatShortDate(new Date(assignment.completedAt ?? assignment.dueAt))}`
    : isToday(due)
      ? 'Due today'
      : isTomorrow(due)
        ? 'Due tomorrow'
        : due.getTime() < now.getTime()
          ? 'Overdue'
          : `Due ${formatShortDate(due)}`;

  const reminderValue =
    assignment.reminderEnabled && assignment.reminderAt
      ? `${formatLongDateNoYear(new Date(assignment.reminderAt))} · ${formatTime(
          new Date(assignment.reminderAt),
        )}`
      : 'No reminder';

  return (
    <AppScreen
      title="Assignment detail"
      subtitle="Your next step, made clear"
      onBack={() => router.back()}
      rightIcon={Pencil}
      rightLabel="Edit assignment"
      onRightPress={() => router.push(`/assignment/${assignment.id}/edit`)}
      active="tasks"
      topPadding={16}
      gap={18}>
      <View style={styles.summary}>
        <View style={styles.statusRow}>
          <Badge label={assignment.completed ? 'Completed' : 'In progress'} active />
          <Badge label={dueLabel} />
        </View>
        <Text style={[type.title29, styles.title]}>{assignment.title}</Text>
        <Text style={[type.label12, styles.course]}>{courseLabel(course)}</Text>
      </View>

      <View style={styles.properties}>
        <View style={styles.property}>
          <CalendarDays size={20} color={colors.primary} strokeWidth={1.5} />
          <View style={styles.propertyCopy}>
            <Text style={[type.micro10, styles.propertyLabel]}>Deadline</Text>
            <Text style={[type.label12, styles.propertyValue]}>
              {`${formatLongDate(due)} · ${formatTime(due)}`}
            </Text>
          </View>
        </View>

        <View style={styles.property}>
          <Bell size={20} color={colors.primary} strokeWidth={1.5} />
          <View style={styles.propertyCopy}>
            <Text style={[type.micro10, styles.propertyLabel]}>Reminder</Text>
            <Text style={[type.label12, styles.propertyValue]}>{reminderValue}</Text>
          </View>
        </View>
      </View>

      <View style={styles.brief}>
        <SectionHeading title="The brief" />
        <Text style={[type.body13, styles.briefCopy]}>
          {assignment.description.trim() || 'No description added yet.'}
        </Text>
      </View>

      <View style={styles.checklist}>
        <SectionHeading
          title="Checklist"
          trailing={total > 0 ? `${done} of ${total} complete` : 'No steps'}
        />
        {total > 0 ? <ProgressBar value={done / total} height={5} /> : null}
        {total === 0 ? (
          <EmptyState message="No checklist steps for this assignment." />
        ) : (
          <View style={styles.tasks}>
            {assignment.checklist.map((item) => (
              <Pressable
                key={item.id}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: item.done }}
                accessibilityLabel={item.label}
                onPress={() => toggleChecklist(assignment.id, item.id)}
                style={({ pressed }) => [styles.task, pressed && styles.pressed]}>
                <Checkbox checked={item.done} size={21} />
                <Text
                  style={[
                    type.task13,
                    styles.taskLabel,
                    { color: item.done ? colors.muted : colors.ink },
                  ]}>
                  {item.label}
                </Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>

      {assignment.attachment ? (
        <Pressable
          accessibilityRole="button"
          onPress={() =>
            Alert.alert(
              'Attachment',
              `${assignment.attachment}\n\nAttachments cannot be opened in this demo.`,
            )
          }
          style={({ pressed }) => [styles.attachment, pressed && styles.pressed]}>
          <Paperclip size={16} color={colors.muted} strokeWidth={1.5} />
          <Text style={[type.meta11Regular, styles.attachmentName]} numberOfLines={1}>
            {assignment.attachment}
          </Text>
        </Pressable>
      ) : null}

      <PrimaryButton
        label={assignment.completed ? 'Reopen assignment' : 'Mark as completed'}
        icon={Check}
        onPress={() => toggleCompleted(assignment.id)}
      />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  summary: {
    gap: 8,
  },
  statusRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  title: {
    color: colors.ink,
    marginTop: 5,
  },
  course: {
    color: colors.primaryDeep,
  },
  properties: {
    gap: 16,
    padding: 16,
    borderRadius: 16,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  property: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  propertyCopy: {
    flex: 1,
    gap: 4,
  },
  propertyLabel: {
    color: colors.muted,
    lineHeight: 15,
  },
  propertyValue: {
    color: colors.ink,
  },
  brief: {
    gap: 9,
  },
  briefCopy: {
    color: colors.muted,
  },
  checklist: {
    gap: 13,
  },
  tasks: {
    gap: 13,
  },
  task: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 21,
  },
  taskLabel: {
    flex: 1,
  },
  attachment: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    height: 42,
    paddingHorizontal: 13,
    borderRadius: 8,
    backgroundColor: colors.chip,
  },
  attachmentName: {
    flex: 1,
    color: colors.muted,
  },
  pressed: {
    opacity: 0.75,
  },
});
