import { Message } from 'ai';
import { create } from 'zustand';

interface ChatState {
  currentChatId: string | null;
  chatMessages: Record<string, Message[]>;

  setCurrentChatId: (chatId: string | null) => void;
  setChatMessages: (chatId: string, messages: Message[]) => void;
  addMessageToChat: (chatId: string, message: Message) => void;
  clearChat: (chatId: string) => void;

  getCurrentChatMessages: () => Message[];
}

export const useChatStore = create<ChatState>((set, get) => ({
  currentChatId: null,
  chatMessages: {},

  setCurrentChatId: (chatId) => set({ currentChatId: chatId }),

  setChatMessages: (chatId, messages) =>
    set((state) => ({
      chatMessages: {
        ...state.chatMessages,
        [chatId]: messages,
      },
    })),

  addMessageToChat: (chatId, message) =>
    set((state) => ({
      chatMessages: {
        ...state.chatMessages,
        [chatId]: [...(state.chatMessages[chatId] || []), message],
      },
    })),

  clearChat: (chatId) =>
    set((state) => ({
      chatMessages: {
        ...state.chatMessages,
        [chatId]: [],
      },
    })),

  getCurrentChatMessages: () => {
    const { currentChatId, chatMessages } = get();
    return currentChatId ? chatMessages[currentChatId] || [] : [];
  },
}));
