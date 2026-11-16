import { Alert, Platform } from 'react-native';

/**
 * Completing an assignment is easy to trigger by accident, so the checkbox
 * asks first. Reopening a finished assignment is always immediate.
 */
export function confirmFinished(title: string, onConfirm: () => void) {
  const message = `Mark “${title}” as finished? You can tap the check again to undo.`;

  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined' && window.confirm(message)) onConfirm();
    return;
  }

  Alert.alert('Is this finished?', message, [
    { text: 'Not yet', style: 'cancel' },
    { text: 'Yes, finished', onPress: onConfirm },
  ]);
}
