import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

import { createSeedData } from '@/lib/seed';
import { createId } from '@/lib/id';
import type { AppData, Assignment, NewAssignmentInput } from '@/types/models';

const STORAGE_KEY = 'due-dash:data:v1';

type AppDataValue = {
  data: AppData;
  hydrated: boolean;
  addAssignment: (input: NewAssignmentInput) => Assignment;
  updateAssignment: (id: string, patch: Partial<Assignment>) => void;
  toggleChecklist: (assignmentId: string, itemId: string) => void;
  toggleCompleted: (id: string) => void;
  markAllRead: () => void;
  markRead: (id: string) => void;
  setRemindersEnabled: (value: boolean) => void;
  toggleGoal: (id: string) => void;
};

const AppDataContext = createContext<AppDataValue | null>(null);

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<AppData>(() => createSeedData());
  const [hydrated, setHydrated] = useState(false);
  const hydratedRef = useRef(false);

  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (!active) return;
        if (raw) {
          try {
            const parsed = JSON.parse(raw) as Partial<AppData>;
            if (parsed && Array.isArray(parsed.assignments)) {
              setData({ ...createSeedData(), ...parsed });
            }
          } catch {
            // Corrupt payload — fall back to the seed.
          }
        }
        hydratedRef.current = true;
        setHydrated(true);
      })
      .catch(() => {
        if (!active) return;
        hydratedRef.current = true;
        setHydrated(true);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!hydratedRef.current) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data)).catch(() => {
      // Persistence is best-effort; the in-memory store still works.
    });
  }, [data]);

  const addAssignment = useCallback((input: NewAssignmentInput) => {
    const now = new Date();
    const assignment: Assignment = {
      id: createId('a'),
      title: input.title.trim(),
      courseId: input.courseId,
      type: input.type,
      description: input.description.trim(),
      dueAt: input.dueAt.toISOString(),
      reminderEnabled: input.reminderEnabled,
      reminderAt:
        input.reminderEnabled && input.reminderAt ? input.reminderAt.toISOString() : null,
      completed: false,
      completedAt: null,
      checklist: input.checklist
        .map((label) => label.trim())
        .filter(Boolean)
        .map((label) => ({ id: createId('c'), label, done: false })),
      attachment: null,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };
    setData((prev) => ({ ...prev, assignments: [assignment, ...prev.assignments] }));
    return assignment;
  }, []);

  const updateAssignment = useCallback((id: string, patch: Partial<Assignment>) => {
    setData((prev) => ({
      ...prev,
      assignments: prev.assignments.map((assignment) =>
        assignment.id === id
          ? { ...assignment, ...patch, updatedAt: new Date().toISOString() }
          : assignment,
      ),
    }));
  }, []);

  const toggleChecklist = useCallback((assignmentId: string, itemId: string) => {
    setData((prev) => ({
      ...prev,
      assignments: prev.assignments.map((assignment) =>
        assignment.id === assignmentId
          ? {
              ...assignment,
              updatedAt: new Date().toISOString(),
              checklist: assignment.checklist.map((item) =>
                item.id === itemId ? { ...item, done: !item.done } : item,
              ),
            }
          : assignment,
      ),
    }));
  }, []);

  const toggleCompleted = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      assignments: prev.assignments.map((assignment) => {
        if (assignment.id !== id) return assignment;
        const completed = !assignment.completed;
        return {
          ...assignment,
          completed,
          completedAt: completed ? new Date().toISOString() : null,
          updatedAt: new Date().toISOString(),
        };
      }),
    }));
  }, []);

  const markAllRead = useCallback(() => {
    setData((prev) => ({
      ...prev,
      notifications: prev.notifications.map((notification) => ({
        ...notification,
        unread: false,
      })),
    }));
  }, []);

  const markRead = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      notifications: prev.notifications.map((notification) =>
        notification.id === id ? { ...notification, unread: false } : notification,
      ),
    }));
  }, []);

  const setRemindersEnabled = useCallback((value: boolean) => {
    setData((prev) => ({ ...prev, remindersEnabled: value }));
  }, []);

  const toggleGoal = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      goals: prev.goals.map((goal) => (goal.id === id ? { ...goal, done: !goal.done } : goal)),
    }));
  }, []);

  const value = useMemo<AppDataValue>(
    () => ({
      data,
      hydrated,
      addAssignment,
      updateAssignment,
      toggleChecklist,
      toggleCompleted,
      markAllRead,
      markRead,
      setRemindersEnabled,
      toggleGoal,
    }),
    [
      data,
      hydrated,
      addAssignment,
      updateAssignment,
      toggleChecklist,
      toggleCompleted,
      markAllRead,
      markRead,
      setRemindersEnabled,
      toggleGoal,
    ],
  );

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData(): AppDataValue {
  const context = useContext(AppDataContext);
  if (!context) throw new Error('useAppData must be used inside <AppDataProvider>');
  return context;
}
