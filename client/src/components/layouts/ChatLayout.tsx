import { ChatList } from "@/components/chat/ChatList";
import { ChatHistory } from "@/components/chat/ChatHistory";

export function ChatLayout() {
  return (
    <div className="flex h-screen">
      <div className="w-64 border-r border-border bg-muted/10">
        <ChatList />
      </div>
      <div className="flex-1 flex justify-center">
        <div className="w-full max-w-4xl">
          <ChatHistory />
        </div>
      </div>
    </div>
  );
} 