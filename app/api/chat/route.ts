import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { NextRequest } from 'next/server';

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  const { messages } = await req.json();
  console.log(messages)

  const result = streamText({
    model: google('gemini-2.0-flash'),
    messages,
  });

  return result.toDataStreamResponse();
}
