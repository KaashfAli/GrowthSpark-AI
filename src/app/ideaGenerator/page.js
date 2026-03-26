"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import styles from "./ideaGenerator.module.css";
import { MoveLeft } from "lucide-react";

export default function IdeaGenerator() {
  const [messages, setMessages] = useState(() => {
  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem("ig_chat");
      const parsed = saved ? JSON.parse(saved) : [];
      // ✅ Filter out any null/broken items
      return Array.isArray(parsed) ? parsed.filter(msg => msg && msg.role) : [];
    } catch {
      localStorage.removeItem("ig_chat"); // clear corrupted data
      return [];
    }
  }
  return [];
});
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    localStorage.setItem("ig_chat", JSON.stringify(messages));
  }, [messages]);

  const sendMessage = async (e, customInput = null) => {
    if (e) e.preventDefault();

    const messageToSend = customInput || input;
    if (!messageToSend.trim()) return;

    const userMessage = { role: "user", text: messageToSend };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: messageToSend }),
      });

      const data = await response.json();

      const botMessage = {
        role: "bot",
        text: data.text,
        mode: data.mode, // ✅ important
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [...prev, {
        role: "bot",
        text: "⚠️ Could not connect to the server. Please check your connection and try again.",
        mode: null,
        isError: true,
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestions = [
    "🍕 Food brand growth ideas",
    "💪 Fitness coach reels ideas",
    "📉 Why my reels are not getting views?",
    "🚨 Why am I not gaining followers?",
    "⚠️ Am I shadowbanned?",
    "📊 Audit my Instagram page",
  ];

  return (
    <div className={styles["ig-root"]}>
      <div className={`${styles["ig-orb"]} ${styles["ig-orb-1"]}`} />
      <div className={`${styles["ig-orb"]} ${styles["ig-orb-2"]}`} />

      <div className={styles["ig-container"]}>

        {/* Header */}
        <header className={styles["ig-header"]}>
          <Link href="/" className={styles["ig-back"]}><MoveLeft width={13} /> Home</Link>
          <div className={styles["ig-title-wrap"]}>
            <div className={styles["ig-logo"]}>GrowthSpark</div>
            <div className={styles["ig-subtitle"]}>Instagram Idea Engine</div>
          </div>
          <div className={styles["ig-status"]}>
            <span className={styles["ig-status-dot"]} />
            AI Ready
          </div>
        </header>

        {/* Messages */}
        <div className={styles["ig-messages"]}>
          {messages.length === 0 && !isLoading && (
            <div className={styles["ig-empty"]}>
              <div className={styles["ig-empty-icon"]}>✦</div>
              <h3>What's your niche?</h3>
              <p>
                Tell me about your business or problem and I'll generate expert-level Instagram growth strategies.
              </p>

              <div className={styles["ig-suggestions"]}>
                {suggestions.map((s) => (
                  <button
                    key={s}
                    className={styles["ig-suggestion-chip"]}
                    onClick={() => sendMessage(null, s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`${styles["ig-msg-row"]} ${msg.role === "user" ? styles["ig-msg-user"] : styles["ig-msg-bot"]}`}
            >
              <div className={`${styles["ig-bubble"]} ${msg.isError ? styles["ig-bubble-error"] : ""}`}>

                {/* 🔥 MODE BADGE */}
                {msg.role === "bot" && msg.mode && (
                  <div className={styles["ig-mode-badge"]}>
                    {msg.mode === "ideas" && "💡 Ideas"}
                    {msg.mode === "audit" && "🚨 Audit"}
                    {msg.mode === "low_views" && "📉 Low Views"}
                    {msg.mode === "shadowban" && "⚠️ Reach Issue"}
                  </div>
                )}

                {msg.text}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className={styles["ig-typing"]}>
              <div className={styles["ig-typing-inner"]}>
                <div className={styles["ig-dots"]}>
                  <div className={styles["ig-dot"]} />
                  <div className={styles["ig-dot"]} />
                  <div className={styles["ig-dot"]} />
                </div>

                <span className={styles["ig-typing-label"]}>
                  {messages.length === 0
                    ? "Analyzing your niche..."
                    : "Generating expert strategy..."}
                </span>
              </div>
            </div>
          )}

          <div ref={scrollRef} />
        </div>

        {/* Input */}
        <div className={styles["ig-input-area"]}>
          <form className={styles["ig-form"]} onSubmit={sendMessage}>
            <div className={styles["ig-input-wrap"]}>
              <input
                className={styles["ig-input"]}
                placeholder="Describe your business or problem..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              className={styles["ig-send-btn"]}
              disabled={isLoading || !input.trim()}
            >
              <span>Generate</span>
              <span>✦</span>
            </button>
          </form>

          <div className={styles["ig-hint"]}>
            Powered by GrowthSpark AI · Your ideas are private
          </div>
        </div>

      </div>
    </div>
  );
}