"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, User, Bot, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import api from "@/lib/api";
import VerificationModal from "./VerificationModal";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "model";
  content: string;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]); // Empty initial state, will trigger welcome from backend if needed or just empty
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [isVerificationOpen, setIsVerificationOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Generate or retrieve session ID
    // Retrieve session ID from local storage
    const storedSession = localStorage.getItem("asghar_autos_session");
    if (storedSession) {
      setSessionId(storedSession);
    }

    // Initial Welcome Message Logic
    if (messages.length === 0) {
      // We can either hardcode the FIRST one here (to avoid API latency on load)
      // OR call the API with a special "start" signal.
      // Given the user complained about "Welcome" repeating, let's just stick to ONE hardcoded welcome
      // AND ensure the Agent doesn't repeat it in every response.
      setMessages([
        {
          role: "model",
          content:
            "Welcome to Asghar Autos! 🚗 I'm here to help you book your perfect ride. To get started, could you please tell me: * What **Car Type** you are interested in (Economy, Sedan, or SUV)? * Your desired **Pickup Date**? * And your **Return Date**?",
        },
      ]);
    }
  }, []);

  useEffect(() => {
    // Scroll to bottom
    if (scrollRef.current) {
      // @ts-ignore
      scrollRef.current.scrollTo(0, scrollRef.current.scrollHeight);
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Backend handles history internally or via DB.
      // We send just message and session_id.

      const res = await api.post("/chat", {
        message: userMessage.content,
        session_id: sessionId,
      });

      const responseText = res.data.response;
      setMessages((prev) => [
        ...prev,
        { role: "model", content: responseText },
      ]);

      // Check for keywords that indicate document upload is needed
      const lowerResponse = responseText.toLowerCase();
      if (
        lowerResponse.includes("verify your identity") ||
        lowerResponse.includes("upload") ||
        lowerResponse.includes("cnic") ||
        lowerResponse.includes("selfie") ||
        lowerResponse.includes("documents")
      ) {
        setIsVerificationOpen(true);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to send message.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerificationSuccess = () => {
    // Notify Agent with explicit instruction to finalize booking
    const successMsg =
      "Documents uploaded and verified successfully. Please proceed to finalize my booking now and provide the booking ID.";
    setMessages((prev) => [...prev, { role: "user", content: successMsg }]);
    // Trigger agent to proceed
    api
      .post("/chat", {
        message: successMsg,
        session_id: sessionId,
      })
      .then((res) => {
        setMessages((prev) => [
          ...prev,
          { role: "model", content: res.data.response },
        ]);
      });
  };

  return (
    <div className="flex flex-col h-[600px] w-full max-w-3xl mx-auto bg-card border rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-primary p-4 text-primary-foreground flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Bot className="w-6 h-6" />
          <h2 className="font-semibold text-lg">Asghar Autos AI Agent</h2>
        </div>
        <div className="flex items-center gap-2 text-xs opacity-90">
          <span className="whitespace-nowrap">User Login:</span>
          <input
            className="bg-primary-foreground/20 border border-primary-foreground/30 rounded px-2 py-1 text-xs w-full text-white placeholder:text-white/50 focus:outline-none focus:ring-1 focus:ring-white"
            value={sessionId}
            onChange={(e) => {
              const newId = e.target.value;
              setSessionId(newId);
              localStorage.setItem("asghar_autos_session", newId);
            }}
            placeholder="Enter your name..."
            type="password"
          />
        </div>
      </div>

      {/* Messages */}
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 ${
                msg.role === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <Avatar className="w-8 h-8">
                <AvatarFallback
                  className={
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }
                >
                  {msg.role === "user" ? (
                    <User className="w-4 h-4" />
                  ) : (
                    <Bot className="w-4 h-4" />
                  )}
                </AvatarFallback>
              </Avatar>
              <div
                className={`p-3 rounded-lg max-w-[80%] text-sm ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                }`}
              >
                <div className="markdown-container">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-3">
              <Avatar className="w-8 h-8">
                <AvatarFallback>
                  <Bot className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
              <div className="bg-muted p-3 rounded-lg">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input */}
      <div className="p-4 bg-background border-t">
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            title="Upload Documents"
            onClick={() => setIsVerificationOpen(true)}
            disabled={!sessionId}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
            </svg>
          </Button>
          <Input
            placeholder={
              sessionId
                ? "Type a message..."
                : "Please enter your name above to start..."
            }
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            disabled={isLoading || !sessionId}
          />
          <Button
            onClick={handleSendMessage}
            disabled={isLoading || !input.trim() || !sessionId}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <VerificationModal
        isOpen={isVerificationOpen}
        onClose={() => setIsVerificationOpen(false)}
        sessionId={sessionId}
        onVerificationSuccess={handleVerificationSuccess}
      />
    </div>
  );
}
