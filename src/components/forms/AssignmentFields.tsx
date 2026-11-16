import { Bell, CalendarDays, ChevronDown, Clock } from 'lucide-react-native';
import React, { useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

import { Badge } from '@/components/common/Badge';
import { Toggle } from '@/components/common/Toggle';
import { DateTimeSheet } from '@/components/forms/DateTimeSheet';
import { Field, Input, PressableField, TextArea } from '@/components/forms/Fields';
import { OptionSheet } from '@/components/forms/OptionSheet';
import { colors } from '@/constants/colors';
import { type } from '@/constants/typography';
import { useAppData } from '@/hooks/use-app-data';
import { formatShortDate, formatTime, withTime } from '@/lib/dates';
import type { AssignmentType } from '@/types/models';

export type ChecklistDraft = {
  id: string;
  label: string;
  done: boolean;
};

export type AssignmentDraft = {
  title: string;
  courseId: string | null;
  type: AssignmentType;
  description: string;
  dueDate: Date;
  reminderEnabled: boolean;
  reminderAt: Date | null;
  checklist: ChecklistDraft[];
};

export const assignmentTypes: AssignmentType[] = ['Homework', 'Project', 'Exam'];

type Props = {
  draft: AssignmentDraft;
  setDraft: React.Dispatch<React.SetStateAction<AssignmentDraft>>;
  showType?: boolean;
  reminderLayout?: 'toggle' | 'inline';
};

type PickerKind = 'date' | 'time' | 'datetime' | null;

export function AssignmentFields({
  draft,
  setDraft,
  showType = false,
  reminderLayout = 'toggle',
}: Props) {
  const { data } = useAppData();
  const [courseOpen, setCourseOpen] = useState(false);
  const [duePicker, setDuePicker] = useState<PickerKind>(null);
  const [reminderPicker, setReminderPicker] = useState<PickerKind>(null);

  const course = data.courses.find((item) => item.id === draft.courseId);
  const dueDateLabel = `${formatShortDate(draft.dueDate)} ${draft.dueDate.getFullYear()}`;

  const patch = (values: Partial<AssignmentDraft>) =>
    setDraft((prev) => ({ ...prev, ...values }));

  const handleDueChange = (date: Date) => {
    patch({ dueDate: withTime(date, draft.dueDate.getHours(), draft.dueDate.getMinutes()) });
  };

  const handleReminderDate = (date: Date) => {
    const base = draft.reminderAt ?? withTime(draft.dueDate, 9, 0);
    patch({ reminderAt: withTime(date, base.getHours(), base.getMinutes()) });
    if (Platform.OS === 'android') setReminderPicker('time');
  };

  const handleReminderTime = (date: Date) => {
    const base = draft.reminderAt ?? withTime(draft.dueDate, 9, 0);
    patch({ reminderAt: withTime(base, date.getHours(), date.getMinutes()) });
  };

  const reminderValue = draft.reminderAt
    ? `${formatShortDate(draft.reminderAt)} ${draft.reminderAt.getFullYear()} · ${formatTime(
        draft.reminderAt,
      )}`
    : null;

  return (
    <View style={styles.root}>
      {showType ? (
        <View style={styles.types}>
          {assignmentTypes.map((item) => (
            <Badge
              key={item}
              label={item}
              active={draft.type === item}
              onPress={() => patch({ type: item })}
            />
          ))}
        </View>
      ) : null}

      <Field label="Assignment title">
        <Input
          value={draft.title}
          onChangeText={(title) => patch({ title })}
          placeholder="e.g. Research outline"
          autoCapitalize="sentences"
          returnKeyType="next"
        />
      </Field>

      <Field label="Course">
        <PressableField
          value={course ? `${course.code} - ${course.name}` : null}
          placeholder="Select a course"
          icon={ChevronDown}
          onPress={() => setCourseOpen(true)}
        />
      </Field>

      <Field label="Description">
        <TextArea
          value={draft.description}
          onChangeText={(description) => patch({ description })}
          placeholder="Add a short brief for this assignment"
          autoCapitalize="sentences"
        />
      </Field>

      <View style={styles.row}>
        <Field label="Due date" style={styles.half}>
          <PressableField
            value={dueDateLabel}
            placeholder="Select date"
            icon={CalendarDays}
            onPress={() => setDuePicker('date')}
          />
        </Field>
        <Field label="Due time" style={styles.half}>
          <PressableField
            value={formatTime(draft.dueDate)}
            placeholder="Select time"
            icon={Clock}
            onPress={() => setDuePicker('time')}
          />
        </Field>
      </View>

      {reminderLayout === 'toggle' ? (
        <>
          <View style={styles.reminderRow}>
            <View style={styles.reminderCopy}>
              <Text style={[type.body14Semi, styles.reminderTitle]}>Remind me</Text>
              <Text style={[type.note11, styles.reminderBody]}>
                A nudge before your deadline
              </Text>
            </View>
            <Toggle
              value={draft.reminderEnabled}
              onValueChange={(value) =>
                patch({
                  reminderEnabled: value,
                  reminderAt: value
                    ? draft.reminderAt ?? withTime(draft.dueDate, 9, 0)
                    : draft.reminderAt,
                })
              }
              label="Remind me"
            />
          </View>

          {draft.reminderEnabled ? (
            <Field label="Reminder">
              <PressableField
                value={reminderValue}
                placeholder="Select reminder time"
                icon={Bell}
                onPress={() => setReminderPicker(Platform.OS === 'ios' ? 'datetime' : 'date')}
              />
            </Field>
          ) : null}
        </>
      ) : (
        <Field
          label={`Reminder · ${draft.reminderEnabled ? 'Enabled' : 'Off'}`}
          right={
            <Toggle
              value={draft.reminderEnabled}
              onValueChange={(value) =>
                patch({
                  reminderEnabled: value,
                  reminderAt: value
                    ? draft.reminderAt ?? withTime(draft.dueDate, 9, 0)
                    : draft.reminderAt,
                })
              }
              label="Enable reminder"
            />
          }>
          <PressableField
            value={draft.reminderEnabled ? reminderValue : 'No reminder'}
            placeholder="Add a reminder"
            icon={Bell}
            onPress={() => {
              if (!draft.reminderEnabled) {
                patch({
                  reminderEnabled: true,
                  reminderAt: draft.reminderAt ?? withTime(draft.dueDate, 9, 0),
                });
              }
              setReminderPicker(Platform.OS === 'ios' ? 'datetime' : 'date');
            }}
          />
        </Field>
      )}

      <OptionSheet
        visible={courseOpen}
        title="Choose a course"
        options={data.courses.map((item) => ({
          id: item.id,
          label: `${item.code} - ${item.name}`,
        }))}
        selectedId={draft.courseId}
        onSelect={(courseId) => patch({ courseId })}
        onClose={() => setCourseOpen(false)}
      />

      <DateTimeSheet
        visible={duePicker === 'date'}
        mode="date"
        value={draft.dueDate}
        title="Due date"
        onChange={handleDueChange}
        onClose={() => setDuePicker(null)}
      />
      <DateTimeSheet
        visible={duePicker === 'time'}
        mode="time"
        value={draft.dueDate}
        title="Due time"
        onChange={handleDueChange}
        onClose={() => setDuePicker(null)}
      />

      <DateTimeSheet
        visible={reminderPicker === 'datetime'}
        mode="datetime"
        value={draft.reminderAt ?? withTime(draft.dueDate, 9, 0)}
        title="Reminder"
        onChange={(date) => patch({ reminderAt: date })}
        onClose={() => setReminderPicker(null)}
      />
      <DateTimeSheet
        visible={reminderPicker === 'date'}
        mode="date"
        value={draft.reminderAt ?? withTime(draft.dueDate, 9, 0)}
        title="Reminder date"
        onChange={handleReminderDate}
        onClose={() => setReminderPicker(null)}
      />
      <DateTimeSheet
        visible={reminderPicker === 'time'}
        mode="time"
        value={draft.reminderAt ?? withTime(draft.dueDate, 9, 0)}
        title="Reminder time"
        onChange={handleReminderTime}
        onClose={() => setReminderPicker(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: 16,
  },
  types: {
    flexDirection: 'row',
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  half: {
    flex: 1,
  },
  reminderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  reminderCopy: {
    flex: 1,
    gap: 4,
  },
  reminderTitle: {
    color: colors.ink,
  },
  reminderBody: {
    color: colors.muted,
  },
});
