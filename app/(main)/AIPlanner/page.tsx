"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Plane, CheckCircle, Sparkles, Zap } from "lucide-react";
import ChatMessage from "@/components/ai-planner/ChatMessage";
import TypingIndicator from "@/components/ai-planner/TypingIndicator";
import SuggestedPrompts from "@/components/ai-planner/SuggestedPrompts";
import SaveTripModal from "@/components/ai-planner/SaveTripModal";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface Feature {
  bold: string;
  rest: string;
}

type Provider = "gemini" | "groq";

interface ProviderConfig {
  id: Provider;
  name: string;
  model: string;
  badge: string;
  badgeColor: string;
  description: string;
}

const PROVIDERS: ProviderConfig[] = [
  {
    id: "gemini",
    name: "Gemini",
    model: "gemini-2.0-flash",
    badge: "Google",
    badgeColor: "#4285F4",
    description: "Best for detailed itineraries",
  },
  {
    id: "groq",
    name: "Groq",
    model: "Llama 3.3 70B",
    badge: "Fastest",
    badgeColor: "#F97316",
    description: "10× faster responses",
  },
];

const FEATURES: Feature[] = [
  { bold: "Understands natural language", rest: " — no forms, no dropdowns" },
  { bold: "Learns your preferences", rest: " across trips and refines over time" },
  { bold: "Answers questions mid-trip", rest: ' — "what\'s near me right now?"' },
  { bold: "Budget-aware", rest: " — always stays within your limits" },
];

// ── Helpers ────────────────────────────────────────────────────────────────────

/**
 * Extract a rough destination, duration, and budget from the conversation
 * so we can pre-fill the save modal. Best-effort, user can always edit.
 */
function extractTripMeta(messages: Message[]): {
  title: string;
  destination: string;
  duration_days: string;
  budget: string;
  notes: string;
  itinerary: string;
} {
  const fullText = messages.map((m) => m.content).join("\n");
  const lastAI = [...messages].reverse().find((m) => m.role === "assistant")?.content ?? "";

  // Destination — look for "in <Place>" or "to <Place>"
  const destMatch =
    fullText.match(/\b(?:in|to|visit(?:ing)?|trip to|traveling to)\s+([A-Z][a-zA-Z\s,]+?)(?:\s*[,.]|\s+for|\s+over|\s+on|\s*$)/m) ??
    fullText.match(/\b([A-Z][a-zA-Z]+(?:\s[A-Z][a-zA-Z]+)?)\s+(?:trip|itinerary|adventure|vacation)/m);
  const destination = destMatch?.[1]?.trim() ?? "";

  // Duration — "5 days", "2 weeks", "10-day"
  const durMatch = fullText.match(/(\d+)[\s-]?(?:day|days|night|nights)/i) ??
    fullText.match(/(\d+)[\s-]?week/i);
  const duration_days = durMatch
    ? durMatch[0].toLowerCase().includes("week")
      ? String(parseInt(durMatch[1]) * 7)
      : durMatch[1]
    : "";

  // Budget — "$2000", "2,000 USD", "budget of $3k"
  const budgetMatch = fullText.match(/\$[\d,]+(?:k)?|\d[\d,]+\s*(?:USD|EUR|GBP)/i) ??
    fullText.match(/budget\s+(?:of\s+)?(\$?[\d,]+)/i);
  const budget = budgetMatch?.[0]?.trim() ?? "";

  // Title — "<Destination> Trip" or first user message truncated
  const firstUserMsg = messages.find((m) => m.role === "user")?.content ?? "";
  const title = destination
    ? `${destination} Trip`
    : firstUserMsg.slice(0, 50).trim() + (firstUserMsg.length > 50 ? "…" : "");

  return { title, destination, duration_days, budget, notes: "", itinerary: lastAI };
}

// ── Component ──────────────────────────────────────────────────────────────────

function AIPlannerInner() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [chatStarted, setChatStarted] = useState<boolean>(false);
  const [provider, setProvider] = useState<Provider>("gemini");
  const [providerError, setProviderError] = useState<string | null>(null);

  // Save trip state
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [savedMessageIndex, setSavedMessageIndex] = useState<number | null>(null);
  const [prefill, setPrefill] = useState({
    title: "",
    destination: "",
    duration_days: "",
    budget: "",
    notes: "",
    itinerary: "",
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

// ← ADD THESE 6 LINES:
  const searchParams = useSearchParams();
    useEffect(() => {
      const q = searchParams.get('q');
      if (q) sendMessage(q);
      }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  const sendMessage = async (text?: string): Promise<void> => {
    const trimmed = (text || input).trim();
    if (!trimmed || isThinking) return;

    if (!chatStarted) setChatStarted(true);
    setProviderError(null);

    const userMessage: Message = { role: "user", content: trimmed };
    const updatedMessages: Message[] = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsThinking(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages, provider }),
      });

      const data = await response.json();

      if (!response.ok) {
        setProviderError(data?.error ?? "Something went wrong. Try switching AI providers.");
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data?.error ?? "I'm having trouble connecting. Try switching AI providers above!" },
        ]);
        return;
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.text },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "I'm having trouble connecting right now. Please try again!" },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleProviderSwitch = (next: Provider) => {
    setProvider(next);
    setProviderError(null);
  };

  function handleOpenSave() {
    setPrefill(extractTripMeta(messages));
    setSaveModalOpen(true);
  }

  function handleSaved() {
    // Mark the last assistant message index as saved
    const lastAIIdx = [...messages].map((m, i) => ({ m, i })).reverse().find(({ m }) => m.role === "assistant")?.i ?? null;
    setSavedMessageIndex(lastAIIdx);
  }

  const activeProvider = PROVIDERS.find((p) => p.id === provider)!;
  const lastAIIndex = [...messages].map((m, i) => ({ m, i })).reverse().find(({ m }) => m.role === "assistant")?.i ?? -1;

  return (
    <div className="min-h-screen bg-[#0D1B2A] pt-16 md:pt-[72px]">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">

          {/* LEFT — Hero Content */}
          <div className="text-white">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white/80 rounded-full px-4 py-1.5 text-sm font-medium border border-white/10 mb-8"
            >
              <Plane className="w-4 h-4 text-blue-400" strokeWidth={2} />
              AI Planner
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-display font-bold text-5xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight mb-6"
            >
              Your smartest
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                travel
              </span>
              <br />
              companion
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-white/60 text-lg leading-relaxed mb-10 max-w-md"
            >
              Just describe what you want. FlowTrip&apos;s AI understands context, budget, vibe,
              and pace — then builds a trip that actually fits your life.
            </motion.p>

            <motion.ul
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-4 mb-10"
            >
              {FEATURES.map((f, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-white/70">
                  <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" strokeWidth={2} />
                  <span>
                    <strong className="text-white font-semibold">{f.bold}</strong>{f.rest}
                  </span>
                </li>
              ))}
            </motion.ul>

            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              onClick={() => inputRef.current?.focus()}
              className="inline-flex items-center gap-2 h-14 px-8 text-base font-medium bg-primary text-white rounded-full hover:bg-primary/90 transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              Try AI planner free →
            </motion.button>
          </div>

          {/* RIGHT — Chat Interface */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] as const}}
            className="flex flex-col bg-[#F0F4F8] rounded-3xl overflow-hidden shadow-2xl"
            style={{ height: "640px", minHeight: "540px" }}
          >
            {/* Chat Header */}
            <div className="flex items-center justify-between px-5 py-4 bg-white border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center">
                  <Plane className="w-4 h-4 text-white" strokeWidth={2} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">FlowTrip AI</p>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <span className="text-[11px] text-muted-foreground">
                      Online · {activeProvider.model}
                    </span>
                  </div>
                </div>
              </div>

              {/* Provider switcher */}
              <div className="flex items-center gap-1 bg-muted rounded-xl p-1">
                {PROVIDERS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleProviderSwitch(p.id)}
                    title={p.description}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      provider === p.id
                        ? "bg-white text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {p.id === "groq" && <Zap className="w-3 h-3" />}
                    {p.name}
                    {provider === p.id && (
                      <span
                        className="text-[9px] font-bold px-1 py-0.5 rounded"
                        style={{ background: p.badgeColor + "20", color: p.badgeColor }}
                      >
                        {p.badge}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Provider error banner */}
            <AnimatePresence>
              {providerError && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="bg-orange-50 border-b border-orange-200 px-4 py-2 flex items-center justify-between"
                >
                  <p className="text-xs text-orange-700">{providerError}</p>
                  <button
                    onClick={() => handleProviderSwitch(provider === "gemini" ? "groq" : "gemini")}
                    className="text-xs font-medium text-orange-700 underline ml-3 flex-shrink-0"
                  >
                    Switch to {provider === "gemini" ? "Groq" : "Gemini"}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4">
              {!chatStarted && messages.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center h-full text-center gap-6 pb-4"
                >
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                    <Sparkles className="w-7 h-7 text-primary" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="font-display font-semibold text-foreground mb-1">
                      Ask me anything about travel
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Powered by{" "}
                      <span className="font-medium" style={{ color: activeProvider.badgeColor }}>
                        {activeProvider.name}
                      </span>
                      {" "}· Try one of these or write your own:
                    </p>
                  </div>
                  <SuggestedPrompts onSelect={(p: string) => { setInput(p); sendMessage(p); }} />
                </motion.div>
              )}

              {messages.map((msg, i) => (
                <ChatMessage
                  key={i}
                  message={msg}
                  isLast={i === lastAIIndex && !isThinking}
                  onSave={msg.role === "assistant" && i === lastAIIndex && !isThinking ? handleOpenSave : undefined}
                  isSaved={savedMessageIndex === i}
                />
              ))}

              <AnimatePresence>
                {isThinking && <TypingIndicator />}
              </AnimatePresence>

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="px-4 py-3 bg-white border-t border-border">
              <div className="flex items-end gap-2 bg-muted rounded-2xl px-4 py-2.5">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Describe your dream trip..."
                  rows={1}
                  className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground resize-none outline-none max-h-32 leading-relaxed py-0.5"
                  style={{ minHeight: "24px" }}
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = "auto";
                    target.style.height = Math.min(target.scrollHeight, 128) + "px";
                  }}
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || isThinking}
                  className="flex-shrink-0 w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[11px] text-muted-foreground text-center mt-2">
                Using{" "}
                <span className="font-medium" style={{ color: activeProvider.badgeColor }}>
                  {activeProvider.name} · {activeProvider.model}
                </span>
                {" "}· Enter to send
              </p>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Save Trip Modal */}
      <SaveTripModal
        isOpen={saveModalOpen}
        onClose={() => setSaveModalOpen(false)}
        defaults={prefill}
        itineraryText={prefill.itinerary}
      />
    </div>
  );
}

export default function AIPlanner() {
  return (
    <Suspense fallback={null}>
      <AIPlannerInner />
    </Suspense>
  );
}
