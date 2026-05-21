import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  AppState,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import CampanaBackground from '../../components/CampanaBackground';
import ChatMessageBubble from '../../components/ChatMessageBubble';
import { CustomButton } from '../../components';
import {
  MAX_CHAT_MESSAGE_LENGTH,
  MSG_CHAT_EMPTY,
  MSG_CHAT_TOO_LONG,
} from '../../constants/messages';
import { useAuth } from '../../hooks/useAuth';
import { markAdminMessagesSeen } from '../../services/chatNotificationsStorage';
import { fetchMessages, MessageApiError, sendMessage } from '../../services/messagesApi';
import { useChatUnread } from '../../hooks/useChatUnread';
import { useNotificationUnread } from '../../hooks/useNotificationUnread';
import type { ChatMessage } from '../../types/api';
import type { RootStackParamList } from '../../types/navigation';
import { theme } from '../../theme/tokens';
import { ROUTES } from '../../utils';

type Nav = StackNavigationProp<RootStackParamList, typeof ROUTES.MESSAGES>;

const MessagesScreen = () => {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const { isAuthenticated } = useAuth();
  const { refresh: refreshChatBadge } = useChatUnread();
  const { refresh: refreshNotifBadge } = useNotificationUnread();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sendError, setSendError] = useState<string | null>(null);

  const listRef = useRef<FlatList<ChatMessage>>(null);

  const scrollToBottom = useCallback((animated = true) => {
    requestAnimationFrame(() => {
      listRef.current?.scrollToEnd({ animated });
    });
  }, []);

  const load = useCallback(async () => {
    if (!isAuthenticated) {
      setLoading(false);
      setMessages([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const list = await fetchMessages();
      setMessages(list);
      await markAdminMessagesSeen(list);
      refreshChatBadge();
      refreshNotifBadge();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Could not load messages');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, refreshChatBadge, refreshNotifBadge]);

  useFocusEffect(
    useCallback(() => {
      if (!isAuthenticated) {
        navigation.navigate(ROUTES.LOGIN);
        return;
      }
      load().then(() => scrollToBottom(false));
    }, [isAuthenticated, load, navigation, scrollToBottom]),
  );

  useEffect(() => {
    const sub = AppState.addEventListener('change', nextState => {
      if (nextState === 'active' && isAuthenticated) {
        load();
      }
    });
    return () => sub.remove();
  }, [isAuthenticated, load]);

  const onSend = async () => {
    if (sending) {
      return;
    }
    setSendError(null);
    const trimmed = draft.trim();
    if (!trimmed) {
      setSendError(MSG_CHAT_EMPTY);
      return;
    }
    if (trimmed.length > MAX_CHAT_MESSAGE_LENGTH) {
      setSendError(MSG_CHAT_TOO_LONG);
      return;
    }

    setSending(true);
    try {
      const created = await sendMessage(trimmed);
      setDraft('');
      setMessages(prev => [...prev, created]);
      scrollToBottom(true);
    } catch (e: unknown) {
      const msg =
        e instanceof MessageApiError
          ? e.message
          : e instanceof Error
            ? e.message
            : 'Failed to send message. Please try again.';
      setSendError(msg);
    } finally {
      setSending(false);
    }
  };

  const remaining = MAX_CHAT_MESSAGE_LENGTH - draft.length;
  const showCounter = draft.length > MAX_CHAT_MESSAGE_LENGTH * 0.8;

  if (!isAuthenticated) {
    return (
      <CampanaBackground>
        <View style={styles.centered}>
          <ActivityIndicator color={theme.colors.primary} />
        </View>
      </CampanaBackground>
    );
  }

  return (
    <CampanaBackground>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
      >
        {loading && messages.length === 0 ? (
          <View style={styles.centered}>
            <ActivityIndicator color={theme.colors.primary} size="large" />
          </View>
        ) : (
          <FlatList
            ref={listRef}
            data={messages}
            keyExtractor={item => String(item.id)}
            style={styles.list}
            contentContainerStyle={[
              styles.listContent,
              messages.length === 0 && styles.listContentEmpty,
            ]}
            refreshControl={
              <RefreshControl refreshing={loading} onRefresh={load} tintColor={theme.colors.primary} />
            }
            onContentSizeChange={() => scrollToBottom(false)}
            ListHeaderComponent={
              error ? (
                <Text style={styles.loadError}>{error}</Text>
              ) : (
                <Text style={styles.hint}>Chat with the Campana Designs team</Text>
              )
            }
            ListEmptyComponent={
              !loading ? (
                <Text style={styles.empty}>No messages yet. Send a message to reach our team.</Text>
              ) : null
            }
            renderItem={({ item }) => (
              <View style={styles.messageItem}>
                <ChatMessageBubble item={item} />
              </View>
            )}
          />
        )}

        <View style={[styles.composer, { paddingBottom: Math.max(insets.bottom, theme.spacing.sm) }]}>
          {sendError ? <Text style={styles.sendError}>{sendError}</Text> : null}
          {showCounter ? (
            <Text
              style={[
                styles.counter,
                remaining < 0 && styles.counterOver,
              ]}
            >
              {remaining} characters left
            </Text>
          ) : null}
          <View style={styles.composerRow}>
            <TextInput
              style={styles.input}
              value={draft}
              onChangeText={setDraft}
              placeholder="Type a message…"
              placeholderTextColor={theme.colors.textSubtle}
              multiline
              maxLength={MAX_CHAT_MESSAGE_LENGTH + 200}
              editable={!sending}
              textAlignVertical="top"
            />
            <CustomButton
              title="Send"
              onPress={onSend}
              loading={sending}
              disabled={sending || !draft.trim()}
              style={styles.sendBtn}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </CampanaBackground>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  list: { flex: 1 },
  messageItem: { width: '100%' },
  listContent: {
    paddingHorizontal: theme.spacing.screenPadding,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.md,
    flexGrow: 1,
  },
  listContentEmpty: { justifyContent: 'center' },
  hint: {
    ...theme.typography.caption,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  empty: {
    ...theme.typography.bodyMuted,
    textAlign: 'center',
    lineHeight: 22,
    paddingVertical: theme.spacing.xxl,
  },
  loadError: {
    color: theme.colors.error,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
    fontSize: 14,
  },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  composer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.colors.surfaceBorder,
    backgroundColor: theme.colors.backgroundElevated,
    paddingHorizontal: theme.spacing.screenPadding,
    paddingTop: theme.spacing.sm,
  },
  composerRow: { flexDirection: 'row', alignItems: 'flex-end', gap: theme.spacing.sm },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    backgroundColor: theme.colors.backgroundInput,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
    borderRadius: theme.radius.sm,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    color: theme.colors.text,
    fontSize: 15,
  },
  sendBtn: { minWidth: 72, paddingHorizontal: theme.spacing.md },
  sendError: { color: theme.colors.error, fontSize: 13, marginBottom: theme.spacing.xs },
  counter: { ...theme.typography.caption, marginBottom: theme.spacing.xs, textAlign: 'right' },
  counterOver: { color: theme.colors.error },
});

export default MessagesScreen;
