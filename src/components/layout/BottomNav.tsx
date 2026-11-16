import { router } from 'expo-router';
import { BookOpen, CalendarDays, House, ListChecks, type LucideIcon } from 'lucide-react-native';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/constants/colors';
import { layout } from '@/constants/layout';
import { fonts, type } from '@/constants/typography';

export type NavKey = 'home' | 'calendar' | 'tasks' | 'courses';

type Destination = {
  key: NavKey;
  label: string;
  icon: LucideIcon;
  href: '/home' | '/calendar' | '/assignments' | '/courses';
};

const destinations: Destination[] = [
  { key: 'home', label: 'Home', icon: House, href: '/home' },
  { key: 'calendar', label: 'Calendar', icon: CalendarDays, href: '/calendar' },
  { key: 'tasks', label: 'Tasks', icon: ListChecks, href: '/assignments' },
  { key: 'courses', label: 'Courses', icon: BookOpen, href: '/courses' },
];

/** 84px bottom navigation bar. */
export function BottomNav({ active }: { active: NavKey }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      <View style={styles.row}>
        {destinations.map(({ key, label, icon: Icon, href }) => {
          const selected = key === active;
          return (
            <Pressable
              key={key}
              accessibilityRole="tab"
              accessibilityState={{ selected }}
              accessibilityLabel={label}
              onPress={() => router.navigate(href)}
              style={({ pressed }) => [styles.item, pressed && styles.pressed]}>
              <Icon
                size={21}
                color={selected ? colors.primary : colors.muted}
                strokeWidth={selected ? 2 : 1.5}
              />
              <Text
                style={[
                  type.micro10,
                  {
                    color: selected ? colors.primary : colors.muted,
                    fontFamily: selected ? fonts.bold : fonts.medium,
                  },
                ]}>
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: layout.navPadTop,
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    height: layout.navRow,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    gap: 5,
    paddingTop: 0,
  },
  pressed: {
    opacity: 0.6,
  },
});
