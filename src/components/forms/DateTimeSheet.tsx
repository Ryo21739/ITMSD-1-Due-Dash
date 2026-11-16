import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { Modal, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/common/PrimaryButton';
import { colors } from '@/constants/colors';
import { type } from '@/constants/typography';

type Props = {
  visible: boolean;
  mode: 'date' | 'time' | 'datetime';
  value: Date;
  title: string;
  onChange: (date: Date) => void;
  onClose: () => void;
};

/**
 * Native picker wrapper. iOS gets a spinner sheet with a Done button;
 * Android uses the platform dialog. The sheet body mounts only while visible,
 * so its draft value always starts from the current field value.
 */
export function DateTimeSheet(props: Props) {
  if (!props.visible) return null;
  return <PickerSheet {...props} />;
}

function PickerSheet({ mode, value, title, onChange, onClose }: Props) {
  const insets = useSafeAreaInsets();
  const [draft, setDraft] = useState(value);

  if (Platform.OS === 'android') {
    return (
      <DateTimePicker
        value={value}
        mode={mode}
        display="default"
        onChange={(event, date) => {
          onClose();
          if (event.type !== 'dismissed' && date) onChange(date);
        }}
      />
    );
  }

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.root}>
        <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Close" />
        <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 24) }]}>
          <Text style={[type.section17, styles.title]}>{title}</Text>
          <DateTimePicker
            value={draft}
            mode={mode}
            display="spinner"
            themeVariant="light"
            onChange={(_, date) => {
              if (date) setDraft(date);
            }}
            style={styles.picker}
          />
          <PrimaryButton
            label="Done"
            onPress={() => {
              onChange(draft);
              onClose();
            }}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(38, 40, 39, 0.4)',
  },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 20,
    paddingHorizontal: 24,
  },
  title: {
    color: colors.ink,
    marginBottom: 4,
  },
  picker: {
    alignSelf: 'stretch',
  },
});
