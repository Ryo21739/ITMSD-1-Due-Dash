import type { LucideIcon } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors } from '@/constants/colors';

type Props = {
  icon: LucideIcon;
  size?: number;
  iconSize?: number;
  background?: string;
  color?: string;
  style?: StyleProp<ViewStyle>;
};

/** 34 × 34 mint tile used by the reminder notifications. */
export function IconTile({
  icon: Icon,
  size = 34,
  iconSize = 18,
  background = colors.mint,
  color = colors.primary,
  style,
}: Props) {
  return (
    <View
      style={[
        styles.tile,
        { width: size, height: size, borderRadius: 10, backgroundColor: background },
        style,
      ]}>
      <Icon size={iconSize} color={color} strokeWidth={1} />
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
