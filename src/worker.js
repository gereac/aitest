const MODEL = "@cf/meta/llama-3.1-8b-instruct";

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=UTF-8",
      "cache-control": "no-store",
    },
  });
}

async function handleChatRoute(request, url, env) {
  if (url.pathname !== "/api/chat") {
    return null;
  }

  if (request.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "access-control-allow-origin": "*",
        "access-control-allow-methods": "POST,OPTIONS",
        "access-control-allow-headers": "content-type",
      },
    });
  }

  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }

  const message = (payload?.message || "").trim();
  if (!message) {
    return json({ error: "message is required" }, 400);
  }

  if (!env.AI || typeof env.AI.run !== "function") {
    return json(
      {
        error:
          'Workers AI binding is missing. Configure [ai] binding = "AI" in wrangler.toml.',
      },
      500,
    );
  }

  try {
    const result = await env.AI.run(MODEL, {
      messages: [
        {
          role: "system",
          content: "You are a concise and helpful assistant.",
        },
        {
          role: "user",
          content: message,
        },
      ],
      temperature: 0.7,
      max_tokens: 512,
    });

    const reply =
      result?.response ||
      result?.result?.response ||
      result?.output_text ||
      "The model returned an empty response.";

    return json({ reply, model: MODEL });
  } catch (error) {
    return json(
      {
        error: "Workers AI call failed",
        detail: error?.message || String(error),
      },
      500,
    );
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    const chatResponse = await handleChatRoute(request, url, env);
    if (chatResponse) {
      return chatResponse;
    }

    if (!env.ASSETS || typeof env.ASSETS.fetch !== "function") {
      return new Response("Static assets binding is missing", { status: 500 });
    }

    return env.ASSETS.fetch(request);
  },
};
