import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { colors } from '@/constants/colors';

type Props = {
  value: boolean;
  onValueChange: (value: boolean) => void;
  label?: string;
};

/** 42 × 25 switch drawn to the Figma measurements. */
export function Toggle({ value, onValueChange, label }: Props) {
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      accessibilityLabel={label}
      onPress={() => onValueChange(!value)}
      hitSlop={8}
      style={[styles.track, { backgroundColor: value ? colors.primary : colors.switchOff }]}>
      <View
        style={[styles.thumb, { transform: [{ translateX: value ? 17 : 0 }] }]}
        pointerEvents="none"
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: {
    width: 42,
    height: 25,
    borderRadius: 100,
    padding: 3,
    justifyContent: 'center',
  },
  thumb: {
    width: 19,
    height: 19,
    borderRadius: 100,
    backgroundColor: colors.white,
  },
});
