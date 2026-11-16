import type { Assignment, Course } from '@/types/models';
import {
  addDays,
  endOfDay,
  formatShortDate,
  isSameDay,
  isThisWeek,
  startOfDay,
} from './dates';

export function sortByDue(list: Assignment[]): Assignment[] {
  return [...list].sort(
    (a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime(),
  );
}

export function openOnly(list: Assignment[]): Assignment[] {
  return list.filter((assignment) => !assignment.completed);
}

export function dueOn(list: Assignment[], day: Date): Assignment[] {
  return sortByDue(list.filter((assignment) => isSameDay(new Date(assignment.dueAt), day)));
}

export function dueToday(list: Assignment[], now = new Date()): Assignment[] {
  return dueOn(openOnly(list), now);
}

export function dueThisWeek(list: Assignment[], now = new Date()): Assignment[] {
  return openOnly(list).filter((assignment) => isThisWeek(new Date(assignment.dueAt), now));
}

export function upcomingAssignments(list: Assignment[], now = new Date()): Assignment[] {
  const endOfToday = endOfDay(now).getTime();
  return sortByDue(
    openOnly(list).filter((assignment) => new Date(assignment.dueAt).getTime() >= endOfToday),
  );
}

/** First open assignment strictly after `day`. */
export function nextAfter(list: Assignment[], day: Date): Assignment | null {
  const end = endOfDay(day).getTime();
  const candidates = sortByDue(openOnly(list)).filter(
    (assignment) => new Date(assignment.dueAt).getTime() > end,
  );
  return candidates[0] ?? null;
}

export function completedSorted(list: Assignment[]): Assignment[] {
  return list
    .filter((assignment) => assignment.completed)
    .sort(
      (a, b) =>
        new Date(b.completedAt ?? b.dueAt).getTime() -
        new Date(a.completedAt ?? a.dueAt).getTime(),
    );
}

/** Completed in the last 30 days — the count shown in the progress hero. */
export function recentlyCompleted(list: Assignment[], now = new Date()): Assignment[] {
  const since = addDays(startOfDay(now), -30).getTime();
  return completedSorted(list).filter(
    (assignment) => new Date(assignment.completedAt ?? assignment.dueAt).getTime() >= since,
  );
}

export function scheduledReminders(list: Assignment[]): Assignment[] {
  return [...list]
    .filter(
      (assignment) =>
        assignment.reminderEnabled && !assignment.completed && assignment.reminderAt,
    )
    .sort(
      (a, b) =>
        new Date(a.reminderAt ?? a.dueAt).getTime() -
        new Date(b.reminderAt ?? b.dueAt).getTime(),
    );
}

export function courseFor(courses: Course[], courseId: string): Course | undefined {
  return courses.find((course) => course.id === courseId);
}

export function courseLabel(course?: Course): string {
  return course ? `${course.code} - ${course.name}` : 'No course';
}

export function checklistDone(assignment: Assignment): number {
  return assignment.checklist.filter((item) => item.done).length;
}

export function checklistLabel(assignment: Assignment): string {
  return `${checklistDone(assignment)} / ${assignment.checklist.length} tasks`;
}

/** "20 Oct" — used in reminder copy. */
export function shortDate(iso: string): string {
  return formatShortDate(new Date(iso));
}
