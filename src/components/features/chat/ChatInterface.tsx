"use client";

import { useState, useRef, useEffect } from "react";
import { Send, MoreVertical, StopCircle } from "lucide-react";
import { MessageBubble, type Message } from "./MessageBubble";
import { cn } from "@/lib/utils";
import { ConsentModal } from "@/components/features/onboarding/ConsentModal";
import { useRouter } from "next/navigation";
import axios from "axios";

export function ChatInterface() {
    const router = useRouter();
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [showConsent, setShowConsent] = useState(true);
    const scrollRef = useRef<HTMLDivElement>(null);

    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            role: "bot",
            content: "Hello. I'm NeuroVision's AI assistant. I'm here to listen and support you. How are you feeling today?",
            timestamp: new Date()
        }
    ]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            role: "user",
            content: input,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setIsTyping(true);

        try {
            // Call Next.js API Route instead of Python Backend
            const history = messages.slice(-5).map(m => ({
                role: m.role,
                content: m.content
            }));

            const res = await axios.post('/api/gemini', {
                message: userMsg.content,
                history: history
            });

            const botMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: "bot",
                content: res.data.reply || "I'm listening...",
                timestamp: new Date()
            };
            setMessages(prev => [...prev, botMsg]);

        } catch (err: any) {
            console.error(err);
            let errorMessage = "I'm having trouble connecting to my thought processor. Please check your connection.";

            if (axios.isAxiosError(err) && err.response?.data?.reply) {
                errorMessage = err.response.data.reply;
            }

            const errorMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: "bot",
                content: errorMessage,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <>
            <PermissionGate
                isOpen={showConsent}
                onAccept={() => setShowConsent(false)}
                onDecline={() => router.push('/')}
            />

            <div className="flex h-[85vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse" />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-white">NeuroVision AI</h3>
                            <p className="text-xs text-muted-foreground">Always here to listen</p>
                        </div>
                    </div>
                    <button className="text-muted-foreground hover:text-white transition-colors">
                        <MoreVertical className="h-5 w-5" />
                    </button>
                </div>

                {/* Messages Area */}
                <div
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
                >
                    {messages.map((msg) => (
                        <MessageBubble key={msg.id} message={msg} />
                    ))}

                    {isTyping && (
                        <div className="flex w-full items-start gap-4">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/20 border border-primary/20">
                                <div className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
                                <div className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.15s] mx-0.5" />
                                <div className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce" />
                            </div>
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="border-t border-white/10 bg-white/5 p-4 md:p-6">
                    <div className="relative flex items-end gap-3 rounded-xl border border-white/10 bg-black/20 p-2 focus-within:ring-1 focus-within:ring-primary/50 transition-all">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Type your message..."
                            className="min-h-[50px] max-h-[150px] w-full resize-none bg-transparent px-3 py-3 text-sm text-white placeholder:text-muted-foreground focus:outline-none scrollbar-none"
                            rows={1}
                        />
                        <div className="flex pb-2 pr-2 gap-2">
                            <button
                                onClick={() => router.push('/dashboard/camera')}
                                className="p-2 text-muted-foreground hover:text-red-400 transition-colors flex items-center gap-2"
                                title="End Chat & Start Video Scan"
                            >
                                <StopCircle className="h-5 w-5" />
                                <span className="text-xs font-medium">End & Scan</span>
                            </button>
                            <button
                                onClick={handleSend}
                                disabled={!input.trim() || isTyping}
                                className={cn(
                                    "rounded-lg p-2 transition-all",
                                    input.trim()
                                        ? "bg-primary text-white hover:bg-primary/90"
                                        : "bg-white/10 text-muted-foreground cursor-not-allowed"
                                )}
                            >
                                <Send className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                    <p className="mt-3 text-center text-[10px] text-muted-foreground">
                        AI can make mistakes. Consider checking important information.
                    </p>
                </div>
            </div>
        </>
    );
}

function PermissionGate({ isOpen, onAccept, onDecline }: any) {
    if (!isOpen) return null;
    return <ConsentModal isOpen={isOpen} onAccept={onAccept} onDecline={onDecline} />;
}
