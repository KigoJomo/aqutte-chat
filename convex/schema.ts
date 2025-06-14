// convex/schema.ts

import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  chats: defineTable({
    userId: v.string(),
    title: v.string(),
    createdAt: v.string(),
    updatedAt: v.string(),
  }),
  messages: defineTable({
    chatId: v.id('chats'),
    createdAt: v.any(),
    content: v.string(),
    experimental_attachments: v.optional(
      v.array(
        v.object({
          name: v.optional(v.string()),
          contentType: v.optional(v.string()),
          url: v.string(),
        })
      )
    ),
    role: v.union(
      v.literal('user'),
      v.literal('assistant'),
      v.literal('system')
    ),
    annotations: v.optional(v.array(v.any())),
    parts: v.optional(
      v.array(
        v.union(
          v.object({
            type: v.literal('text'),
            text: v.string(),
          }),
          v.object({
            type: v.literal('reasoning'),
            reasoning: v.string(),
            details: v.array(
              v.union(
                v.object({
                  type: v.literal('text'),
                  text: v.string(),
                  signature: v.optional(v.string()),
                }),
                v.object({
                  type: v.literal('redacted'),
                  data: v.string(),
                })
              )
            ),
          }),
          v.object({
            type: v.literal('tool-invocation'),
            toolInvocation: v.union(
              v.object({
                state: v.literal('partial-call'),
                step: v.optional(v.number()),
                toolCallId: v.string(),
                toolName: v.string(),
                args: v.any(),
              }),
              v.object({
                state: v.literal('call'),
                step: v.optional(v.number()),
                toolCallId: v.string(),
                toolName: v.string(),
                args: v.any(),
              }),
              v.object({
                state: v.literal('result'),
                step: v.optional(v.number()),
                toolCallId: v.string(),
                toolName: v.string(),
                args: v.any(),
                result: v.any(),
              })
            ),
          })
        )
      )
    )
  }).index('by_chatId', ['chatId']),
});
