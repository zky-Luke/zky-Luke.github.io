# OpenRouter Ling 2.6 Flash Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Gemini backend integration with OpenRouter using `inclusionai/ling-2.6-flash` while preserving the existing frontend API contracts and chat SSE format.

**Architecture:** Add a small OpenRouter client module responsible for API URL, model, authentication headers, standard chat requests, and streaming requests. Keep Express routes in `server.ts` responsible for request validation and response formatting, and update `.env.example` to document `OPENROUTER_API_KEY`.

**Tech Stack:** TypeScript, Node `fetch`, Express, OpenRouter OpenAI-compatible Chat Completions API, `tsx --test`.

---

### Task 1: Add testable OpenRouter client behavior

**Files:**
- Create: `src/server/openrouter.ts`
- Create: `test/openrouter.test.ts`
- Modify: `package.json`

- [ ] **Step 1: Write the failing tests**

Add tests covering the default model, authorization/base URL headers, standard completion request shape, and streaming request shape. Mock `globalThis.fetch` only at the network boundary and assert the request sent to OpenRouter.

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test`

Expected: FAIL because `src/server/openrouter.ts` and its exported client functions do not exist yet.

- [ ] **Step 3: Implement the minimal OpenRouter client**

Export `OPENROUTER_MODEL`, `createOpenRouterClient(apiKey)`, `generateText(options)`, and `generateTextStream(options)`. Use `https://openrouter.ai/api/v1/chat/completions`, send `Authorization: Bearer <key>`, `Content-Type: application/json`, and `HTTP-Referer`/`X-Title` headers. Use `stream: true` only for streaming calls and expose the raw `Response` so the Express route can forward SSE data.

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test`

Expected: PASS with all OpenRouter client tests passing.

- [ ] **Step 5: Commit the isolated client change**

Run: `git add src/server/openrouter.ts test/openrouter.test.ts package.json && git commit -m "refactor: add OpenRouter client"`

### Task 2: Migrate Express routes and environment configuration

**Files:**
- Modify: `server.ts`
- Modify: `.env.example`

- [ ] **Step 1: Update the API key and model configuration**

Replace the Gemini import/client with the OpenRouter client and read `process.env.OPENROUTER_API_KEY`. Use `inclusionai/ling-2.6-flash` through the shared client constant so chat, research, and RAG generation use one model configuration.

- [ ] **Step 2: Preserve route contracts**

Keep `/api/chat`, `/api/research`, `/api/rag/search`, and `/api/mcp/simulate` unchanged from the frontend’s perspective. For `/api/chat`, parse OpenRouter’s streamed `data: {"choices":[{"delta":{"content":"..."}}]}` chunks and emit the existing `data: {"text":"..."}` events, ending with `data: [DONE]`.

- [ ] **Step 3: Update environment documentation**

Change `.env.example` to show `OPENROUTER_API_KEY` and the OpenRouter setup requirement. Do not expose or create a real key.

- [ ] **Step 4: Run static checks and build**

Run: `npm run lint`

Expected: TypeScript exits with code 0.

Run: `npm run build`

Expected: Vite and the bundled Express server complete successfully.

- [ ] **Step 5: Commit the migration**

Run: `git add server.ts .env.example && git commit -m "feat: switch AI backend to OpenRouter Ling"`

### Task 3: Verify route integration without requiring a live API key

**Files:**
- Modify: `test/openrouter.test.ts`

- [ ] **Step 1: Add response parsing coverage**

Test that OpenRouter stream chunks containing content become the frontend-compatible text events, that `[DONE]` is preserved, and that chunks without content are ignored.

- [ ] **Step 2: Run the complete verification suite**

Run: `npm test; npm run lint; npm run build`

Expected: every command exits with code 0 and no test failures.

- [ ] **Step 3: Inspect the final diff**

Run: `git diff --check; git status --short`

Expected: no whitespace errors; only the intended OpenRouter client, tests, server, environment example, plan, and package script changes are present.
