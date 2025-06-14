export function cn(...inputs: Array<string | boolean | undefined | null>) {
  return inputs.filter(Boolean).join(' ');
}

export function tempChatTitle(firstMessage: string): string {
  const maxLength = 50;
  const truncatedMessage =
    firstMessage.length > maxLength
      ? firstMessage.slice(0, maxLength) + '...'
      : firstMessage;
  return truncatedMessage;
}
