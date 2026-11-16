import { router } from 'expo-router';
import { Bell, ChevronLeft, ChevronRight, Plus } from 'lucide-react-native';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AssignmentCard } from '@/components/cards/AssignmentCard';
import { EmptyState } from '@/components/common/EmptyState';
import { SectionHeading } from '@/components/common/SectionHeading';
import { AppScreen } from '@/components/layout/AppScreen';
import { colors } from '@/constants/colors';
import { fonts, type } from '@/constants/typography';
import { useAppData } from '@/hooks/use-app-data';
import {
  addDays,
  dateKey,
  formatLookingAhead,
  formatMonthYear,
  formatShortDate,
  formatTime,
  formatWeekdayDate,
  isSameDay,
  isSameMonth,
  startOfDay,
} from '@/lib/dates';
import {
  courseFor,
  dueOn,
  nextAfter,
  openOnly,
  scheduledReminders,
} from '@/lib/selectors';

export default function CalendarScreen() {
  const { data, toggleCompleted } = useAppData();
  const now = new Date();

  const [month, setMonth] = useState(() => new Date(now.getFullYear(), now.getMonth(), 1));
  const [selected, setSelected] = useState(() => startOfDay(addDays(now, 1)));

  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const firstOfMonth = new Date(year, monthIndex, 1);
  const offset = (firstOfMonth.getDay() + 6) % 7;
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const totalCells = Math.ceil((offset + daysInMonth) / 7) * 7;
  const cells = Array.from({ length: totalCells }, (_, index) =>
    addDays(firstOfMonth, index - offset),
  );
  const weeks = Array.from({ length: totalCells / 7 }, (_, row) =>
    cells.slice(row * 7, row * 7 + 7),
  );

  const dueDays = new Set(
    openOnly(data.assignments).map((assignment) => dateKey(new Date(assignment.dueAt))),
  );

  const selectedAssignments = dueOn(data.assignments, selected);
  const reminders = scheduledReminders(data.assignments);
  const nextReminder = reminders[0];
  const ahead = nextAfter(data.assignments, selected);

  const reminderTitle = !data.remindersEnabled
    ? 'Reminders are off'
    : 'We’ll remind you before it’s due';
  const reminderBody = !data.remindersEnabled
    ? 'Turn reminders back on from the Reminders screen.'
    : nextReminder
      ? `${formatShortDate(new Date(nextReminder.reminderAt ?? nextReminder.dueAt))} at ${formatTime(
          new Date(nextReminder.reminderAt ?? nextReminder.dueAt),
        )} · ${nextReminder.title}`
      : 'Add a reminder from any assignment.';

  return (
    <AppScreen
      title="Calendar"
      subtitle="Every deadline, in one place"
      rightIcon={Plus}
      rightLabel="Add assignment"
      onRightPress={() => router.push('/assignment/new')}
      active="calendar"
      topPadding={18}
      gap={20}>
      <View style={styles.calendarCard}>
        <View style={styles.monthControls}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Previous month"
            hitSlop={8}
            onPress={() => setMonth(new Date(year, monthIndex - 1, 1))}>
            <ChevronLeft size={18} color={colors.ink} strokeWidth={1.5} />
          </Pressable>
          <Text style={[type.title18, styles.month]}>{formatMonthYear(month)}</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Next month"
            hitSlop={8}
            onPress={() => setMonth(new Date(year, monthIndex + 1, 1))}>
            <ChevronRight size={18} color={colors.ink} strokeWidth={1.5} />
          </Pressable>
        </View>

        <View style={styles.weekdayRow}>
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((label, index) => (
            <Text key={`${label}-${index}`} style={[type.badge10, styles.weekday]}>
              {label}
            </Text>
          ))}
        </View>

        <View style={styles.weeks}>
          {weeks.map((week) => (
            <View key={week[0].toISOString()} style={styles.week}>
              {week.map((day) => {
                const selectedDay = isSameDay(day, selected);
                const todayDay = isSameDay(day, now);
                const inMonth = isSameMonth(day, month);
                const hasDue = inMonth && dueDays.has(dateKey(day));
                const light = selectedDay || todayDay;

                return (
                  <Pressable
                    key={day.toISOString()}
                    accessibilityRole="button"
                    accessibilityLabel={formatWeekdayDate(day)}
                    accessibilityState={{ selected: selectedDay }}
                    onPress={() => setSelected(startOfDay(day))}
                    style={[
                      styles.day,
                      selectedDay && styles.daySelected,
                      !selectedDay && todayDay && styles.dayToday,
                    ]}>
                    <Text
                      style={[
                        styles.dayDate,
                        {
                          color: light
                            ? colors.white
                            : inMonth
                              ? colors.ink
                              : colors.faint,
                          fontFamily: light ? fonts.bold : fonts.regular,
                        },
                      ]}>
                      {day.getDate()}
                    </Text>
                    {hasDue ? (
                      <View
                        style={[
                          styles.dot,
                          { backgroundColor: light ? colors.white : colors.primary },
                        ]}
                      />
                    ) : null}
                  </Pressable>
                );
              })}
            </View>
          ))}
        </View>

        <View style={styles.legend}>
          <View style={styles.legendLeft}>
            <View style={styles.legendDot} />
            <Text style={[type.micro10, styles.legendText]}>Assignment due</Text>
          </View>
          <Text style={[type.micro10, styles.legendText]}>
            {`Today: ${formatShortDate(now)}`}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <SectionHeading
          title={formatWeekdayDate(selected)}
          trailing={`${selectedAssignments.length} due`}
        />
        {selectedAssignments.length === 0 ? (
          <EmptyState message="Nothing due on this day." />
        ) : (
          selectedAssignments.map((assignment) => (
            <AssignmentCard
              key={assignment.id}
              assignment={assignment}
              course={courseFor(data.courses, assignment.courseId)}
              onPress={() => router.push(`/assignment/${assignment.id}`)}
              onToggleComplete={() => toggleCompleted(assignment.id)}
              timeFirst
            />
          ))
        )}
      </View>

      <View style={styles.reminder}>
        <Bell size={20} color={colors.primary} strokeWidth={1.5} />
        <View style={styles.reminderCopy}>
          <Text style={[type.copy12, styles.reminderTitle]}>{reminderTitle}</Text>
          <Text style={[type.note11, styles.reminderBody]}>{reminderBody}</Text>
        </View>
      </View>

      <Text style={[type.copy12, styles.ahead]}>
        {ahead
          ? `Looking ahead: ${ahead.title} is due ${formatLookingAhead(
              new Date(ahead.dueAt),
            )}.`
          : 'Nothing else on the horizon. You’re all caught up.'}
      </Text>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  calendarCard: {
    gap: 18,
    padding: 16,
    borderRadius: 16,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  monthControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 22,
  },
  month: {
    color: colors.ink,
  },
  weekdayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  weekday: {
    width: 38,
    color: colors.muted,
    textAlign: 'center',
  },
  weeks: {
    gap: 7,
  },
  week: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  day: {
    width: 38,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  daySelected: {
    backgroundColor: colors.primary,
  },
  dayToday: {
    backgroundColor: colors.inkDeep,
  },
  dayDate: {
    fontSize: 13,
    lineHeight: 16,
    includeFontPadding: false,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 100,
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  legendLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  legendDot: {
    width: 5,
    height: 5,
    borderRadius: 100,
    backgroundColor: colors.primary,
  },
  legendText: {
    color: colors.muted,
  },
  section: {
    gap: 10,
  },
  reminder: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 16,
    backgroundColor: colors.mint,
  },
  reminderCopy: {
    flex: 1,
    gap: 3,
  },
  reminderTitle: {
    color: colors.ink,
  },
  reminderBody: {
    color: colors.muted,
  },
  ahead: {
    color: colors.muted,
  },
});
