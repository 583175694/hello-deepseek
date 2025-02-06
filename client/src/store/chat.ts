import { create } from "zustand";
import { persist } from "zustand/middleware";
import { nanoid } from "nanoid";
import type { Chat, Message } from "@/types/chat";

interface ChatStore {
  chats: Chat[];
  currentChatId: string | null;
  createChat: () => void;
  selectChat: (id: string) => void;
  addMessage: (
    chatId: string,
    message: Omit<Message, "id" | "createdAt">
  ) => string;
  updateMessage: (
    chatId: string,
    messageId: string,
    message: Omit<Message, "id" | "createdAt">
  ) => void;
  deleteChat: (id: string) => void;
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set) => ({
      chats: [],
      currentChatId: null,

      createChat: () => {
        const newChat: Chat = {
          id: nanoid(),
          title: "新对话",
          messages: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        set((state) => ({
          chats: [newChat, ...state.chats],
          currentChatId: newChat.id,
        }));
      },

      selectChat: (id) => {
        set({ currentChatId: id });
      },

      addMessage: (chatId, message) => {
        const messageId = nanoid();

        set((state) => ({
          chats: state.chats.map((chat) => {
            if (chat.id === chatId) {
              return {
                ...chat,
                messages: [
                  ...chat.messages,
                  {
                    ...message,
                    id: messageId,
                    createdAt: new Date(),
                  },
                ],
                updatedAt: new Date(),
              };
            }
            return chat;
          }),
        }));

        return messageId;
      },

      updateMessage: (chatId, messageId, message) => {
        set((state) => ({
          chats: state.chats.map((chat) => {
            if (chat.id === chatId) {
              return {
                ...chat,
                messages: chat.messages.map((msg) => {
                  if (msg.id === messageId) {
                    return {
                      ...msg,
                      ...message,
                    };
                  }
                  return msg;
                }),
                updatedAt: new Date(),
              };
            }
            return chat;
          }),
        }));
      },

      deleteChat: (id) => {
        set((state) => ({
          chats: state.chats.filter((chat) => chat.id !== id),
          currentChatId:
            state.currentChatId === id ? null : state.currentChatId,
        }));
      },
    }),
    {
      name: "chat-storage",
    }
  )
);
