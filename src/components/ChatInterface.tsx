"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Bot, User, Sparkles, RotateCcw, Copy, Check } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

const WELCOME: Message = {
  id: "welcome",
  role: "assistant",
  content:
    "مرحباً! أنا مساعدك الذكي لبيتونيا 👋\nيمكنني تحليل أداء حساباتك على السوشيال ميديا، مقارنة المنصات، وتقديم توصيات مخصصة لتحسين نتائجك.\nاسألني عن أي شيء يتعلق بأداء بيتونيا!",
  timestamp: "",
};

const SUGGESTIONS = [
  "كيف كان أداء تيك توك هذا الشهر؟",
  "قارن بين المنصات الثلاث",
  "ما هي أفضل أوقات النشر؟",
  "كيف يمكن زيادة المبيعات من السوشيال؟",
  "ما هو أفضل نوع محتوى يحقق تفاعلاً؟",
  "حلل أداء انستجرام مقارنة بالمنصات الأخرى",
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="opacity-0 group-hover:opacity-100 p-1 rounded text-slate-400 hover:text-slate-600 transition-all"
    >
      {copied ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
    </button>
  );
}

function MessageBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === "user";
  return (
    <div className={`flex items-start gap-2.5 group ${isUser ? "flex-row-reverse" : ""}`}>
      {/* Avatar */}
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
          isUser
            ? "bg-gradient-to-br from-amber-400 to-orange-500"
            : "bg-gradient-to-br from-violet-500 to-purple-600"
        }`}
      >
        {isUser ? <User size={14} className="text-white" /> : <Bot size={14} className="text-white" />}
      </div>

      {/* Bubble */}
      <div className={`max-w-[82%] flex flex-col ${isUser ? "items-end" : "items-start"}`}>
        <div
          className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-line ${
            isUser
              ? "bg-amber-500 text-white rounded-tl-sm"
              : "bg-white border border-slate-100 text-slate-700 rounded-tr-sm shadow-sm"
          }`}
        >
          {msg.content}
          {/* Streaming cursor */}
          {msg.content === "" && (
            <span className="inline-flex gap-1 mt-1">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 mt-1 px-1">
          {msg.timestamp && (
            <span className="text-slate-400 text-[10px]">{msg.timestamp}</span>
          )}
          {!isUser && msg.content && <CopyButton text={msg.content} />}
        </div>
      </div>
    </div>
  );
}

export default function ChatInterface({ compact = false }: { compact?: boolean }) {
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const now = () =>
    new Date().toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = useCallback(
    async (text?: string) => {
      const content = (text ?? input).trim();
      if (!content || streaming) return;
      setInput("");

      const userMsg: Message = {
        id: `u-${Date.now()}`,
        role: "user",
        content,
        timestamp: now(),
      };

      const assistantId = `a-${Date.now()}`;
      const assistantMsg: Message = {
        id: assistantId,
        role: "assistant",
        content: "",
        timestamp: "",
      };

      setMessages((prev) => [...prev, userMsg, assistantMsg]);
      setStreaming(true);

      // Build conversation history for API (exclude welcome message)
      const history = [...messages.filter((m) => m.id !== "welcome"), userMsg].map(
        (m) => ({ role: m.role, content: m.content })
      );

      const ctrl = new AbortController();
      abortRef.current = ctrl;

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: history }),
          signal: ctrl.signal,
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({ error: "خطأ في الاتصال" }));
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId
                ? { ...m, content: `⚠️ ${err.error}`, timestamp: now() }
                : m
            )
          );
          return;
        }

        const reader = res.body!.getReader();
        const decoder = new TextDecoder();
        let fullText = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          fullText += decoder.decode(value, { stream: true });
          const snap = fullText;
          setMessages((prev) =>
            prev.map((m) => (m.id === assistantId ? { ...m, content: snap } : m))
          );
        }

        // Stamp timestamp after stream finishes
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, timestamp: now() } : m
          )
        );
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId
                ? { ...m, content: "⚠️ انقطع الاتصال، حاول مجدداً.", timestamp: now() }
                : m
            )
          );
        }
      } finally {
        setStreaming(false);
        abortRef.current = null;
        inputRef.current?.focus();
      }
    },
    [input, messages, streaming]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const reset = () => {
    abortRef.current?.abort();
    setMessages([WELCOME]);
    setStreaming(false);
    setInput("");
  };

  const showSuggestions =
    messages.length <= 1 || (messages.length === 2 && messages[1].content === "");

  return (
    <div
      className={`bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col ${
        compact ? "h-[420px]" : "h-full"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-sm">
            <Sparkles size={15} className="text-white" />
          </div>
          <div>
            <p className="text-slate-800 font-bold text-sm">المساعد الذكي</p>
            <div className="flex items-center gap-1">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  streaming ? "bg-amber-400 animate-pulse" : "bg-emerald-500"
                }`}
              />
              <span className={`text-[10px] font-medium ${streaming ? "text-amber-500" : "text-emerald-500"}`}>
                {streaming ? "يكتب..." : "مساعد ذكي محلي"}
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={reset}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
          title="محادثة جديدة"
        >
          <RotateCcw size={14} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} msg={msg} />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      {showSuggestions && (
        <div className="px-4 pb-2 flex flex-wrap gap-1.5 shrink-0">
          {(compact ? SUGGESTIONS.slice(0, 3) : SUGGESTIONS).map((s) => (
            <button
              key={s}
              onClick={() => sendMessage(s)}
              disabled={streaming}
              className="text-xs bg-slate-50 border border-slate-200 text-slate-600 rounded-full px-3 py-1.5 hover:bg-violet-50 hover:border-violet-200 hover:text-violet-700 transition-colors disabled:opacity-50"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="px-3 pb-3 pt-2 border-t border-slate-100 shrink-0">
        <div className="flex items-end gap-2 bg-slate-50 rounded-xl border border-slate-200 focus-within:border-violet-300 focus-within:bg-white transition-colors px-3 py-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = `${Math.min(e.target.scrollHeight, 100)}px`;
            }}
            onKeyDown={handleKeyDown}
            placeholder="اسألني عن أداء بيتونيا..."
            rows={1}
            disabled={streaming}
            className="flex-1 bg-transparent text-sm text-slate-700 placeholder:text-slate-400 outline-none resize-none leading-relaxed"
            style={{ minHeight: "24px" }}
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || streaming}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors shrink-0 mb-px ${
              input.trim() && !streaming
                ? "bg-violet-500 hover:bg-violet-600"
                : "bg-slate-200"
            }`}
          >
            <Send
              size={14}
              className={input.trim() && !streaming ? "text-white" : "text-slate-400"}
            />
          </button>
        </div>
        <p className="text-[10px] text-slate-400 text-center mt-1.5">
          Enter للإرسال · Shift+Enter لسطر جديد
        </p>
      </div>
    </div>
  );
}
