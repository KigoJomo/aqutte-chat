'use client';

import { CopyButton } from '@/lib/components/ui/CodeCopyButton';
import MarkdownRenderer from '@/lib/components/ui/MarkdownRenderer';
import { cn } from '@/lib/utils/utils';
import { Message } from 'ai';

export default function Messages({ messages }: { messages: Message[] }) {
  return (
    <div
      className={`w-full max-w-3xl flex flex-col gap-8 ${
        messages.length > 0 ? 'pb-24 pt-12' : 'flex-1 justify-center'
      }`}>
      {messages.length > 0 &&
        messages.map((message) => (
          <div
            key={message.id}
            className={`flex flex-col gap-2 ${
              message.role === 'user' ? 'items-end' : 'items-start'
            }`}>
            {message.parts ? (
              message.parts.map((part, i) => {
                switch (part.type) {
                  case 'text':
                    return (
                      <div
                        key={`${message.id}-${i}`}
                        className={cn(
                          'w-full flex flex-col gap-2 group',
                          message.role === 'user' ? 'items-end' : 'items-start'
                        )}>
                        <div
                          className={`${
                            message.role === 'user'
                              ? 'p-3 bg-background-light ml-auto max-w-[75%]'
                              : 'w-full'
                          } rounded-2xl break-words`}>
                          <MarkdownRenderer markDowncontent={part.text} />
                        </div>

                        <div className="buttons flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                          <CopyButton textToCopy={part.text} />
                        </div>
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
              })
            ) : (
              <div
                className={cn(
                  'w-full flex flex-col gap-2 group',
                  message.role === 'user' ? 'items-end' : 'items-start'
                )}>
                <div
                  className={`${
                    message.role === 'user'
                      ? 'p-3 bg-background-light ml-auto max-w-[75%]'
                      : 'w-full'
                  } rounded-2xl break-words`}>
                  <MarkdownRenderer markDowncontent={message.content} />
                </div>

                <div className="buttons flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <CopyButton textToCopy={message.content} />
                </div>
              </div>
            )}
          </div>
        ))}
    </div>
  );
}
