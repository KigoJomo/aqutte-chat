import { Id } from '@/convex/_generated/dataModel';
import { Message } from 'ai';
import { create } from 'zustand';

export interface Chat {
  _id: Id<'chats'>;
  userId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

interface ChatState {
  currentChatId: string | null;
  chatMessages: Record<string, Message[]>;
  chats: Chat[];

  setCurrentChatId: (chatId: string | null) => void;
  setChatMessages: (chatId: string, messages: Message[]) => void;
  addMessageToChat: (chatId: string, message: Message) => void;
  clearChat: (chatId: string) => void;

  setChats: (chats: Chat[]) => void;
  addChat: (chat: Chat) => void;
  removeChat: (chatId: string) => void;
  updateChatTitle: (chatId: string, title: string) => void;

  getCurrentChatMessages: () => Message[];
}

export const useChatStore = create<ChatState>((set, get) => ({
  currentChatId: null,
  chatMessages: {},
  chats: [],

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

  setChats: (chats) => set({ chats }),

  addChat: (chat) =>
    set((state) => ({
      chats: [chat, ...state.chats],
    })),

  removeChat: (chatId) =>
    set((state) => ({
      chats: state.chats.filter((chat) => chat._id !== chatId),
      chatMessages: Object.fromEntries(
        Object.entries(state.chatMessages).filter(([key]) => key !== chatId)
      ),
      currentChatId:
        state.currentChatId === chatId ? null : state.currentChatId,
    })),

  updateChatTitle: (chatId, title) =>
    set((state) => ({
      chats: state.chats.map((chat) =>
        chat._id === chatId ? { ...chat, title } : chat
      ),
    })),

  getCurrentChatMessages: () => {
    const { currentChatId, chatMessages } = get();
    return currentChatId ? chatMessages[currentChatId] || [] : [];
  },
}));
