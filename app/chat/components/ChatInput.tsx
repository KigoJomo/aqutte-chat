'use client';

import { useDeviceType } from '@/lib/hooks/useDeviceType';
import Button from '@/lib/components/ui/Button';
import Input from '@/lib/components/ui/Input';
import { cn } from '@/lib/utils/utils';
import { ArrowUp } from 'lucide-react';
import {
  ChangeEvent,
  FormEvent,
  KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
} from 'react';

interface ChatInputProps {
  input: string;
  onChange: (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
  ) => void;
  handleSubmit: (e: FormEvent<Element>) => Promise<void>;
  autoFocus?: boolean
}

export default function ChatInput({
  input,
  onChange,
  handleSubmit,
  autoFocus = false
}: ChatInputProps) {
  /**
   * input behaviour logic
   */

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const deviceType = useDeviceType();

  const updateHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 192)}px`;
  }, []);

  const handleKeyDown = (
    e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      if (deviceType === 'desktop' || e.ctrlKey || e.metaKey) {
        e.preventDefault();
        handleSubmit(e);
      }
    }
  };

  useEffect(() => updateHeight(), [input, updateHeight]);

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        'w-full max-w-3xl mx-auto shrink-0 sticky bottom-0 mt-auto',
        'flex flex-col gap-2 bg-background/10 backdrop-blur-2xl px-4 py-2 rounded-t-3xl',
        'border-t-4 border-l-4 border-r-4 border-foreground-light/20',
        'focus-within:border-foreground-light/40 transition-all duration-300'
      )}>
      <Input
        name="input"
        value={input}
        type="textarea"
        ref={textareaRef}
        onKeyDown={handleKeyDown}
        onChange={onChange}
        placeholder="Ask anything..."
        className={cn(
          'w-full bg-transparent border-none focus:ring-0 !rounded-none'
        )}
        rows={1}
        inputClassName={cn(
          '!p-2 !border-0 !rounded-none text-base',
          'resize-none overflow-y-auto custom-scrollbar'
        )}
        autoFocus={autoFocus}
        aria-label="Chat input"
      />
      <div className="w-full flex items-center justify-between">
        <Button size="sm" variant="outline" className="text-xs">
          <span>Gemini 2.0 Flash</span>
        </Button>
        <Button
          type="submit"
          onClick={handleSubmit}
          className={cn(
            '!p-2 aspect-square !rounded-full shadow-md',
            'hover:shadow-lg transition-shadow'
          )}
          aria-label="Send message">
          <ArrowUp size={18} />
        </Button>
      </div>
    </form>
  );
}
