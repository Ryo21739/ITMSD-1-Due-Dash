/** Measurements shared by every frame in the Figma file (402 × 874 iPhone 16 Pro). */
export const layout = {
  /** Horizontal page padding used on every screen. */
  page: 24,
  /** Dark page header content height (status bar excluded). */
  header: 82,
  /** Header inner padding: 12 top / 20 bottom. */
  headerPadTop: 12,
  headerPadBottom: 20,
  /** 36 × 36 circular header action. */
  action: 36,
  /** Bottom navigation row height. */
  navRow: 38,
  navPadTop: 12,
  navPadBottom: 8,
  /** Cards */
  cardRadius: 16,
  cardPad: 15,
  /** Inputs / buttons */
  inputRadius: 8,
  /** Badges / checkboxes */
  badgeRadius: 6,
  checkboxRadius: 6,
  controlRadius: 7,
  /** Pills / tracks */
  pillRadius: 100,
} as const;
