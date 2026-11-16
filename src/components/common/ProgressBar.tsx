import React from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors } from '@/constants/colors';

type Props = {
  /** 0 – 1 */
  value: number;
  height?: number;
  trackColor?: string;
  fillColor?: string;
  /** Keeps a small stub visible at 0% (the course cards do this in Figma). */
  minFill?: number;
  style?: StyleProp<ViewStyle>;
};

export function ProgressBar({
  value,
  height = 5,
  trackColor = colors.track,
  fillColor = colors.primary,
  minFill = 0,
  style,
}: Props) {
  const ratio = Math.max(0, Math.min(1, Number.isFinite(value) ? value : 0));

  return (
    <View
      style={[styles.track, { height, backgroundColor: trackColor }, style]}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(ratio * 100) }}>
      <View
        style={{
          height: '100%',
          width: `${ratio * 100}%`,
          minWidth: minFill,
          borderRadius: 100,
          backgroundColor: fillColor,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    borderRadius: 100,
    overflow: 'hidden',
    alignSelf: 'stretch',
  },
});
