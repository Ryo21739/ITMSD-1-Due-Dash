/**
 * Palette extracted 1:1 from the Figma file (TEAM SOKSULA Due Dash).
 * Every value below appears verbatim in the design's fills/strokes.
 */
export const colors = {
  /** App canvas */
  bg: '#f5f7f6',
  /** Header, hero panels, today cell */
  inkDeep: '#262827',
  /** Primary text */
  ink: '#242a27',
  /** 36px circular header action */
  headerAction: '#3b403d',
  white: '#ffffff',

  /** Secondary text */
  muted: '#737c77',
  /** Text on dark header (subtitle) */
  onDarkMuted: '#b7c2bc',
  /** Text on dark hero (body copy) */
  onDarkBody: '#c0c8c3',
  /** Out-of-month calendar dates */
  faint: '#c3cac6',

  /** Brand green */
  primary: '#009c68',
  /** Links, deadlines, deep accents */
  primaryDeep: '#007d53',
  /** Mint surfaces */
  mint: '#e7f5ef',
  mintOnGreen: '#dcf5ea',
  mintOnGreen2: '#d6f1e6',
  /** Neutral chip */
  chip: '#edf0ee',

  /** Card + input borders */
  border: '#e2e7e4',
  /** Unread notification border */
  borderUnread: '#b7decd',
  /** Progress track */
  track: '#e2e7e4',

  /** Due-today deadline text */
  warning: '#9b671c',

  /** Inactive switch track */
  switchOff: '#e2e7e4',
} as const;

export type ColorName = keyof typeof colors;
