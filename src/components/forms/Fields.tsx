import type { LucideIcon } from 'lucide-react-native';
import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';

import { colors } from '@/constants/colors';
import { fonts, type } from '@/constants/typography';

type FieldProps = {
  label: string;
  right?: React.ReactNode;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function Field({ label, right, children, style }: FieldProps) {
  return (
    <View style={[styles.field, style]}>
      <View style={styles.labelRow}>
        <Text style={[type.label12, styles.label]}>{label}</Text>
        {right}
      </View>
      {children}
    </View>
  );
}

export function Input({ style, ...props }: TextInputProps) {
  return (
    <TextInput
      placeholderTextColor={colors.muted}
      style={[styles.input, styles.inputText, style]}
      {...props}
    />
  );
}

export function TextArea({ style, ...props }: TextInputProps) {
  return (
    <TextInput
      multiline
      textAlignVertical="top"
      placeholderTextColor={colors.muted}
      style={[styles.input, styles.area, style]}
      {...props}
    />
  );
}

type PressableFieldProps = {
  value?: string | null;
  placeholder: string;
  icon?: LucideIcon;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

/** Read-only field that opens a sheet / native picker. */
export function PressableField({
  value,
  placeholder,
  icon: Icon,
  onPress,
  style,
}: PressableFieldProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={value || placeholder}
      onPress={onPress}
      style={({ pressed }) => [styles.input, styles.pressable, style, pressed && styles.pressed]}>
      <Text
        numberOfLines={1}
        style={[styles.fieldValue, { color: value ? colors.ink : colors.muted }]}>
        {value || placeholder}
      </Text>
      {Icon ? <Icon size={17} color={colors.muted} strokeWidth={1.5} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: 8,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    minHeight: 15,
  },
  label: {
    color: colors.ink,
  },
  input: {
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    paddingHorizontal: 13,
  },
  inputText: {
    fontFamily: fonts.regular,
    fontSize: 13,
    lineHeight: 20,
    color: colors.ink,
    includeFontPadding: false,
    paddingVertical: 0,
  },
  area: {
    height: 80,
    paddingTop: 13,
    paddingBottom: 13,
    lineHeight: 19,
  },
  pressable: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  fieldValue: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 13,
    lineHeight: 20,
    includeFontPadding: false,
  },
  pressed: {
    opacity: 0.72,
  },
});
