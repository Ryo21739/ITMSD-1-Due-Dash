import { router } from 'expo-router';
import { Settings2 } from 'lucide-react-native';
import React from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

import { NotificationCard } from '@/components/cards/NotificationCard';
import { EmptyState } from '@/components/common/EmptyState';
import { SectionHeading } from '@/components/common/SectionHeading';
import { Toggle } from '@/components/common/Toggle';
import { AppScreen } from '@/components/layout/AppScreen';
import { colors } from '@/constants/colors';
import { type } from '@/constants/typography';
import { useAppData } from '@/hooks/use-app-data';
import { formatShortDate, formatTime } from '@/lib/dates';
import { courseFor, scheduledReminders } from '@/lib/selectors';
import type { AppNotification } from '@/types/models';

export default function RemindersScreen() {
  const { data, markAllRead, markRead, setRemindersEnabled } = useAppData();

  const scheduled = scheduledReminders(data.assignments);
  const unread = data.notifications.filter((notification) => notification.unread).length;

  const scheduledCards: AppNotification[] = scheduled.map((assignment) => {
    const course = courseFor(data.courses, assignment.courseId);
    const due = new Date(assignment.dueAt);
    const reminder = new Date(assignment.reminderAt ?? assignment.dueAt);
    return {
      id: `reminder-${assignment.id}`,
      title: assignment.title,
      body: `${course?.code ?? 'Course'} · Due ${formatShortDate(due)} at ${formatTime(due)}`,
      timestamp: `Remind me · ${formatShortDate(reminder)}, ${formatTime(reminder)}`,
      unread: false,
      kind: 'bell',
      assignmentId: assignment.id,
    };
  });

  return (
    <AppScreen
      title="Reminders"
      subtitle="A heads-up for what matters"
      onBack={() => router.back()}
      rightIcon={Settings2}
      rightLabel="Reminder settings"
      onRightPress={() =>
        Alert.alert(
          'Reminder settings',
          'Deadline reminders and the daily digest are managed on this screen. Everything stays on your device.',
        )
      }
      active="tasks"
      topPadding={24}
      gap={20}>
      <View style={styles.preference}>
        <View style={styles.preferenceCopy}>
          <Text style={[type.body14Semi, styles.preferenceTitle]}>
            {data.remindersEnabled ? 'Deadline reminders are on' : 'Deadline reminders are off'}
          </Text>
          <Text style={[type.note11, styles.preferenceBody]}>
            {data.remindersEnabled
              ? 'Push notifications · Daily digest at 9 AM'
              : 'Turn on to get a nudge before each deadline'}
          </Text>
        </View>
        <Toggle
          value={data.remindersEnabled}
          onValueChange={setRemindersEnabled}
          label="Deadline reminders"
        />
      </View>

      <View style={styles.section}>
        <SectionHeading
          title="Today"
          trailing={unread > 0 ? 'Mark all read' : 'All read'}
          onTrailingPress={unread > 0 ? markAllRead : undefined}
        />
        {data.notifications.length === 0 ? (
          <EmptyState message="No notifications yet." />
        ) : (
          <View style={styles.list}>
            {data.notifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                onPress={() => {
                  markRead(notification.id);
                  if (notification.assignmentId) {
                    router.push(`/assignment/${notification.assignmentId}`);
                  }
                }}
              />
            ))}
          </View>
        )}
      </View>

      <View style={styles.section}>
        <SectionHeading
          title="Scheduled"
          trailing={`${scheduledCards.length} upcoming`}
        />
        {scheduledCards.length === 0 ? (
          <EmptyState message="No reminders scheduled. Turn one on from an assignment." />
        ) : (
          <View style={styles.list}>
            {scheduledCards.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                onPress={() => {
                  if (notification.assignmentId) {
                    router.push(`/assignment/${notification.assignmentId}`);
                  }
                }}
              />
            ))}
          </View>
        )}
      </View>

      <Text style={[type.note11, styles.footer]}>
        Change an assignment’s reminder anytime from its details.
      </Text>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  preference: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
    borderRadius: 16,
    backgroundColor: colors.mint,
  },
  preferenceCopy: {
    flex: 1,
    gap: 4,
  },
  preferenceTitle: {
    color: colors.ink,
  },
  preferenceBody: {
    color: colors.muted,
  },
  section: {
    gap: 12,
  },
  list: {
    gap: 12,
  },
  footer: {
    color: colors.muted,
  },
});
