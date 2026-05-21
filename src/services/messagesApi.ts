import {
  MAX_CHAT_MESSAGE_LENGTH,
  MSG_CHAT_EMPTY,
  MSG_CHAT_SEND_FAILED,
  MSG_CHAT_TOO_LONG,
} from '../constants/messages';
import type { ChatMessage } from '../types/api';
import { parseEnvelope, throwIfApiError } from '../utils/apiEnvelope';
import apiClient from './apiClient';
import { API_ROUTES } from './apiRoutes';
import { MessageApiError, parseMessageApiError } from './messageApiError';

export { MessageApiError } from './messageApiError';

function mapMessage(raw: ChatMessage): ChatMessage {
  return {
    id: Number(raw.id),
    senderType: raw.senderType === 'admin' ? 'admin' : 'user',
    message: raw.message ?? '',
    isRead: Boolean(raw.isRead),
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt ?? null,
  };
}

export async function fetchMessages(): Promise<ChatMessage[]> {
  try {
    const response = await apiClient.get(API_ROUTES.messages);
    const data = throwIfApiError<{ messages: ChatMessage[] }>(response.data);
    return (data.messages ?? []).map(mapMessage);
  } catch (error) {
    throw parseMessageApiError(error, 'Could not load messages');
  }
}

export async function sendMessage(text: string): Promise<ChatMessage> {
  const trimmed = text.trim();
  if (!trimmed) {
    throw new MessageApiError(MSG_CHAT_EMPTY);
  }
  if (trimmed.length > MAX_CHAT_MESSAGE_LENGTH) {
    throw new MessageApiError(MSG_CHAT_TOO_LONG);
  }

  try {
    const response = await apiClient.post(API_ROUTES.messages, { message: trimmed });
    const envelope = parseEnvelope<{ message: ChatMessage }>(response.data);
    if (!envelope.success) {
      throw parseMessageApiError({ response: { data: response.data, status: response.status } });
    }
    if (!envelope.data?.message) {
      throw new MessageApiError(MSG_CHAT_SEND_FAILED);
    }
    return mapMessage(envelope.data.message);
  } catch (error) {
    if (error instanceof MessageApiError) {
      throw error;
    }
    throw parseMessageApiError(error, MSG_CHAT_SEND_FAILED);
  }
}
