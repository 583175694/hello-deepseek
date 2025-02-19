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

  async function loadSessions() {
    try {
      loading.value = true;
      error.value = null;
      const { sessions: sessionList } = await chatApi.getSessions();
      sessions.value = sessionList;
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Failed to load sessions";
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function createSession(roleName?: string, systemPrompt?: string) {
    try {
      loading.value = true;
      error.value = null;
      const session = await chatApi.createSession(roleName, systemPrompt);
      sessions.value = [...sessions.value, session];
      return session;
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Failed to create session";
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function deleteSession(sessionId: string) {
    try {
      loading.value = true;
      error.value = null;
      await chatApi.deleteSession(sessionId);
      sessions.value = sessions.value.filter((s) => s.sessionId !== sessionId);
      if (currentSession.value?.sessionId === sessionId) {
        currentSession.value = null;
        messages.value = [];
      }
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Failed to delete session";
      throw err;
    } finally {
      loading.value = false;
    }
  }

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
        error.value =
          err instanceof Error ? err.message : "Failed to load messages";
        throw err;
      } finally {
        loading.value = false;
      }
    } else {
      messages.value = [];
    }
  }

  function setMessages(newMessages: Message[]) {
    messages.value = newMessages;
  }

  function addMessage(message: Message) {
    if (streamingMessage.value && message.id === streamingMessage.value.id) {
      const index = messages.value.findIndex((m) => m.id === message.id);
      if (index !== -1) {
        messages.value[index] = message;
      } else {
        messages.value.push(message);
      }
      streamingMessage.value = null;
    } else {
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
        messages.value[index] = { ...message };
      }
      streamingMessage.value = { ...message };
    }
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
    // State
    currentSession,
    sessions,
    messages,
    loading,
    sendingMessage,
    error,
    streamingMessage,

    // Actions
    loadSessions,
    createSession,
    deleteSession,
    setCurrentSession,
    setMessages,
    addMessage,
    updateStreamingMessage,
    setSendingMessage,
    setError,
    clearMessages,
    clearError,
  };
});
