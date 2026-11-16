import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/constants/colors';
import { type } from '@/constants/typography';

export function EmptyState({ message }: { message: string }) {
  return (
    <View style={styles.container}>
      <Text style={[type.copy12, styles.text]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: colors.muted,
    textAlign: 'center',
  },
});
