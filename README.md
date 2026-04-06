# Cloudflare AI UI App

This project uses a **bundled React workflow** with Vite and runs on **Cloudflare Workers** with **Cloudflare Workers AI**.

## What It Includes

- Bundled React chat UI (`src/client`) built to `dist`
- Worker backend with an `/api/chat` route
- Workers AI model call via `env.AI.run(...)`
- Static asset hosting via Wrangler assets binding

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

`npm run dev` builds the React app and starts Wrangler.

Then open the local URL shown by Wrangler (usually `http://127.0.0.1:8787`).

## Split Dev (Two Terminals)

Use this mode to keep frontend rebuild and Worker runtime as separate processes.

1. Prepare the initial `dist` output once:

```bash
npm run dev:split
```

2. Terminal 1: watch frontend bundle updates:

```bash
npm run dev:client:watch
```

3. Terminal 2: run Worker dev server:

```bash
npm run dev:worker
```

In this setup, Vite continuously rebuilds to `dist` while Wrangler serves the Worker and static assets.

## Split Dev (Single Command)

You can also run both processes from one terminal via a process manager:

```bash
npm run dev:all
```

This command:

- Builds once to prepare `dist`
- Starts Vite build watch (`dev:client:watch`)
- Starts Wrangler dev server (`dev:worker`)

## Build Frontend Only

```bash
npm run build
```

This writes optimized frontend assets to `dist`.

## Deploy

```bash
npm run deploy
```

## Notes

- AI binding is configured in `wrangler.toml`:

```toml
[ai]
binding = "AI"
```

- Assets binding is configured in `wrangler.toml`:

```toml
[assets]
directory = "./dist"
binding = "ASSETS"
run_worker_first = ["/api/*"]
```

- The default model is set in `src/worker.js`:

```js
const MODEL = "@cf/meta/llama-3.1-8b-instruct";
```

- The Worker serves:
  - `POST /api/chat` for AI responses
  - All other paths from built static assets in `dist`

You can replace it with another Workers AI model if needed.
