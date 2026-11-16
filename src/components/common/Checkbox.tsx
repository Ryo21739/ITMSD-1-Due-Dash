import { Check } from 'lucide-react-native';
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { colors } from '@/constants/colors';

type Props = {
  checked: boolean;
  onPress?: () => void;
  size?: number;
  radius?: number;
  /** Used on the completed cards where the box is always green. */
  label?: string;
};

export function Checkbox({ checked, onPress, size = 21, radius = 6, label }: Props) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      accessibilityLabel={label}
      onPress={onPress}
      hitSlop={8}
      style={[
        styles.box,
        {
          width: size,
          height: size,
          borderRadius: radius,
          backgroundColor: checked ? colors.primary : colors.white,
          borderColor: checked ? colors.primary : colors.border,
        },
      ]}>
      {checked ? (
        <Check size={Math.round(size * 0.66)} color={colors.white} strokeWidth={1.5} />
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  box: {
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
