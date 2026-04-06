# Cloudflare AI UI App

This project is a simple UI application that runs on **Cloudflare Workers** and uses **Cloudflare Workers AI**.

## What It Includes

- Chat-style web UI
- Worker backend with an `/api/chat` route
- Workers AI model call via `env.AI.run(...)`

## Prerequisites

- Node.js 18+
- A Cloudflare account with Workers AI enabled

## Setup

1. Install dependencies:

```bash
npm install
```

2. Authenticate Wrangler:

```bash
npx wrangler login
```

3. Run locally:

```bash
npm run dev
```

Then open the local URL shown by Wrangler (usually `http://127.0.0.1:8787`).

## Deploy

```bash
npm run deploy
```

## Notes

- AI binding is configured in `wrangler.toml` as:

```toml
[ai]
binding = "AI"
```

- The default model is set in `src/worker.js`:

```js
const MODEL = "@cf/meta/llama-3.1-8b-instruct";
```

You can replace it with another Workers AI model if needed.
