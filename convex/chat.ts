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
      parts: [{ type: 'text', text: args.content }],
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

export const getUserChats = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (identity === null) throw new Error('Not authenticated');

    const chats = await ctx.db
      .query('chats')
      .filter((q) => q.eq(q.field('userId'), identity.subject))
      .order('desc')
      .collect();

    return chats;
  },
});

export const deleteChat = mutation({
  args: {
    chatId: v.id('chats'),
  },
  handler: async (ctx, { chatId }) => {
    const identity = await ctx.auth.getUserIdentity();

    if (identity === null) throw new Error('Not authenticated');

    const chat = await ctx.db.get(chatId);

    if (!chat || chat.userId !== identity.subject) {
      throw new Error('Chat not found or unauthorized');
    }

    const messages = await ctx.db
      .query('messages')
      .withIndex('by_chatId', (q) => q.eq('chatId', chatId))
      .collect();

    for (const msg of messages) {
      await ctx.db.delete(msg._id);
    }

    await ctx.db.delete(chatId);
  },
});

export const updateChatTitle = mutation({
  args: {
    chatId: v.id('chats'),
    title: v.string(),
  },
  handler: async (ctx, { chatId, title }) => {
    const identity = await ctx.auth.getUserIdentity();

    if (identity === null) throw new Error('Not authenticated');

    const chat = await ctx.db.get(chatId);

    if (!chat || chat.userId !== identity.subject) {
      if(chat) console.log(`Chat userId: ${chat.userId},\nIdentity subject: ${identity.subject}`);
      throw new Error('Chat not found or unauthorized');
    }

    await ctx.db.patch(chatId, {
      title,
      updatedAt: new Date().toISOString(),
    });
  },
});

export const getChatById = query({
  args: {
    chatId: v.id('chats'),
  },
  handler: async (ctx, { chatId }) => {
    const identity = await ctx.auth.getUserIdentity();

    if (identity === null) throw new Error('Not authenticated');

    const chat = await ctx.db.get(chatId);

    if (!chat || chat.userId !== identity.subject) {
      return null;
    }

    return chat;
  },
});
