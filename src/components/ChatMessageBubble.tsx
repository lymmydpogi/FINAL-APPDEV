import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { ChatMessage } from '../types/api';
import { theme } from '../theme/tokens';
import { formatChatTimestamp } from '../utils/format';

type Props = {
  item: ChatMessage;
};

export default function ChatMessageBubble({ item }: Props) {
  const isUser = item.senderType === 'user';

  return (
    <View style={[styles.row, isUser ? styles.rowUser : styles.rowAdmin]}>
      <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAdmin]}>
        <Text style={[styles.messageText, isUser ? styles.messageTextUser : styles.messageTextAdmin]}>
          {item.message}
        </Text>
      </View>
      <Text style={[styles.time, isUser ? styles.timeUser : styles.timeAdmin]}>
        {formatChatTimestamp(item.createdAt)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    width: '100%',
    marginBottom: theme.spacing.md,
  },
  rowUser: { alignItems: 'flex-end' },
  rowAdmin: { alignItems: 'flex-start' },
  bubble: {
    maxWidth: '82%',
    flexShrink: 1,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  bubbleUser: {
    backgroundColor: theme.colors.primary,
    borderBottomRightRadius: 4,
  },
  bubbleAdmin: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  messageTextUser: {
    color: theme.colors.textStrong,
    fontWeight: '500',
  },
  messageTextAdmin: {
    color: theme.colors.text,
  },
  time: {
    fontSize: 11,
    marginTop: 4,
    color: theme.colors.textMuted,
  },
  timeUser: { textAlign: 'right', paddingRight: 2 },
  timeAdmin: { textAlign: 'left', paddingLeft: 2 },
});
