'use client';

import { cn, tempChatTitle } from '@/lib/utils/utils';
import ChatInput from './chat/components/ChatInput';
import { ChangeEvent, FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useChatStore } from '@/lib/store/chat-store';

export default function Home() {
  const [input, setInput] = useState('');
  const [isLoading, setIsloading] = useState(false);
  const router = useRouter();

  const createChat = useMutation(api.chat.createChat);
  const { setCurrentChatId, setChatMessages } = useChatStore();

  const onChange = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
  ) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!input.trim() || isLoading) return;

    setIsloading(true);

    try {
      const title = tempChatTitle(input);
      const chatId = await createChat({ title });

      setCurrentChatId(chatId);
      setChatMessages(chatId, []);

      router.push(
        `/chat/${chatId}?initialMessage=${encodeURIComponent(input)}`
      );
    } catch (error) {
      console.error('Error creating chat: ', error);
      alert('Failed to create chat. Pleas try again.');
    } finally {
      setIsloading(false);
    }
  };

  return (
    <>
      <div
        className={cn(
          'w-full max-w-3xl flex flex-col gap-8',
          'flex-1 justify-center'
        )}>
        <div className="w-full flex flex-col items-center">
          <h3 className="text-center text-xl font-semibold text-foreground-light">
            I&apos;m ready to help!
          </h3>
          <p className="text-center text-sm text-foreground-light/70 mt-2">
            Ask me anything to get started.
          </p>
        </div>
      </div>

      <ChatInput
        input={input}
        onChange={onChange}
        handleSubmit={handleSubmit}
      />
    </>
  );
}
