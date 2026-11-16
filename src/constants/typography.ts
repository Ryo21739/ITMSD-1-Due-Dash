import type { TextStyle } from 'react-native';

/**
 * Inter is the only typeface in the Figma file.
 * Sizes / line-heights / tracking below are copied from the text styles
 * measured on the 11 high-fidelity frames.
 */
export const fonts = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
} as const;

const base: TextStyle = {
  includeFontPadding: false,
};

export const type = {
  display48: { ...base, fontFamily: fonts.bold, fontSize: 48, lineHeight: 58, letterSpacing: -2 },
  display40: { ...base, fontFamily: fonts.bold, fontSize: 40, lineHeight: 45, letterSpacing: -1.7 },
  title29: { ...base, fontFamily: fonts.bold, fontSize: 29, lineHeight: 35, letterSpacing: -0.9 },
  title26: { ...base, fontFamily: fonts.bold, fontSize: 26, lineHeight: 31, letterSpacing: -0.8 },
  title23: { ...base, fontFamily: fonts.bold, fontSize: 23, lineHeight: 28, letterSpacing: -0.6 },
  title18: { ...base, fontFamily: fonts.bold, fontSize: 18, lineHeight: 22 },
  section17: { ...base, fontFamily: fonts.bold, fontSize: 17, lineHeight: 21 },
  title16: { ...base, fontFamily: fonts.bold, fontSize: 16, lineHeight: 19 },
  body15: { ...base, fontFamily: fonts.regular, fontSize: 15, lineHeight: 22 },
  body14: { ...base, fontFamily: fonts.regular, fontSize: 14, lineHeight: 20 },
  body14Medium: { ...base, fontFamily: fonts.medium, fontSize: 14, lineHeight: 20 },
  body14Semi: { ...base, fontFamily: fonts.semibold, fontSize: 14, lineHeight: 20 },
  label14: { ...base, fontFamily: fonts.semibold, fontSize: 14, lineHeight: 17 },
  body13: { ...base, fontFamily: fonts.regular, fontSize: 13, lineHeight: 19 },
  task13: { ...base, fontFamily: fonts.regular, fontSize: 13, lineHeight: 16 },
  copy12: { ...base, fontFamily: fonts.regular, fontSize: 12, lineHeight: 17 },
  label12: { ...base, fontFamily: fonts.semibold, fontSize: 12, lineHeight: 15 },
  text12: { ...base, fontFamily: fonts.regular, fontSize: 12, lineHeight: 15 },
  note11: { ...base, fontFamily: fonts.regular, fontSize: 11, lineHeight: 16 },
  meta11: { ...base, fontFamily: fonts.semibold, fontSize: 11, lineHeight: 13 },
  meta11Regular: { ...base, fontFamily: fonts.regular, fontSize: 11, lineHeight: 13 },
  micro10: { ...base, fontFamily: fonts.regular, fontSize: 10, lineHeight: 12 },
  micro10Medium: { ...base, fontFamily: fonts.medium, fontSize: 10, lineHeight: 12 },
  micro10Semi: { ...base, fontFamily: fonts.semibold, fontSize: 10, lineHeight: 12 },
  meta10: { ...base, fontFamily: fonts.regular, fontSize: 10, lineHeight: 15 },
  badge10: { ...base, fontFamily: fonts.semibold, fontSize: 10, lineHeight: 12 },
} satisfies Record<string, TextStyle>;

export type TypeName = keyof typeof type;
