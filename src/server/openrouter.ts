const DEFAULT_OPENROUTER_MODEL = "inclusionai/ling-2.6-flash";

export const getOpenRouterModel = (env: NodeJS.ProcessEnv = process.env) =>
  env.OPENROUTER_MODEL || DEFAULT_OPENROUTER_MODEL;

export const OPENROUTER_MODEL = getOpenRouterModel();
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

export type ChatMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

type CompletionOptions = {
  messages: ChatMessage[];
  systemInstruction?: string;
  temperature?: number;
};

export const parseOpenRouterSseEvent = (event: string) => {
  const line = event.split("\n").find((item) => item.startsWith("data: "));
  if (!line) return { done: false, text: "" };
  const payload = line.slice(6);
  if (payload === "[DONE]") return { done: true, text: "" };
  const chunk = JSON.parse(payload) as { choices?: Array<{ delta?: { content?: string } }> };
  return { done: false, text: chunk.choices?.[0]?.delta?.content || "" };
};

const buildMessages = ({ messages, systemInstruction }: CompletionOptions) => [
  ...(systemInstruction ? [{ role: "system" as const, content: systemInstruction }] : []),
  ...messages,
];

const createHeaders = (apiKey: string) => ({
  Authorization: `Bearer ${apiKey}`,
  "Content-Type": "application/json",
  "HTTP-Referer": "https://zky-luke.github.io",
  "X-Title": "AI Engineering Lab",
});

const checkResponse = async (response: Response) => {
  if (response.ok) return response;
  const details = await response.text();
  throw new Error(`OpenRouter request failed (${response.status}): ${details || response.statusText}`);
};

export const createOpenRouterClient = (apiKey: string) => ({
  async generateText(options: CompletionOptions) {
    const response = await checkResponse(await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: createHeaders(apiKey),
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages: buildMessages(options),
        temperature: options.temperature,
      }),
    }));
    const data = await response.json() as { choices?: Array<{ message?: { content?: string } }> };
    return data.choices?.[0]?.message?.content || "无响应";
  },

  async generateTextStream(options: CompletionOptions) {
    return checkResponse(await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: createHeaders(apiKey),
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages: buildMessages(options),
        temperature: options.temperature,
        stream: true,
      }),
    }));
  },
});
