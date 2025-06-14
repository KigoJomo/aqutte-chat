// convex/chat.ts

import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

export const createChat = mutation({
  args: {
    title: v.string(),
  },
  handler: async (ctx, { title }) => {
    const identity = await ctx.auth.getUserIdentity();

    if (identity === null) throw new Error('Not authenticated');

    const chatId = await ctx.db.insert('chats', {
      userId: identity.subject,
      title,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return chatId;
  },
});

export const addMessage = mutation({
  args: {
    chatId: v.id('chats'),
    content: v.string(),
    role: v.union(
      v.literal('user'),
      v.literal('assistant'),
      v.literal('system')
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.chatId, {
      updatedAt: new Date().toISOString(),
    });

    return await ctx.db.insert('messages', {
      chatId: args.chatId,
      content: args.content,
      role: args.role,
      createdAt: new Date().toISOString(),
      parts: [{ type: 'text', text: args.content }]
    });
  },
});

export const getMessages = query({
  args: {
    chatId: v.id('chats'),
  },
  handler: async (ctx, { chatId }) => {
    return await ctx.db
      .query('messages')
      .withIndex('by_chatId', (q) => q.eq('chatId', chatId))
      .order('asc')
      .collect();
  },
});

// TODO: get user chats