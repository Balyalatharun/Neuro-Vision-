import { ChatInterface } from "@/components/features/chat/ChatInterface";

export default function DashboardPage() {
    return (
        <div className="min-h-screen bg-background relative overflow-hidden flex flex-col items-center justify-center p-4">
            {/* Ambient Background */}
            <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />
            <div className="absolute -left-[200px] top-[20%] w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[120px] pointer-events-none" />

            <main className="w-full max-w-6xl z-10 flex flex-col items-center">
                <ChatInterface />
            </main>
        </div>
    );
}
