import React from 'react';
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors } from '@/constants/colors';
import { type } from '@/constants/typography';

type Props = {
  label: string;
  active?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

/** 22px-tall rounded chip used for filters, statuses and types. */
export function Badge({ label, active = false, onPress, style }: Props) {
  const content = (
    <Text style={[type.badge10, { color: active ? colors.primaryDeep : colors.muted }]}>
      {label}
    </Text>
  );

  if (!onPress) {
    return (
      <View style={[styles.base, active ? styles.active : styles.inactive, style]}>{content}</View>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      hitSlop={4}
      style={({ pressed }) => [
        styles.base,
        active ? styles.active : styles.inactive,
        style,
        pressed && styles.pressed,
      ]}>
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 6,
  },
  active: {
    backgroundColor: colors.mint,
  },
  inactive: {
    backgroundColor: colors.chip,
  },
  pressed: {
    opacity: 0.72,
  },
});
