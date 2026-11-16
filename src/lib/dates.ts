/**
 * Date helpers. All display strings are produced manually so the output is
 * deterministic (and matches the formats used in the Figma file) on every device.
 */

export const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;

export const MONTHS_SHORT = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const;

export const WEEKDAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
] as const;

export const WEEKDAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);

export function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function endOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
}

export function addDays(d: Date, n: number): Date {
  const next = new Date(d);
  next.setDate(next.getDate() + n);
  return next;
}

/** A date `days` away from `base`, pinned to a specific local time. */
export function atTime(base: Date, days: number, hours: number, minutes = 0): Date {
  const d = startOfDay(addDays(base, days));
  d.setHours(hours, minutes, 0, 0);
  return d;
}

export function withTime(date: Date, hours: number, minutes: number): Date {
  const d = new Date(date);
  d.setHours(hours, minutes, 0, 0);
  return d;
}

/** Monday-based start of the week containing `d`. */
export function startOfWeek(d: Date): Date {
  const day = startOfDay(d);
  const offset = (day.getDay() + 6) % 7;
  return addDays(day, -offset);
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function isSameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

export function isToday(d: Date, now = new Date()): boolean {
  return isSameDay(d, now);
}

export function isTomorrow(d: Date, now = new Date()): boolean {
  return isSameDay(d, addDays(now, 1));
}

export function isPast(d: Date, now = new Date()): boolean {
  return d.getTime() < now.getTime();
}

export function isThisWeek(d: Date, now = new Date()): boolean {
  const start = startOfWeek(now).getTime();
  const end = addDays(startOfWeek(now), 7).getTime();
  return d.getTime() >= start && d.getTime() < end;
}

/** Local `YYYY-MM-DD` key (safe for grouping, unlike toISOString). */
export function dateKey(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function formatTime(d: Date): string {
  let hours = d.getHours();
  const minutes = d.getMinutes();
  const suffix = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  if (hours === 0) hours = 12;
  return `${hours}:${pad(minutes)} ${suffix}`;
}

export function formatMonthYear(d: Date): string {
  return `${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

/** "MONDAY, 16 NOVEMBER 2026" — header subtitle. */
export function formatHeaderDate(d: Date): string {
  return `${WEEKDAYS[d.getDay()].toUpperCase()}, ${d.getDate()} ${MONTHS[
    d.getMonth()
  ].toUpperCase()} ${d.getFullYear()}`;
}

/** "Tuesday, 17 November" — calendar selected day. */
export function formatWeekdayDate(d: Date): string {
  return `${WEEKDAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

/** "17 Nov" */
export function formatShortDate(d: Date): string {
  return `${d.getDate()} ${MONTHS_SHORT[d.getMonth()]}`;
}

/** "Tue, 17 Nov 2026" */
export function formatLongDate(d: Date): string {
  return `${WEEKDAYS_SHORT[d.getDay()]}, ${d.getDate()} ${MONTHS_SHORT[d.getMonth()]} ${d.getFullYear()}`;
}

/** "Tue, 17 Nov" */
export function formatLongDateNoYear(d: Date): string {
  return `${WEEKDAYS_SHORT[d.getDay()]}, ${d.getDate()} ${MONTHS_SHORT[d.getMonth()]}`;
}

/** Card deadline: "Today · 5:00 PM" / "Tomorrow · 11:59 PM" / "20 Nov · 4:00 PM" */
export function formatDeadline(d: Date, now = new Date()): string {
  if (isSameDay(d, now)) return `Today · ${formatTime(d)}`;
  if (isSameDay(d, addDays(now, 1))) return `Tomorrow · ${formatTime(d)}`;
  return `${formatShortDate(d)} · ${formatTime(d)}`;
}

/** Up-next deadline: "Tue, 17 Nov · 11:59 PM" */
export function formatDeadlineLong(d: Date, now = new Date()): string {
  if (isSameDay(d, now)) return `Today · ${formatTime(d)}`;
  if (isSameDay(d, addDays(now, 1))) return `Tomorrow · ${formatTime(d)}`;
  return `${WEEKDAYS_SHORT[d.getDay()]}, ${d.getDate()} ${MONTHS_SHORT[d.getMonth()]} · ${formatTime(
    d,
  )}`;
}

/** Calendar card: "11:59 PM · Tomorrow" */
export function formatTimeDay(d: Date, now = new Date()): string {
  if (isSameDay(d, now)) return `${formatTime(d)} · Today`;
  if (isSameDay(d, addDays(now, 1))) return `${formatTime(d)} · Tomorrow`;
  return `${formatTime(d)} · ${formatShortDate(d)}`;
}

/** Course card: "Today · 8:00 PM" / "20 Nov · 11:59 PM" */
export function formatCourseDue(d: Date, now = new Date()): string {
  if (isSameDay(d, now)) return `Today · ${formatTime(d)}`;
  return `${formatShortDate(d)} · ${formatTime(d)}`;
}

/** "Last saved today, 9:32 AM" */
export function formatSavedAt(d: Date, now = new Date()): string {
  if (isSameDay(d, now)) return `Last saved today, ${formatTime(d)}`;
  return `Last saved ${formatShortDate(d)}, ${formatTime(d)}`;
}

/** "Completed 14 Nov" */
export function formatCompleted(d: Date): string {
  return `Completed ${formatShortDate(d)}`;
}

/** "Monday, 26 November" for the looking-ahead line. */
export function formatLookingAhead(d: Date): string {
  return `${WEEKDAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

/**
 * 6 × 7 Monday-first month grid. Always returns 42 cells so the calendar keeps
 * a stable height while paging months.
 */
export function monthMatrix(year: number, month: number): Date[] {
  const first = new Date(year, month, 1);
  const offset = (first.getDay() + 6) % 7;
  const start = addDays(first, -offset);
  return Array.from({ length: 42 }, (_, i) => addDays(start, i));
}

export function monthRows(year: number, month: number): Date[][] {
  const cells = monthMatrix(year, month);
  return Array.from({ length: 6 }, (_, row) => cells.slice(row * 7, row * 7 + 7));
}

export function greetingFor(d: Date): string {
  const h = d.getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

export function timeParts(d: Date): { h: number; m: number } {
  return { h: d.getHours(), m: d.getMinutes() };
}
