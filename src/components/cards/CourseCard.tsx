import { ChevronRight } from 'lucide-react-native';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ProgressBar } from '@/components/common/ProgressBar';
import { colors } from '@/constants/colors';
import { layout } from '@/constants/layout';
import { type } from '@/constants/typography';

type Props = {
  code: string;
  title: string;
  completed: number;
  percent: number;
  nextTitle: string | null;
  nextDue: string | null;
  onPress?: () => void;
};

/** 143px "Course workload" card. */
export function CourseCard({
  code,
  title,
  completed,
  percent,
  nextTitle,
  nextDue,
  onPress,
}: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${code}, ${title}`}
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={styles.heading}>
        <Text style={[type.badge10, styles.code]}>{code.toUpperCase()}</Text>
        <ChevronRight size={15} color={colors.muted} strokeWidth={1.5} />
      </View>

      <Text style={[type.title16, styles.title]} numberOfLines={1}>
        {title}
      </Text>

      <View style={styles.count}>
        <Text style={[type.meta11Regular, styles.completed]}>{completed} completed</Text>
        <Text style={[type.meta11, styles.percent]}>{percent}%</Text>
      </View>

      <ProgressBar value={percent / 100} height={4} minFill={5} />

      <View style={styles.next}>
        <Text style={[type.micro10, styles.nextTitle]} numberOfLines={1}>
          {nextTitle ?? 'No upcoming work'}
        </Text>
        {nextDue ? (
          <Text style={[type.micro10Semi, styles.nextDue]} numberOfLines={1}>
            {nextDue}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 12,
    padding: 16,
    borderRadius: layout.cardRadius,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pressed: {
    opacity: 0.9,
  },
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 15,
  },
  code: {
    color: colors.primary,
    letterSpacing: 0.7,
  },
  title: {
    color: colors.ink,
  },
  count: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  completed: {
    color: colors.muted,
  },
  percent: {
    color: colors.primaryDeep,
  },
  next: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minHeight: 12,
  },
  nextTitle: {
    flex: 1,
    color: colors.muted,
  },
  nextDue: {
    color: colors.primaryDeep,
  },
});
