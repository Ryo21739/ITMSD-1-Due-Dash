import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/constants/colors';
import { type } from '@/constants/typography';

type Props = {
  title: string;
  trailing?: string;
  onTrailingPress?: () => void;
};

export function SectionHeading({ title, trailing, onTrailingPress }: Props) {
  return (
    <View style={styles.row}>
      <Text style={[type.section17, styles.title]} numberOfLines={1}>
        {title}
      </Text>
      {trailing ? (
        onTrailingPress ? (
          <Pressable onPress={onTrailingPress} hitSlop={8}>
            <Text style={[type.label12, styles.trailing]}>{trailing}</Text>
          </Pressable>
        ) : (
          <Text style={[type.label12, styles.trailing]}>{trailing}</Text>
        )
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    minHeight: 21,
  },
  title: {
    color: colors.ink,
    flexShrink: 1,
  },
  trailing: {
    color: colors.primary,
  },
});
