interface Message {
  id: string;
  createdAt?: Date | undefined;
  content: string;
  experimental_attachments?:
    | {
        name?: string | undefined;
        contentType?: string | undefined;
        url: string;
      }[]
    | undefined;
  role: 'user' | 'assistant' | 'system' | 'data';
  annotations?: any[] | undefined;
  parts?: (
    | {
        type: 'text';
        text: string;
      }
    | {
        type: 'reasoning';
        reasoning: string;
        details: (
          | {
              type: 'text';
              text: string;
              signature?: string | undefined;
            }
          | {
              type: 'redacted';
              data: string;
            }
        )[];
      }
    | {
        type: 'tool-invocation';
        toolInvocation:
          | ({
              state: 'partial-call';
              step?: number | undefined;
            } & {
              toolCallId: string;
              toolName: string;
              args: any;
            })
          | ({
              state: 'call';
              step?: number | undefined;
            } & {
              toolCallId: string;
              toolName: string;
              args: any;
            })
          | ({
              state: 'result';
              step?: number | undefined;
            } & {
              toolCallId: string;
              toolName: string;
              args: any;
              result: any;
            });
      }
    | {
        type: 'source';
        source: {
          sourceType: 'url';
          id: string;
          url: string;
          title?: string | undefined;
        };
      }
    | {
        type: 'file';
        mimeType: string;
        data: string;
      }
    | {
        type: 'step-start';
      }
  )[];
}
