'use client';

import { useDeviceType } from '@/hooks/useDeviceType';
import Button from '@/lib/components/ui/Button';
import Input from '@/lib/components/ui/Input';
import MarkdownRenderer from '@/lib/components/ui/MarkdownRenderer';
import { cn } from '@/lib/utils/utils';
import { useChat } from '@ai-sdk/react';
import { ArrowUp } from 'lucide-react';
import {
  useRef,
  useEffect,
  useCallback,
  ChangeEvent,
  KeyboardEvent,
} from 'react';

export default function Home() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const deviceType = useDeviceType();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const updateHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 192)}px`;
  }, []);

  const handleInput = (
    event: ChangeEvent<HTMLTextAreaElement> | ChangeEvent<HTMLInputElement>
  ) => {
    updateHeight();
    handleInputChange(event);
  };

  const handleKeyDown = (
    e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      if (deviceType === 'desktop' || e.ctrlKey || e.metaKey) {
        e.preventDefault();
        handleSubmit();
      }
    }
  };

  useEffect(() => updateHeight(), [input, updateHeight]);

  useEffect(() => {
    if (!messagesEndRef.current) return;

    let userHasScrolled = false;

    const scrollToBottom = () => {
      if (!userHasScrolled && messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    };

    const handleScroll = () => {
      userHasScrolled = true;
      // Reset after a delay so auto-scroll can resume
      setTimeout(() => {
        userHasScrolled = false;
      }, 1000);
    };

    // Scroll to bottom when messages change
    scrollToBottom();

    // Listen for scroll on the correct container
    const scrollContainer = document.querySelector('section');
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll, {
        passive: true,
      });
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', handleScroll);
      }
    };
  }, [messages]);

  return (
    <>
      <section className="min-h-screen overflow-y-auto hide-scrollbar flex flex-col items-center !pb-0 relative">
        {/* Messages display */}
        <div
          className={`w-full max-w-3xl flex flex-col gap-4 ${
            messages.length > 0 ? 'pb-24 pt-12' : 'flex-1 justify-center'
          }`}>
          {messages.length === 0 ? (
            <div className="w-full flex flex-col items-center">
              <h3 className="text-center text-xl font-semibold text-foreground-light">
                I&apos;m ready to help!
              </h3>
              <p className="text-center text-sm text-foreground-light/70 mt-2">
                Ask me anything to get started.
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}>
                {message.parts.map((part, i) => {
                  switch (part.type) {
                    case 'text':
                      return (
                        <div
                          key={`${message.id}-${i}`}
                          className={`${
                            message.role === 'user'
                              ? 'p-3 bg-background-light ml-auto max-w-[75%]'
                              : 'w-full'
                          } rounded-2xl break-words`}>
                          <MarkdownRenderer markDowncontent={part.text} />
                        </div>
                      );
                    case 'reasoning':
                      return (
                        <div
                          key={`${message.id}-${i}`}
                          className="w-full mt-2 p-3 bg-accent/10 border border-accent/30 rounded-lg text-xs text-foreground-light/80 shadow-inner">
                          <span className="font-medium text-accent">
                            Reasoning:
                          </span>{' '}
                          {part.reasoning}
                        </div>
                      );
                    default:
                      return null;
                  }
                })}
              </div>
            ))
          )}
          <div ref={messagesEndRef} /> {/* Scroll target */}
        </div>

        {/* Input form */}
        <form
          onSubmit={handleSubmit}
          className={cn(
            'w-full max-w-3xl mx-auto shrink-0 sticky bottom-0 mt-auto',
            'flex flex-col gap-3 bg-background/10 backdrop-blur-2xl p-4 pt-3 rounded-t-3xl',
            'border-t-4 border-l-4 border-r-4 border-foreground-light/20',
            'focus-within:border-foreground-light/40 transition-all duration-300'
          )}>
          <Input
            name="input"
            value={input}
            type="textarea"
            ref={textareaRef}
            onKeyDown={handleKeyDown}
            onChange={handleInput}
            placeholder="Ask anything..."
            className={cn(
              'w-full bg-transparent border-none focus:ring-0 !rounded-none'
            )}
            rows={1}
            inputClassName={cn(
              '!p-2 !border-0 !rounded-none text-base',
              'resize-none overflow-y-auto custom-scrollbar'
            )}
            aria-label="Chat input"
          />
          <div className="w-full flex items-center justify-between mt-1">
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
      </section>
    </>
  );
}
