import { ArrowLeft, type LucideIcon } from 'lucide-react-native';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/constants/colors';
import { layout } from '@/constants/layout';
import { type } from '@/constants/typography';

type Props = {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  /** "circle" is used by the Login frame (36px pill + label). */
  backStyle?: 'plain' | 'circle';
  backLabel?: string;
  rightIcon?: LucideIcon;
  onRightPress?: () => void;
  rightLabel?: string;
};

/** 126px dark page header (status bar + 82px heading). */
export function DarkHeader({
  title,
  subtitle,
  onBack,
  backStyle = 'plain',
  backLabel,
  rightIcon: RightIcon,
  onRightPress,
  rightLabel,
}: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) }]}>
      <View style={styles.heading}>
        {onBack ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={backLabel ?? 'Go back'}
            onPress={onBack}
            hitSlop={backStyle === 'circle' ? 0 : 10}
            style={({ pressed }) =>
              backStyle === 'circle'
                ? [styles.circle, pressed && styles.pressed]
                : pressed && styles.pressed
            }>
            <ArrowLeft
              size={backStyle === 'circle' ? 18 : 20}
              color={colors.white}
              strokeWidth={1.5}
            />
          </Pressable>
        ) : null}

        {backLabel ? (
          <Text style={[type.label14, styles.backLabel]} numberOfLines={1}>
            {backLabel}
          </Text>
        ) : null}

        <View style={styles.copy}>
          <Text style={[type.title26, styles.title]} numberOfLines={1}>
            {title}
          </Text>
          {subtitle ? (
            <Text style={[type.text12, styles.subtitle]} numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
        </View>

        {RightIcon ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={rightLabel ?? title}
            onPress={onRightPress}
            style={({ pressed }) => [styles.circle, pressed && styles.pressed]}>
            <RightIcon size={20} color={colors.white} strokeWidth={1.5} />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.inkDeep,
  },
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingTop: layout.headerPadTop,
    paddingBottom: layout.headerPadBottom,
    paddingHorizontal: layout.page,
    minHeight: layout.header,
  },
  copy: {
    flex: 1,
    gap: 4,
  },
  title: {
    color: colors.white,
  },
  subtitle: {
    color: colors.onDarkMuted,
  },
  backLabel: {
    color: colors.white,
  },
  circle: {
    width: layout.action,
    height: layout.action,
    borderRadius: layout.pillRadius,
    backgroundColor: colors.headerAction,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.72,
  },
});
