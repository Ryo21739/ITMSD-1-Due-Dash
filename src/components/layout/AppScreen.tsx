import type { LucideIcon } from 'lucide-react-native';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { BottomNav, type NavKey } from '@/components/layout/BottomNav';
import { DarkHeader } from '@/components/layout/DarkHeader';
import { colors } from '@/constants/colors';
import { layout } from '@/constants/layout';

type Props = {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  backStyle?: 'plain' | 'circle';
  backLabel?: string;
  rightIcon?: LucideIcon;
  onRightPress?: () => void;
  rightLabel?: string;
  /** Bottom navigation destination. Omit to hide the bar. */
  active?: NavKey;
  /** Content top padding measured from each Figma frame. */
  topPadding?: number;
  gap?: number;
  children: React.ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
  scroll?: boolean;
  bottomPadding?: number;
};

export function AppScreen({
  title,
  subtitle,
  onBack,
  backStyle,
  backLabel,
  rightIcon,
  onRightPress,
  rightLabel,
  active,
  topPadding = layout.page,
  gap = 16,
  children,
  contentStyle,
  scroll = true,
  bottomPadding = 24,
}: Props) {
  const content = (
    <View style={[styles.content, { paddingTop: topPadding, gap }, contentStyle]}>{children}</View>
  );

  return (
    <View style={styles.screen}>
      <DarkHeader
        title={title}
        subtitle={subtitle}
        onBack={onBack}
        backStyle={backStyle}
        backLabel={backLabel}
        rightIcon={rightIcon}
        onRightPress={onRightPress}
        rightLabel={rightLabel}
      />
      {scroll ? (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomPadding }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          {content}
        </ScrollView>
      ) : (
        content
      )}
      {active ? <BottomNav active={active} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    paddingHorizontal: layout.page,
  },
});
