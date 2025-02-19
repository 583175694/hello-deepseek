import { defineStore } from "pinia";
import { ref } from "vue";
import type { Message, Session } from "../types/chat";
import { chatApi } from "@/api/chat";

export const useChatStore = defineStore("chat", () => {
  const currentSession = ref<Session | null>(null);
  const sessions = ref<Session[]>([]);
  const messages = ref<Message[]>([]);
  const loading = ref(false);
  const sendingMessage = ref(false);
  const error = ref<string | null>(null);
  const streamingMessage = ref<Message | null>(null);

  async function setCurrentSession(session: Session | null) {
    currentSession.value = session;
    if (session) {
      try {
        loading.value = true;
        const { messages: sessionMessages } = await chatApi.getMessages(
          session.sessionId
        );
        messages.value = sessionMessages;
      } catch (err) {
        error.value = err instanceof Error ? err.message : "加载消息失败";
      } finally {
        loading.value = false;
      }
    } else {
      messages.value = [];
    }
  }

  function setSessions(newSessions: Session[]) {
    sessions.value = newSessions;
  }

  function setMessages(newMessages: Message[]) {
    messages.value = newMessages;
  }

  function addMessage(message: Message) {
    // 如果是流式消息的最终版本，替换流式消息
    if (streamingMessage.value && message.id === streamingMessage.value.id) {
      const index = messages.value.findIndex((m) => m.id === message.id);
      if (index !== -1) {
        messages.value[index] = message;
      } else {
        messages.value.push(message);
      }
      streamingMessage.value = null;
    } else {
      // 检查消息是否已存在
      const existingIndex = messages.value.findIndex(
        (m) => m.id === message.id
      );
      if (existingIndex === -1) {
        messages.value.push(message);
      }
    }
  }

  function updateStreamingMessage(message: Message) {
    if (!streamingMessage.value) {
      streamingMessage.value = message;
      messages.value.push({ ...message });
    } else {
      const index = messages.value.findIndex(
        (m) => m.id === streamingMessage.value?.id
      );
      if (index !== -1) {
        // 使用 Vue 的响应式更新方式
        messages.value[index] = { ...message };
      }
      streamingMessage.value = { ...message };
    }
  }

  function setLoading(isLoading: boolean) {
    loading.value = isLoading;
  }

  function setSendingMessage(isSending: boolean) {
    sendingMessage.value = isSending;
  }

  function setError(errorMessage: string | null) {
    error.value = errorMessage;
  }

  function clearMessages() {
    messages.value = [];
    streamingMessage.value = null;
  }

  function clearError() {
    error.value = null;
  }

  return {
    currentSession,
    sessions,
    messages,
    loading,
    sendingMessage,
    error,
    streamingMessage,
    setCurrentSession,
    setSessions,
    setMessages,
    addMessage,
    updateStreamingMessage,
    setLoading,
    setSendingMessage,
    setError,
    clearMessages,
    clearError,
  };
});
