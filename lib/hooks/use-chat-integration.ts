'use client';

import { Id } from '@/convex/_generated/dataModel';
import { useChatStore } from '../store/chat-store';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useChat } from '@ai-sdk/react';
import { FormEvent, useEffect, useRef } from 'react';

export function useChatIntergration(
  chatId: Id<'chats'>,
  initialMessage?: string
) {
  const {
    currentChatId,
    setCurrentChatId,
    setChatMessages,
    getCurrentChatMessages,
  } = useChatStore();

  const hasSubmittedInitial = useRef(false);

  const messages = useQuery(api.chat.getMessages, { chatId });
  const addMessage = useMutation(api.chat.addMessage);

  const storeMesages = getCurrentChatMessages();

  const chatHook = useChat({
    api: '/api/chat',
    initialMessages: storeMesages,
    onFinish: async (message) => {
      try {
        await addMessage({
          chatId,
          content: message.content,
          role: 'assistant',
        });
      } catch (error) {
        console.error('Error saving AI message: ', error);
      }
    },
  });

  useEffect(() => {
    if (chatId !== currentChatId) {
      setCurrentChatId(chatId);
    }
  }, [chatId, currentChatId, setCurrentChatId]);

  useEffect(() => {
    if (messages && messages.length > 0) {
      const aiMessages = messages.map((msg) => ({
        id: msg._id,
        role: msg.role,
        content: msg.content,
        createdAt: msg.createdAt,
      }));

      setChatMessages(chatId, aiMessages);
      chatHook.setMessages(aiMessages);
    }
  }, [messages, chatId, setChatMessages, chatHook.setMessages]);

  useEffect(() => {
    if (
      initialMessage &&
      !hasSubmittedInitial.current &&
      messages !== undefined &&
      messages.length === 0
    ) {
      hasSubmittedInitial.current = true;

      const submitInitialMessage = async () => {
        try {
          await addMessage({
            chatId,
            content: initialMessage,
            role: 'user',
          });

          await chatHook.append({
            role: 'user',
            content: initialMessage,
          });

          const url = new URL(window.location.href);
          url.searchParams.delete('initialMessage');
          window.history.replaceState({}, '', url.toString());
        } catch (error) {
          console.error('Error with initial message: ', error);
        }
      };

      submitInitialMessage();
    }
  }, [initialMessage, messages, chatId, addMessage, chatHook.append]);

  const handleSubmit = async (e: FormEvent<Element>) => {
    e.preventDefault();

    if (!chatHook.input.trim()) return;

    try {
      await addMessage({
        chatId,
        content: chatHook.input,
        role: 'user',
      });
    } catch (error) {
      console.error('Error saving user message: ', error);
    }

    chatHook.handleSubmit(e);
  };

  return {
    ...chatHook,
    handleSubmit,
    // isLoading: chatHook.status === '<something_here>' || !messages
    // ☝️ figure this out later ...
  };
}
