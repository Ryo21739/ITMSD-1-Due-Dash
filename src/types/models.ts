export type AssignmentType = 'Homework' | 'Project' | 'Exam';

export type ChecklistItem = {
  id: string;
  label: string;
  done: boolean;
};

export type Assignment = {
  id: string;
  title: string;
  courseId: string;
  type: AssignmentType;
  description: string;
  /** ISO string */
  dueAt: string;
  reminderEnabled: boolean;
  /** ISO string or null */
  reminderAt: string | null;
  completed: boolean;
  /** ISO string or null */
  completedAt: string | null;
  checklist: ChecklistItem[];
  attachment: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Course = {
  id: string;
  code: string;
  name: string;
  fullName: string;
  /** Shown in the "Course workload" list. */
  featured: boolean;
  /** Seeded workload numbers from the design. */
  completed: number;
  percent: number;
  nextTitle: string | null;
  /** Days from "today" for the next deadline shown on the course card. */
  nextOffset: number;
  nextTime: { h: number; m: number };
};

export type NotificationKind = 'digest' | 'file' | 'bell' | 'calendar';

export type AppNotification = {
  id: string;
  title: string;
  body: string;
  /** Pre-formatted, e.g. "9:00 AM · Daily digest" */
  timestamp: string;
  unread: boolean;
  kind: NotificationKind;
  assignmentId: string | null;
};

export type Goal = {
  id: string;
  label: string;
  done: boolean;
};

export type AppData = {
  assignments: Assignment[];
  courses: Course[];
  notifications: AppNotification[];
  goals: Goal[];
  remindersEnabled: boolean;
};

export type NewAssignmentInput = {
  title: string;
  courseId: string;
  type: AssignmentType;
  description: string;
  dueAt: Date;
  reminderEnabled: boolean;
  reminderAt: Date | null;
  checklist: string[];
};

export type StudentProfile = {
  firstName: string;
  lastName: string;
  email: string;
};
