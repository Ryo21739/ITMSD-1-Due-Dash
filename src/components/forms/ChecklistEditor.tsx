import { CirclePlus, X } from 'lucide-react-native';
import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { colors } from '@/constants/colors';
import { fonts, type } from '@/constants/typography';
import { createId } from '@/lib/id';
import type { ChecklistDraft } from '@/components/forms/AssignmentFields';

type Props = {
  items: ChecklistDraft[];
  onChange: (items: ChecklistDraft[]) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  triggerLabel?: string | null;
};

export function ChecklistEditor({
  items,
  onChange,
  open,
  onOpenChange,
  triggerLabel = 'Add a checklist',
}: Props) {
  const addItem = () =>
    onChange([...items, { id: createId('step'), label: '', done: false }]);

  const update = (id: string, label: string) =>
    onChange(items.map((item) => (item.id === id ? { ...item, label } : item)));

  const remove = (id: string) => onChange(items.filter((item) => item.id !== id));

  if (!open) {
    if (!triggerLabel) return null;
    return (
      <Pressable
        accessibilityRole="button"
        onPress={() => {
          if (items.length === 0) addItem();
          onOpenChange(true);
        }}
        style={({ pressed }) => [styles.trigger, pressed && styles.pressed]}>
        <CirclePlus size={18} color={colors.primary} strokeWidth={1.5} />
        <Text style={[type.label12, styles.triggerLabel]}>{triggerLabel}</Text>
      </Pressable>
    );
  }

  return (
    <View style={styles.editor}>
      {items.length === 0 ? (
        <Text style={[type.copy12, styles.hint]}>No steps yet. Add your first one below.</Text>
      ) : null}

      {items.map((item, index) => (
        <View key={item.id} style={styles.row}>
          <TextInput
            value={item.label}
            onChangeText={(label) => update(item.id, label)}
            placeholder={`Step ${index + 1}`}
            placeholderTextColor={colors.muted}
            style={styles.input}
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Remove step ${index + 1}`}
            onPress={() => remove(item.id)}
            hitSlop={8}
            style={({ pressed }) => [styles.remove, pressed && styles.pressed]}>
            <X size={16} color={colors.muted} strokeWidth={1.5} />
          </Pressable>
        </View>
      ))}

      <View style={styles.actions}>
        <Pressable
          accessibilityRole="button"
          onPress={addItem}
          hitSlop={8}
          style={({ pressed }) => [styles.add, pressed && styles.pressed]}>
          <CirclePlus size={16} color={colors.primary} strokeWidth={1.5} />
          <Text style={[type.label12, styles.addLabel]}>Add step</Text>
        </Pressable>
        <Pressable onPress={() => onOpenChange(false)} hitSlop={8}>
          <Text style={[type.label12, styles.done]}>Done</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 2,
  },
  triggerLabel: {
    color: colors.primary,
  },
  editor: {
    gap: 8,
  },
  hint: {
    color: colors.muted,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  input: {
    flex: 1,
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    paddingHorizontal: 13,
    fontFamily: fonts.regular,
    fontSize: 13,
    lineHeight: 19,
    color: colors.ink,
    includeFontPadding: false,
  },
  remove: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 2,
  },
  add: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  addLabel: {
    color: colors.primary,
  },
  done: {
    color: colors.muted,
  },
  pressed: {
    opacity: 0.7,
  },
});
