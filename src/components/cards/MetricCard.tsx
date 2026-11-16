import React from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors } from '@/constants/colors';
import { type } from '@/constants/typography';

type Props = {
  value: number | string;
  label: string;
  highlighted?: boolean;
  style?: StyleProp<ViewStyle>;
};

/** 82px "Due today / This week / Open tasks" metric tile. */
export function MetricCard({ value, label, highlighted = false, style }: Props) {
  return (
    <View style={[styles.card, highlighted ? styles.highlighted : styles.plain, style]}>
      <Text style={[type.title29, { color: highlighted ? colors.white : colors.ink }]}>
        {value}
      </Text>
      <Text style={[type.micro10, { color: highlighted ? colors.mintOnGreen : colors.muted }]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    gap: 7,
    padding: 14,
    borderRadius: 16,
    minHeight: 82,
  },
  highlighted: {
    backgroundColor: colors.primary,
  },
  plain: {
    backgroundColor: colors.white,
  },
});
