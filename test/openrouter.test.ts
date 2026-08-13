import assert from "node:assert/strict";
import test from "node:test";

import {
  OPENROUTER_MODEL,
  createOpenRouterClient,
  parseOpenRouterSseEvent,
} from "../src/server/openrouter.ts";

test("parses OpenRouter SSE content and completion markers", () => {
  assert.deepEqual(
    parseOpenRouterSseEvent('data: {"choices":[{"delta":{"content":"hello"}}]}'),
    { done: false, text: "hello" },
  );
  assert.deepEqual(parseOpenRouterSseEvent("data: [DONE]"), { done: true, text: "" });
  assert.deepEqual(parseOpenRouterSseEvent("event: keep-alive"), { done: false, text: "" });
});

test("uses the Ling model and OpenRouter authorization headers", async () => {
  const originalFetch = globalThis.fetch;
  let request: Request | undefined;

  globalThis.fetch = async (input, init) => {
    request = new Request(input, init);
    return new Response(JSON.stringify({ choices: [{ message: { content: "hello" } }] }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  };

  try {
    const client = createOpenRouterClient("test-key");
    const response = await client.generateText({
      messages: [{ role: "user", content: "hi" }],
    });

    assert.equal(response, "hello");
    assert.equal(request?.url, "https://openrouter.ai/api/v1/chat/completions");
    assert.equal(request?.headers.get("Authorization"), "Bearer test-key");
    assert.equal(request?.headers.get("Content-Type"), "application/json");

    const body = await request!.json() as { model: string; stream?: boolean };
    assert.equal(body.model, OPENROUTER_MODEL);
    assert.equal(body.stream, undefined);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("requests a streaming completion when asked", async () => {
  const originalFetch = globalThis.fetch;
  let request: Request | undefined;

  globalThis.fetch = async (input, init) => {
    request = new Request(input, init);
    return new Response("data: [DONE]\n\n", { status: 200 });
  };

  try {
    const client = createOpenRouterClient("test-key");
    const response = await client.generateTextStream({
      messages: [{ role: "user", content: "hi" }],
    });

    assert.equal(response.status, 200);
    const body = await request!.json() as { model: string; stream?: boolean };
    assert.equal(body.model, OPENROUTER_MODEL);
    assert.equal(body.stream, true);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
