export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
} 

export interface Session {
  sessionId: string;
  createdAt: string;
  updatedAt: string;
  lastMessage: string;
  messageCount: number;
}
  
