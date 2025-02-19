import { defineStore } from "pinia";
import { ref } from "vue";
import type {
  Message,
  Session,
  FileInfo,
  SendMessageParams,
  ChatState,
} from "@/types/chat";
import { chatApi, fileApi } from "@/api/chat";

export const useChatStore = defineStore("chat", () => {
  const state = ref<ChatState>({
    loading: false,
    error: null,
    messages: [],
    currentSession: null,
    sessions: [],
    files: [],
  });

  // Actions
  const sendMessage = async (params: SendMessageParams) => {
    try {
      state.value.loading = true;
      state.value.error = null;
      const response = await chatApi.sendMessage(params);
      state.value.messages.push(response);
      return response;
    } catch (error) {
      state.value.error =
        error instanceof Error ? error.message : "Failed to send message";
      throw error;
    } finally {
      state.value.loading = false;
    }
  };

  const createSession = async (roleName?: string, systemPrompt?: string) => {
    try {
      state.value.loading = true;
      state.value.error = null;
      const session = await chatApi.createSession({ roleName, systemPrompt });
      state.value.sessions.push(session);
      state.value.currentSession = session;
      return session;
    } catch (error) {
      state.value.error =
        error instanceof Error ? error.message : "Failed to create session";
      throw error;
    } finally {
      state.value.loading = false;
    }
  };

  const deleteSession = async (sessionId: string) => {
    try {
      state.value.loading = true;
      state.value.error = null;
      await chatApi.deleteSession(sessionId);
      state.value.sessions = state.value.sessions.filter(
        (s) => s.sessionId !== sessionId
      );
      if (state.value.currentSession?.sessionId === sessionId) {
        state.value.currentSession = null;
      }
    } catch (error) {
      state.value.error =
        error instanceof Error ? error.message : "Failed to delete session";
      throw error;
    } finally {
      state.value.loading = false;
    }
  };

  const loadSessions = async () => {
    try {
      state.value.loading = true;
      state.value.error = null;
      const sessions = await chatApi.getSessions();
      state.value.sessions = sessions;
    } catch (error) {
      state.value.error =
        error instanceof Error ? error.message : "Failed to load sessions";
      throw error;
    } finally {
      state.value.loading = false;
    }
  };

  const loadSessionMessages = async (sessionId: string) => {
    try {
      state.value.loading = true;
      state.value.error = null;
      const messages = await chatApi.getSessionMessages(sessionId);
      state.value.messages = messages;
    } catch (error) {
      state.value.error =
        error instanceof Error ? error.message : "Failed to load messages";
      throw error;
    } finally {
      state.value.loading = false;
    }
  };

  const uploadFile = async (file: File) => {
    try {
      state.value.loading = true;
      state.value.error = null;
      const fileInfo = await fileApi.uploadFile(file);
      state.value.files.push(fileInfo);
      return fileInfo;
    } catch (error) {
      state.value.error =
        error instanceof Error ? error.message : "Failed to upload file";
      throw error;
    } finally {
      state.value.loading = false;
    }
  };

  const deleteFile = async (filename: string) => {
    try {
      state.value.loading = true;
      state.value.error = null;
      await fileApi.deleteFile(filename);
      state.value.files = state.value.files.filter((f) => f.name !== filename);
    } catch (error) {
      state.value.error =
        error instanceof Error ? error.message : "Failed to delete file";
      throw error;
    } finally {
      state.value.loading = false;
    }
  };

  const loadFiles = async () => {
    try {
      state.value.loading = true;
      state.value.error = null;
      const files = await fileApi.getFiles();
      state.value.files = files;
    } catch (error) {
      state.value.error =
        error instanceof Error ? error.message : "Failed to load files";
      throw error;
    } finally {
      state.value.loading = false;
    }
  };

  return {
    state,
    sendMessage,
    createSession,
    deleteSession,
    loadSessions,
    loadSessionMessages,
    uploadFile,
    deleteFile,
    loadFiles,
  };
});
