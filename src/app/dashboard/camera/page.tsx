"use client";

import { CameraModule } from "@/components/features/camera/CameraModule";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Brain } from "lucide-react";

export default function CameraSessionPage() {
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(false);

    const handleCaptureComplete = (sessionId: string) => {
        setIsProcessing(true);
        // Mock processing delay
        setTimeout(() => {
            router.push("/dashboard/results");
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
            <div className="max-w-2xl w-full text-center space-y-6">
                <div className="inline-flex items-center justify-center p-3 rounded-full bg-secondary/10 mb-4">
                    <Brain className="w-8 h-8 text-secondary" />
                </div>

                <h1 className="text-3xl font-bold text-white">Visual Authenticity Check</h1>
                <p className="text-muted-foreground max-w-lg mx-auto">
                    We will now capture a few moments to analyze non-verbal emotional cues.
                    Please look at the camera comfortably.
                </p>

                <CameraModule
                    onCaptureComplete={handleCaptureComplete}
                    isProcessing={isProcessing}
                />
            </div>
        </div>
    );
}
