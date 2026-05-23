"use client";

import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { Plane, Bookmark, Check } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatMessageProps {
  message: Message;
  isLast?: boolean;
  onSave?: () => void;
  isSaved?: boolean;
}

export default function ChatMessage({ message, isLast, onSave, isSaved }: ChatMessageProps) {
  const isUser = message.role === "user";
  const { user } = useAuth();

  const initials = user?.full_name
    ? user.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : user?.email?.[0]?.toUpperCase() ?? "U";

  const showSaveButton = !isUser && isLast && onSave;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
    >
      {/* AI Avatar */}
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center mt-0.5">
          <Plane className="w-4 h-4 text-white" strokeWidth={2} />
        </div>
      )}

      <div className={`max-w-[80%] ${isUser ? "items-end" : "items-start"} flex flex-col gap-1`}>
        {!isUser && (
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-foreground">FlowTrip AI</span>
            <span className="text-[11px] text-green-500 font-mono">● Online · responds instantly</span>
          </div>
        )}

        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed
            ${isUser
              ? "bg-primary text-white rounded-br-sm"
              : "bg-white border border-border text-foreground rounded-bl-sm shadow-sm"
            }`}
        >
          {isUser ? (
            <p>{message.content}</p>
          ) : (
            <div className="prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-0.5 prose-strong:font-semibold prose-strong:text-foreground">
              <ReactMarkdown
                components={{
                  p: ({ children }) => <p className="my-1 leading-relaxed">{children}</p>,
                  ul: ({ children }) => <ul className="my-1 ml-4 list-disc space-y-0.5">{children}</ul>,
                  ol: ({ children }) => <ol className="my-1 ml-4 list-decimal space-y-0.5">{children}</ol>,
                  li: ({ children }) => <li className="text-sm">{children}</li>,
                  strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {/* Save trip button — only on last AI message */}
        {showSaveButton && (
          <motion.button
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onClick={onSave}
            className={`mt-1.5 inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium border transition-all ${
              isSaved
                ? "bg-green-50 border-green-200 text-green-700 cursor-default"
                : "bg-white border-border text-muted-foreground hover:border-primary hover:text-primary hover:bg-primary/5"
            }`}
          >
            {isSaved ? (
              <>
                <Check className="w-3.5 h-3.5" />
                Saved to your trips
              </>
            ) : (
              <>
                <Bookmark className="w-3.5 h-3.5" />
                Save this trip
              </>
            )}
          </motion.button>
        )}
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center mt-0.5">
          <span className="text-xs font-bold text-foreground">{initials}</span>
        </div>
      )}
    </motion.div>
  );
}