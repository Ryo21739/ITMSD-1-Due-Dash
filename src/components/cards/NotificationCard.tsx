import {
  Bell,
  CalendarClock,
  FilePenLine,
  type LucideIcon,
} from 'lucide-react-native';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { IconTile } from '@/components/common/IconTile';
import { colors } from '@/constants/colors';
import { layout } from '@/constants/layout';
import { type } from '@/constants/typography';
import type { AppNotification, NotificationKind } from '@/types/models';

const icons: Record<NotificationKind, LucideIcon> = {
  digest: CalendarClock,
  file: FilePenLine,
  bell: Bell,
  calendar: CalendarClock,
};

type Props = {
  notification: AppNotification;
  onPress?: () => void;
};

export function NotificationCard({ notification, onPress }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        notification.unread ? styles.unread : styles.read,
        pressed && styles.pressed,
      ]}>
      <IconTile icon={icons[notification.kind]} size={34} iconSize={18} />
      <View style={styles.content}>
        <View style={styles.heading}>
          <Text style={[type.task13, styles.title]} numberOfLines={1}>
            {notification.title}
          </Text>
          {notification.unread ? <View style={styles.dot} /> : null}
        </View>
        <Text style={[type.copy12, styles.body]}>{notification.body}</Text>
        <Text style={[type.micro10, styles.timestamp]}>{notification.timestamp}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    borderRadius: layout.cardRadius,
    backgroundColor: colors.white,
    borderWidth: 1,
  },
  unread: {
    borderColor: colors.borderUnread,
  },
  read: {
    borderColor: colors.border,
  },
  pressed: {
    opacity: 0.9,
  },
  content: {
    flex: 1,
    gap: 6,
  },
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  title: {
    flex: 1,
    color: colors.ink,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 100,
    backgroundColor: colors.primary,
  },
  body: {
    color: colors.muted,
  },
  timestamp: {
    color: colors.primaryDeep,
  },
});
