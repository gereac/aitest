export const APP_HTML = String.raw`<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Cloudflare AI UI</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=Fraunces:opsz,wght@9..144,600&display=swap');

    :root {
      --bg-1: #f8f7f3;
      --bg-2: #e8efe6;
      --ink: #1f2a2b;
      --muted: #5f6f72;
      --accent: #0b6e4f;
      --accent-strong: #084c38;
      --panel: rgba(255, 255, 255, 0.84);
      --bubble-user: #0b6e4f;
      --bubble-ai: #ffffff;
      --ring: rgba(11, 110, 79, 0.25);
      --shadow: 0 16px 40px rgba(8, 28, 21, 0.12);
      --radius: 18px;
    }

    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      font-family: 'Space Grotesk', sans-serif;
      color: var(--ink);
      min-height: 100vh;
      background:
        radial-gradient(circle at 12% 18%, #fff9e8 0, transparent 32%),
        radial-gradient(circle at 88% 84%, #dcebe3 0, transparent 28%),
        linear-gradient(165deg, var(--bg-1), var(--bg-2));
      display: grid;
      place-items: center;
      padding: 20px;
    }

    .app {
      width: min(960px, 100%);
      height: min(92vh, 860px);
      background: var(--panel);
      backdrop-filter: blur(8px);
      border: 1px solid rgba(255, 255, 255, 0.7);
      border-radius: 26px;
      box-shadow: var(--shadow);
      display: grid;
      grid-template-rows: auto 1fr auto;
      overflow: hidden;
      animation: rise .45s ease-out both;
    }

    @keyframes rise {
      from {
        opacity: 0;
        transform: translateY(12px) scale(.985);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    header {
      padding: 22px 24px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.06);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
    }

    .title-wrap {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    h1 {
      margin: 0;
      font-family: 'Fraunces', serif;
      font-size: clamp(1.25rem, 2vw, 1.7rem);
      letter-spacing: 0.3px;
    }

    .subtitle {
      margin: 0;
      color: var(--muted);
      font-size: .92rem;
    }

    .badge {
      font-size: .75rem;
      font-weight: 700;
      letter-spacing: .05em;
      text-transform: uppercase;
      padding: 8px 10px;
      border-radius: 999px;
      color: var(--accent-strong);
      background: rgba(11, 110, 79, .12);
      border: 1px solid rgba(11, 110, 79, .2);
      white-space: nowrap;
    }

    #messages {
      padding: 20px;
      overflow: auto;
      display: flex;
      flex-direction: column;
      gap: 14px;
      scroll-behavior: smooth;
    }

    .msg {
      max-width: min(86%, 680px);
      padding: 12px 14px;
      border-radius: var(--radius);
      line-height: 1.5;
      animation: pop .2s ease-out both;
      white-space: pre-wrap;
      word-break: break-word;
      border: 1px solid transparent;
    }

    @keyframes pop {
      from {
        opacity: 0;
        transform: translateY(8px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .user {
      align-self: flex-end;
      background: var(--bubble-user);
      color: #fff;
      border-color: rgba(0, 0, 0, 0.08);
      border-bottom-right-radius: 8px;
    }

    .ai {
      align-self: flex-start;
      background: var(--bubble-ai);
      border-color: rgba(0, 0, 0, 0.07);
      color: #142325;
      border-bottom-left-radius: 8px;
      box-shadow: 0 2px 0 rgba(0, 0, 0, 0.03);
    }

    .typing {
      font-style: italic;
      color: var(--muted);
    }

    form {
      border-top: 1px solid rgba(0, 0, 0, 0.06);
      padding: 14px;
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 10px;
      align-items: end;
      background: rgba(255, 255, 255, 0.74);
    }

    textarea {
      width: 100%;
      resize: none;
      min-height: 52px;
      max-height: 180px;
      border-radius: 14px;
      border: 1px solid rgba(10, 32, 26, 0.15);
      padding: 12px 14px;
      font-family: inherit;
      font-size: 1rem;
      background: #fff;
      color: var(--ink);
      transition: border-color .18s ease, box-shadow .18s ease;
    }

    textarea:focus {
      outline: none;
      border-color: var(--accent);
      box-shadow: 0 0 0 4px var(--ring);
    }

    button {
      border: none;
      border-radius: 14px;
      padding: 12px 16px;
      min-height: 52px;
      background: linear-gradient(160deg, var(--accent), var(--accent-strong));
      color: #fff;
      font-weight: 700;
      font-family: inherit;
      cursor: pointer;
      transition: transform .12s ease, filter .12s ease;
    }

    button:hover {
      filter: brightness(1.04);
      transform: translateY(-1px);
    }

    button:disabled {
      opacity: .6;
      cursor: not-allowed;
      transform: none;
    }

    @media (max-width: 720px) {
      body {
        padding: 10px;
      }

      .app {
        height: 95vh;
        border-radius: 18px;
      }

      header {
        padding: 14px;
      }

      form {
        grid-template-columns: 1fr;
      }

      button {
        width: 100%;
      }

      .msg {
        max-width: 94%;
      }
    }
  </style>
</head>
<body>
  <main class="app" aria-label="Cloudflare AI chat application">
    <header>
      <div class="title-wrap">
        <h1>Cloudflare AI Chat</h1>
        <p class="subtitle">A UI app powered by Cloudflare Workers AI</p>
      </div>
      <span class="badge" id="model-badge">@cf/meta/llama-3.1-8b-instruct</span>
    </header>

    <section id="messages" aria-live="polite"></section>

    <form id="chat-form">
      <label for="prompt" class="sr-only" style="position:absolute;left:-10000px;">Type your prompt</label>
      <textarea id="prompt" name="prompt" placeholder="Ask anything..." required></textarea>
      <button id="send-btn" type="submit">Send</button>
    </form>
  </main>

  <script>
    const form = document.getElementById('chat-form');
    const promptInput = document.getElementById('prompt');
    const sendBtn = document.getElementById('send-btn');
    const messages = document.getElementById('messages');

    function addMessage(role, text, className) {
      const node = document.createElement('article');
      node.className = 'msg ' + className;
      node.textContent = role + ': ' + text;
      messages.appendChild(node);
      messages.scrollTop = messages.scrollHeight;
      return node;
    }

    function autoGrow() {
      promptInput.style.height = 'auto';
      promptInput.style.height = Math.min(promptInput.scrollHeight, 180) + 'px';
    }

    promptInput.addEventListener('input', autoGrow);

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const text = promptInput.value.trim();
      if (!text) return;

      addMessage('You', text, 'user');
      promptInput.value = '';
      autoGrow();

      sendBtn.disabled = true;
      const loading = addMessage('AI', 'Thinking...', 'ai typing');

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: text })
        });

        const data = await response.json();
        loading.remove();

        if (!response.ok) {
          addMessage('Error', data.error || 'Request failed', 'ai');
          return;
        }

        addMessage('AI', data.reply || 'No reply', 'ai');
      } catch (error) {
        loading.remove();
        addMessage('Error', error.message || 'Network error', 'ai');
      } finally {
        sendBtn.disabled = false;
        promptInput.focus();
      }
    });

    addMessage('AI', 'Hi! I am running on Cloudflare Workers AI. Ask me something.', 'ai');
    promptInput.focus();
  </script>
</body>
</html>`;
