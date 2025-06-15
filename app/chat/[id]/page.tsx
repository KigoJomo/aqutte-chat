'use client';

import { Id } from '@/convex/_generated/dataModel';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Messages from '../components/Messages';
import ChatInput from '../components/ChatInput';
import { useChatIntergration } from '@/lib/hooks/use-chat-integration';
import { Loader2 } from 'lucide-react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useEffect } from 'react';

export default function ChatPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter()
  const chatId = params.id as Id<'chats'>;
  const intialMessage = searchParams.get('initialMessage') || undefined;

  const chatExists = useQuery(api.chat.getChatById, { chatId })

  const { messages, input, handleInputChange, handleSubmit } =
    useChatIntergration(chatId, intialMessage);
  
  useEffect(() => {
    if (chatExists === null) {
      router.replace('/')
    }
  }, [chatExists, router])

  return !messages ? (
    <div className="w-full flex items-center justify-center gap-4 p-4">
      <span className="text-sm text-foreground-light/70">Loading chat</span>

      <Loader2 size={12} className="stroke-foreground-light/50 animate-spin" />
    </div>
  ) : (
    <>
      <Messages messages={messages} />

      <ChatInput
        input={input}
        onChange={handleInputChange}
        handleSubmit={handleSubmit}
      />
    </>
  );
}
