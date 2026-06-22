const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export interface GroqMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface GroqRequest {
  model: string;
  messages: GroqMessage[];
  temperature?: number;
  max_tokens?: number;
  response_format?: { type: 'json_object' };
}

export interface GroqResponse {
  choices: Array<{
    message: { content: string };
    finish_reason: string;
  }>;
  usage: { prompt_tokens: number; completion_tokens: number; total_tokens: number };
}

export async function callGroq(
  apiKey: string,
  request: GroqRequest,
  retries = 5
): Promise<string> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const res = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(request),
      });

      if (res.status === 429) {
        // Groq API may have strict RPM/TPM limits. Backoff exponentially starting at 3 seconds
        const backoffMs = Math.pow(2, attempt) * 3000;
        await sleep(backoffMs);
        continue;
      }

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error?.message || `Groq error ${res.status}`);
      }

      const data: GroqResponse = await res.json();
      return data.choices[0].message.content;
    } catch (err) {
      lastError = err as Error;
      if (attempt < retries - 1) await sleep(2000 * Math.pow(2, attempt));
    }
  }

  throw lastError ?? new Error('Groq call failed after retries');
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
