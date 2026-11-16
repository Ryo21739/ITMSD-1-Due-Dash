import { router } from 'expo-router';
import { Plus, X } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert } from 'react-native';

import { PrimaryButton } from '@/components/common/PrimaryButton';
import {
  AssignmentFields,
  type AssignmentDraft,
} from '@/components/forms/AssignmentFields';
import { ChecklistEditor } from '@/components/forms/ChecklistEditor';
import { AppScreen } from '@/components/layout/AppScreen';
import { useAppData } from '@/hooks/use-app-data';
import { addDays, startOfDay, withTime } from '@/lib/dates';

function createDraft(): AssignmentDraft {
  const tomorrow = startOfDay(addDays(new Date(), 1));
  return {
    title: '',
    courseId: null,
    type: 'Homework',
    description: '',
    dueDate: withTime(tomorrow, 23, 59),
    reminderEnabled: true,
    reminderAt: withTime(tomorrow, 9, 0),
    checklist: [],
  };
}

export default function AddAssignmentScreen() {
  const { addAssignment } = useAppData();
  const [draft, setDraft] = useState<AssignmentDraft>(createDraft);
  const [checklistOpen, setChecklistOpen] = useState(false);

  const handleSave = () => {
    if (!draft.title.trim()) {
      Alert.alert('Add a title', 'Give this assignment a short, clear name.');
      return;
    }
    if (!draft.courseId) {
      Alert.alert('Choose a course', 'Pick the course this assignment belongs to.');
      return;
    }

    const created = addAssignment({
      title: draft.title,
      courseId: draft.courseId,
      type: draft.type,
      description: draft.description,
      dueAt: draft.dueDate,
      reminderEnabled: draft.reminderEnabled,
      reminderAt: draft.reminderEnabled ? draft.reminderAt : null,
      checklist: draft.checklist.map((item) => item.label),
    });

    router.replace(`/assignment/${created.id}`);
  };

  return (
    <AppScreen
      title="Add assignment"
      subtitle="A new task, a clearer plan"
      onBack={() => router.back()}
      rightIcon={X}
      rightLabel="Close"
      onRightPress={() => router.back()}
      active="tasks"
      topPadding={12}
      gap={16}>
      <AssignmentFields draft={draft} setDraft={setDraft} showType />

      <ChecklistEditor
        items={draft.checklist}
        onChange={(checklist) => setDraft((prev) => ({ ...prev, checklist }))}
        open={checklistOpen}
        onOpenChange={setChecklistOpen}
      />

      <PrimaryButton label="Save assignment" icon={Plus} onPress={handleSave} />
    </AppScreen>
  );
}
