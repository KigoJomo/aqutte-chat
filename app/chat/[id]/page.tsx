'use client';

import { Id } from '@/convex/_generated/dataModel';
import { useParams, useSearchParams } from 'next/navigation';
import Messages from '../components/Messages';
import ChatInput from '../components/ChatInput';
import { useChatIntergration } from '@/lib/hooks/use-chat-integration';

export default function ChatPage() {
  const params = useParams();
  const searchParams = useSearchParams()
  const chatId = params.id as Id<'chats'>;
  const intialMessage = searchParams.get('initialMessage') || undefined

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit
  } = useChatIntergration(chatId, intialMessage)

  return !messages ? (
    <div className="flex-1 flex flex-col items-center justify-center gap-4">
      <h3>loading chat ...</h3>
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
