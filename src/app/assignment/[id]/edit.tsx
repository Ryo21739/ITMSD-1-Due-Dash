import { router, useLocalSearchParams } from 'expo-router';
import { Check, ChevronRight, ListChecks, X } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { Badge } from '@/components/common/Badge';
import { EmptyState } from '@/components/common/EmptyState';
import { PrimaryButton } from '@/components/common/PrimaryButton';
import {
  AssignmentFields,
  type AssignmentDraft,
} from '@/components/forms/AssignmentFields';
import { ChecklistEditor } from '@/components/forms/ChecklistEditor';
import { AppScreen } from '@/components/layout/AppScreen';
import { colors } from '@/constants/colors';
import { type } from '@/constants/typography';
import { useAppData } from '@/hooks/use-app-data';
import { formatSavedAt } from '@/lib/dates';
import { courseFor } from '@/lib/selectors';
import type { Assignment } from '@/types/models';

export default function EditAssignmentScreen() {
  const params = useLocalSearchParams<{ id?: string }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const { data } = useAppData();
  const assignment = data.assignments.find((item) => item.id === id);

  if (!assignment) {
    return (
      <AppScreen
        title="Edit assignment"
        subtitle="Keep the plan current"
        onBack={() => router.back()}
        active="tasks"
        topPadding={24}
        gap={16}>
        <EmptyState message="This assignment no longer exists." />
        <PrimaryButton label="Back to assignments" onPress={() => router.replace('/assignments')} />
      </AppScreen>
    );
  }

  return <EditAssignmentForm key={assignment.id} assignment={assignment} />;
}

function EditAssignmentForm({ assignment }: { assignment: Assignment }) {
  const { data, updateAssignment } = useAppData();
  const course = courseFor(data.courses, assignment.courseId);

  const [draft, setDraft] = useState<AssignmentDraft>(() => ({
    title: assignment.title,
    courseId: assignment.courseId,
    type: assignment.type,
    description: assignment.description,
    dueDate: new Date(assignment.dueAt),
    reminderEnabled: assignment.reminderEnabled,
    reminderAt: assignment.reminderAt ? new Date(assignment.reminderAt) : null,
    checklist: assignment.checklist.map((item) => ({
      id: item.id,
      label: item.label,
      done: item.done,
    })),
  }));
  const [checklistOpen, setChecklistOpen] = useState(false);

  const done = draft.checklist.filter((item) => item.done).length;
  const total = draft.checklist.length;

  const handleSave = () => {
    if (!draft.title.trim()) {
      Alert.alert('Add a title', 'Give this assignment a short, clear name.');
      return;
    }
    if (!draft.courseId) {
      Alert.alert('Choose a course', 'Pick the course this assignment belongs to.');
      return;
    }

    const checklist = draft.checklist
      .map((item) => ({ ...item, label: item.label.trim() }))
      .filter((item) => item.label.length > 0)
      .map((item) => ({ id: item.id, label: item.label, done: item.done }));

    updateAssignment(assignment.id, {
      title: draft.title.trim(),
      courseId: draft.courseId,
      type: draft.type,
      description: draft.description.trim(),
      dueAt: draft.dueDate.toISOString(),
      reminderEnabled: draft.reminderEnabled,
      reminderAt:
        draft.reminderEnabled && draft.reminderAt ? draft.reminderAt.toISOString() : null,
      checklist,
    });

    router.back();
  };

  return (
    <AppScreen
      title="Edit assignment"
      subtitle={`${assignment.title} · ${course?.code ?? 'No course'}`}
      onBack={() => router.back()}
      rightIcon={X}
      rightLabel="Close"
      onRightPress={() => router.back()}
      active="tasks"
      topPadding={8}
      gap={16}>
      <View style={styles.form}>
        <View style={styles.statusRow}>
          <Badge label={assignment.completed ? 'Completed' : 'In progress'} active />
          <Text style={[type.micro10, styles.saved]}>
            {formatSavedAt(new Date(assignment.updatedAt))}
          </Text>
        </View>

        <AssignmentFields
          draft={draft}
          setDraft={setDraft}
          reminderLayout="inline"
        />
      </View>

      <View style={styles.checklistBlock}>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ expanded: checklistOpen }}
          accessibilityLabel="Checklist"
          onPress={() => setChecklistOpen((open) => !open)}
          style={({ pressed }) => [styles.checklistCard, pressed && styles.pressed]}>
          <ListChecks size={20} color={colors.primary} strokeWidth={1.5} />
          <View style={styles.checklistCopy}>
            <Text style={[type.label12, styles.checklistTitle]}>
              {`Checklist · ${done} of ${total} complete`}
            </Text>
            <Text style={[type.micro10, styles.checklistBody]}>
              Your completed steps will stay checked.
            </Text>
          </View>
          <ChevronRight
            size={16}
            color={colors.primary}
            strokeWidth={1.5}
            style={checklistOpen ? styles.chevronOpen : undefined}
          />
        </Pressable>

        {checklistOpen ? (
          <ChecklistEditor
            items={draft.checklist}
            onChange={(checklist) => setDraft((prev) => ({ ...prev, checklist }))}
            open
            onOpenChange={setChecklistOpen}
            triggerLabel={null}
          />
        ) : null}
      </View>

      <View style={styles.actions}>
        <PrimaryButton label="Save changes" icon={Check} onPress={handleSave} />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Cancel changes"
          onPress={() => router.back()}
          hitSlop={8}>
          <Text style={[type.label12, styles.cancel]}>Cancel changes</Text>
        </Pressable>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: 8,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    minHeight: 22,
  },
  saved: {
    color: colors.muted,
  },
  checklistBlock: {
    gap: 12,
  },
  checklistCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    borderRadius: 8,
    backgroundColor: colors.mint,
  },
  checklistCopy: {
    flex: 1,
    gap: 3,
  },
  checklistTitle: {
    color: colors.ink,
    lineHeight: 17,
  },
  checklistBody: {
    color: colors.muted,
    lineHeight: 15,
  },
  chevronOpen: {
    transform: [{ rotate: '90deg' }],
  },
  actions: {
    gap: 8,
  },
  cancel: {
    color: colors.muted,
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.85,
  },
});
