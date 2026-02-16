"use client";

import React, { useState, useRef, useEffect } from "react";
import { X, Send, Loader2, Sparkles, Brain, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface AiTutorPanelProps {
  isOpen: boolean;
  onClose: () => void;
  question: any;
  userAnswer: string;
  isCorrect: boolean;
}

const FREE_LIMIT = 5;

export function AiTutorPanel({ isOpen, onClose, question, userAnswer, isCorrect }: AiTutorPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [usageCount, setUsageCount] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load usage from local storage
    const today = new Date().toDateString();
    const storageKey = `ai_tutor_usage_${today}`;
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      setUsageCount(parseInt(stored));
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const initialMessage = isCorrect
        ? "Great job! 🎉 I can help you understand this concept even better. What questions do you have?"
        : "Let's break this down. What specific part of this question was confusing?";
      
      setMessages([{ role: "assistant", content: initialMessage }]);
    }
  }, [isOpen, isCorrect, messages.length]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || usageCount >= FREE_LIMIT) return;

    const userMsg = inputValue.trim();
    setInputValue("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setIsLoading(true);

    try {
      // Increment usage
      const today = new Date().toDateString();
      const storageKey = `ai_tutor_usage_${today}`;
      const newCount = usageCount + 1;
      setUsageCount(newCount);
      localStorage.setItem(storageKey, newCount.toString());

      const response = await fetch("/api/ai-tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionContext: {
            question: question.stem,
            correctAnswer: question.answer,
            explanation: question.explanation,
            userAnswer: userAnswer,
          },
          userMessage: userMsg,
          conversationHistory: messages,
        }),
      });

      const data = await response.json();
      if (data.response) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.response }]);
      }
    } catch (error) {
      console.error("Failed to send message", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:justify-end pointer-events-none p-4 sm:p-6">
      <div className="bg-white w-full sm:w-[400px] h-[500px] rounded-2xl shadow-2xl flex flex-col pointer-events-auto border border-slate-200 overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
        {/* Header */}
        <div className="p-4 border-b bg-gradient-to-r from-emerald-600 to-emerald-500 text-white flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            <h3 className="font-bold">AI Study Tutor</h3>
          </div>
          <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50" ref={scrollRef}>
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                  msg.role === "user"
                    ? "bg-emerald-600 text-white rounded-br-none"
                    : "bg-white text-slate-800 border border-slate-200 rounded-bl-none"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
                <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 bg-white border-t">
          {usageCount >= FREE_LIMIT ? (
            <div className="text-center p-2">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-2 text-sm text-amber-800 flex items-center gap-2 justify-center">
                <Lock className="w-4 h-4" />
                Daily limit reached
              </div>
              <Button 
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                onClick={() => window.open('https://study.behaviorschool.com/auth?mode=signup', '_blank')}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Unlock Unlimited AI Tutor
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Ask a question..."
                className="flex-1"
              />
              <Button onClick={handleSendMessage} disabled={isLoading || !inputValue.trim()} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          )}
          <div className="text-xs text-center text-slate-400 mt-2">
            {FREE_LIMIT - usageCount} free messages remaining today
          </div>
        </div>
      </div>
    </div>
  );
}
