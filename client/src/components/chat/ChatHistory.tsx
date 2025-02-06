"use client";

import { useChatStore } from "@/store/chat";
import { useAIChat } from "@/hooks/useAIChat";
import { ChatInput } from "./ChatInput";
import { ChatMessage } from "./ChatMessage";

export function ChatHistory() {
  const { chats, currentChatId } = useChatStore();
  const { isLoading, error, sendStreamMessage } = useAIChat();
  const currentChat = chats.find((chat) => chat.id === currentChatId);

  if (!currentChat) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        选择或创建一个对话开始聊天
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto p-4">
        <div className="space-y-6 max-w-2xl mx-auto">
          {isLoading && (
            <div className="text-sm text-muted-foreground">AI 正在思考...</div>
          )}
          {currentChat.messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {error && <div className="text-sm text-destructive">{error}</div>}
        </div>
      </div>

      <div className="border-t border-border p-4">
        <div className="max-w-2xl mx-auto">
          <ChatInput
            onSend={(content) => {
              sendStreamMessage(currentChat.id, content, currentChat.messages);
            }}
            disabled={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
