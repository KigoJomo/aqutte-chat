'use client';

import { Id } from '@/convex/_generated/dataModel';
import {
  Edit3,
  Loader2,
  MessageSquare,
  MoreHorizontal,
  Trash2,
} from 'lucide-react';
import { useState, KeyboardEvent, useEffect } from 'react';
import Input from '../ui/Input';
import { cn } from '@/lib/utils/utils';
import Button from '../ui/Button';
import { useChatStore } from '@/lib/store/chat-store';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useRouter } from 'next/navigation';

interface ChatItemProps {
  chat: {
    _id: Id<'chats'>;
    title: string;
    updatedAt: string;
  };
  isActive: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onRename: (newTitle: string) => void;
}

function ChatItem({
  chat,
  isActive,
  onSelect,
  onDelete,
  onRename,
}: ChatItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(chat.title);
  const [showMenu, setShowMenu] = useState(false);

  const handleRename = () => {
    if (editTitle.trim() && editTitle !== chat.title) {
      onRename(editTitle.trim());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (
    e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (e.key === 'Enter') {
      handleRename();
    } else if (e.key === 'Escape') {
      setEditTitle(chat.title);
      setIsEditing(false);
    }
  };

  return (
    <li
      className={cn(
        'group relative w-full pl-3 pr-2 py-1 rounded-full cursor-pointer, transition-all duration-200',
        "flex items-center gap-2",
        'hover:bg-accent/20',
        isActive && 'bg-accent/50'
      )}
      onClick={!isEditing ? onSelect : undefined}>
      <MessageSquare
        size={12}
        className="shrink-0 stroke-foreground-light/70"
      />

      {isEditing ? (
        <Input
          type="text"
          name="chat-title"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          onBlur={handleRename}
          onKeyDown={handleKeyDown}
          className="flex-1 *:!text-sm"
          autoFocus
        />
      ) : (
        <span className="text-xs truncate cursor-pointer">{chat.title}</span>
      )}

      <div className="relative ml-auto">
        <Button
          variant="seamless"
          className={cn(
            'opacity-0 group-hover:opacity-100 transition-all duration-200',
            showMenu && 'opacity-100'
          )}
          onClick={(e) => {
            e.stopPropagation();
            setShowMenu(!showMenu);
          }}>
          <MoreHorizontal size={14} />
        </Button>

        {showMenu && (
          <div className="absolute right-0 top-full mt-1 bg-background-dark border border-accent rounded-md shadow-lg z-10 min-w-32">
            <Button
              variant="seamless"
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
                setShowMenu(false);
              }}>
              <Edit3 size={12} />
              <span>Rename</span>
            </Button>

            <Button
              variant="seamless"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
                setShowMenu(false);
              }}>
              <Trash2 size={12} />
              <span>Delete</span>
            </Button>
          </div>
        )}
      </div>
    </li>
  );
}

export default function ChatList() {
  const router = useRouter();
  const {
    currentChatId,
    setCurrentChatId,
    chats,
    setChats,
    removeChat,
    updateChatTitle,
  } = useChatStore();

  const userChats = useQuery(api.chat.getUserChats);
  const deleteChat = useMutation(api.chat.deleteChat);
  const updateTitle = useMutation(api.chat.updateChatTitle);

  useEffect(() => {
    if (userChats) {
      setChats(userChats);
    }
  }, [userChats, setChats]);

  const handleChatSelect = (chatId: string) => {
    setCurrentChatId(chatId);
    // TODO: handle CTRL + click, probably where this function is called
    router.push(`/chat/${chatId}`);
  };

  const handleChatDelete = async (chatId: string) => {
    try {
      await deleteChat({ chatId: chatId as Id<'chats'> });
      removeChat(chatId);
    } catch (error) {
      console.error('Failed to delete chat: ', error);
    }
  };

  const handleChatRename = async (chatId: string, newTitle: string) => {
    try {
      await updateTitle({ chatId: chatId as Id<'chats'>, title: newTitle });
      updateChatTitle(chatId, newTitle);
    } catch (error) {
      console.error('Failed to rename chat: ', error);
    }
  };

  if (!userChats) {
    return (
      <div className="w-full flex items-center justify-center gap-4 p-4">
        <span className="text-sm text-foreground-light/70">Loading chats</span>
        <Loader2
          size={12}
          className="stroke-foreground-light/50 animate-spin"
        />
      </div>
    );
  }

  if (chats.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-4 text-center">
        <MessageSquare size={24} className="text-foreground-light/50 mb-2" />
        <span className="text-sm text-foreground-light/70">No chats yet</span>
        <span className="text-xs text-foreground-light/50">
          Start a new conversation
        </span>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-1">
      {chats.map((chat) => (
        <ChatItem
          key={chat._id}
          chat={chat}
          isActive={currentChatId === chat._id}
          onSelect={() => handleChatSelect(chat._id)}
          onDelete={() => handleChatDelete(chat._id)}
          onRename={(newTtitle) => handleChatRename(chat._id, newTtitle)}
        />
      ))}
    </div>
  );
}
