import { cn } from "@/lib/utils";
import { Brain, User } from "lucide-react";

export interface Message {
    id: string;
    role: "user" | "bot";
    content: string;
    timestamp: Date;
}

interface MessageBubbleProps {
    message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
    const isBot = message.role === "bot";

    return (
        <div
            className={cn(
                "flex w-full items-start gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300",
                isBot ? "justify-start" : "justify-end"
            )}
        >
            {isBot && (
                <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full bg-primary/20 border border-primary/20">
                    <Brain className="h-4 w-4 text-primary" />
                </div>
            )}

            <div
                className={cn(
                    "relative max-w-[80%] rounded-2xl px-5 py-3 text-sm leading-relaxed shadow-sm",
                    isBot
                        ? "glass-panel text-gray-100 rounded-tl-none"
                        : "bg-primary text-white rounded-tr-none"
                )}
            >
                <p className="whitespace-pre-wrap">{message.content}</p>
                <span className="mt-1 block text-[10px] opacity-50">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
            </div>

            {!isBot && (
                <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full bg-secondary/20 border border-secondary/20">
                    <User className="h-4 w-4 text-secondary" />
                </div>
            )}
        </div>
    );
}
