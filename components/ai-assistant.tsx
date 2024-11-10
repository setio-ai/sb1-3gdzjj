"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

type Message = {
  id: number;
  content: string;
  role: "assistant" | "user";
  timestamp: Date;
};

const initialMessages: Message[] = [
  {
    id: 1,
    content: "Hello! This is a demo version of the AI assistant. In the production version, you'll be able to get real-time financial advice.",
    role: "assistant",
    timestamp: new Date(),
  },
];

const suggestedQuestions = [
  "How can I start investing?",
  "What's a good savings strategy?",
  "How to create a budget?",
  "Explain emergency funds",
];

const demoResponses: { [key: string]: string } = {
  "How can I start investing?": "To start investing, consider these steps:\n1. Build an emergency fund first\n2. Define your investment goals\n3. Research different investment options\n4. Start with low-cost index funds\n5. Consider consulting a financial advisor",
  "What's a good savings strategy?": "A solid savings strategy includes:\n1. Set clear savings goals\n2. Follow the 50/30/20 rule\n3. Automate your savings\n4. Track your expenses\n5. Look for ways to reduce unnecessary spending",
  "How to create a budget?": "To create a budget:\n1. Calculate your total income\n2. Track all expenses\n3. Categorize your spending\n4. Set realistic goals\n5. Review and adjust regularly",
  "Explain emergency funds": "An emergency fund is money set aside for unexpected expenses. Aim to save:\n1. 3-6 months of living expenses\n2. Keep it in an easily accessible account\n3. Use only for true emergencies\n4. Replenish after using",
};

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setMessages(initialMessages);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = {
      id: messages.length + 1,
      content: input,
      role: "user" as const,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate API response
    setTimeout(() => {
      const response = demoResponses[input] || "I'm a demo version. In production, I'll provide personalized financial advice based on your specific situation.";
      
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          content: response,
          role: "assistant",
          timestamp: new Date(),
        },
      ]);
      setIsLoading(false);
    }, 1000);
  };

  const handleQuestionClick = async (question: string) => {
    if (isLoading) return;
    
    const userMessage = {
      id: messages.length + 1,
      content: question,
      role: "user" as const,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Simulate API response
    setTimeout(() => {
      const response = demoResponses[question];
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          content: response,
          role: "assistant",
          timestamp: new Date(),
        },
      ]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="space-y-4">
      <Card className="p-4 h-[500px] flex flex-col">
        <div className="flex-1 overflow-y-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-2 items-start",
                message.role === "user" && "flex-row-reverse"
              )}
            >
              {message.role === "assistant" ? (
                <Bot className="h-6 w-6 mt-1" />
              ) : (
                <User className="h-6 w-6 mt-1" />
              )}
              <div
                className={cn(
                  "rounded-lg px-3 py-2 max-w-[85%]",
                  message.role === "assistant"
                    ? "bg-muted"
                    : "bg-primary text-primary-foreground"
                )}
              >
                <p className="whitespace-pre-line">{message.content}</p>
                <p className="text-xs opacity-50 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-2 items-start">
              <Bot className="h-6 w-6 mt-1" />
              <div className="bg-muted rounded-lg px-3 py-2">
                <p className="animate-pulse">Thinking...</p>
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything about personal finance..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button type="submit" size="icon" disabled={isLoading}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </Card>

      <div className="space-y-2">
        <h3 className="text-sm font-medium">Suggested Questions</h3>
        <div className="flex flex-wrap gap-2">
          {suggestedQuestions.map((question) => (
            <Button
              key={question}
              variant="outline"
              size="sm"
              onClick={() => handleQuestionClick(question)}
              disabled={isLoading}
            >
              {question}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}