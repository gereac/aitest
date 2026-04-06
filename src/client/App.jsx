import { useEffect, useRef, useState } from "react";

const MODEL = "@cf/meta/llama-3.1-8b-instruct";

export default function App() {
  const messageIdRef = useRef(1);
  const [messages, setMessages] = useState([
    {
      id: 0,
      role: "AI",
      text: "Hi! I am running on Cloudflare Workers AI. Ask me something.",
      kind: "ai",
    },
  ]);
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const listRef = useRef(null);

  function nextMessageId() {
    const id = messageIdRef.current;
    messageIdRef.current += 1;
    return id;
  }

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  async function onSubmit(event) {
    event.preventDefault();
    const text = prompt.trim();
    if (!text || isLoading) {
      return;
    }

    setMessages((current) =>
      current.concat({ id: nextMessageId(), role: "You", text, kind: "user" }),
    );
    setPrompt("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      const data = await response.json();
      if (!response.ok) {
        setMessages((current) =>
          current.concat({
            id: nextMessageId(),
            role: "Error",
            text: data.error || "Request failed",
            kind: "ai",
          }),
        );
        return;
      }

      setMessages((current) =>
        current.concat({
          id: nextMessageId(),
          role: "AI",
          text: data.reply || "No reply",
          kind: "ai",
        }),
      );
    } catch (error) {
      setMessages((current) =>
        current.concat({
          id: nextMessageId(),
          role: "Error",
          text: error?.message || "Network error",
          kind: "ai",
        }),
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="app" aria-label="Cloudflare AI chat application">
      <header>
        <div className="title-wrap">
          <h1>Cloudflare AI Chat</h1>
          <p className="subtitle">
            A bundled React UI powered by Cloudflare Workers AI
          </p>
        </div>
        <span className="badge">{MODEL}</span>
      </header>

      <section className="messages" aria-live="polite" ref={listRef}>
        {messages.map((message) => (
          <article key={message.id} className={`msg ${message.kind}`}>
            {message.role}: {message.text}
          </article>
        ))}
        {isLoading ? (
          <article className="msg ai typing">AI: Thinking...</article>
        ) : null}
      </section>

      <form onSubmit={onSubmit}>
        <label
          htmlFor="prompt"
          style={{ position: "absolute", left: "-10000px" }}
        >
          Type your prompt
        </label>
        <textarea
          id="prompt"
          name="prompt"
          placeholder="Ask anything..."
          required
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Sending..." : "Send"}
        </button>
      </form>
    </main>
  );
}
