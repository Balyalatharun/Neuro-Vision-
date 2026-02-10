"use client";

import { useRef, useState, useEffect } from "react";
import { Camera, RefreshCw, CheckCircle, AlertOctagon } from "lucide-react";
import { cn } from "@/lib/utils";

interface CameraModuleProps {
    onCaptureComplete: (sessionId: string) => void;
    isProcessing: boolean;
}

export function CameraModule({ onCaptureComplete, isProcessing }: CameraModuleProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [permission, setPermission] = useState<"pending" | "granted" | "denied">("pending");
    const [progress, setProgress] = useState(0);

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { width: 640, height: 480, facingMode: "user" }
            });
            setStream(mediaStream);
            setPermission("granted");
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch (err) {
            console.error("Camera error:", err);
            setPermission("denied");
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    };

    useEffect(() => {
        return () => stopCamera();
    }, []);

    const handleStartAnalysis = () => {
        if (!stream) return;

        // Simulate capture process
        let currentProgress = 0;
        const interval = setInterval(() => {
            currentProgress += 5;
            setProgress(currentProgress);
            if (currentProgress >= 100) {
                clearInterval(interval);
                stopCamera();
                onCaptureComplete("mock-session-id");
            }
        }, 200); // 4 seconds total
    };

    return (
        <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto p-6 glass-panel rounded-2xl">
            <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden border border-white/10 shadow-inner">
                {permission === "pending" && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-black/80">
                        <Camera className="w-12 h-12 text-muted-foreground mb-4" />
                        <p className="text-white mb-6 text-center max-w-sm">
                            We need access to your camera to analyze facial expressions.
                            Data is processed locally/ephemerally.
                        </p>
                        <button
                            onClick={startCamera}
                            className="px-6 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors"
                        >
                            Allow Camera
                        </button>
                    </div>
                )}

                {permission === "denied" && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-black/90">
                        <AlertOctagon className="w-12 h-12 text-destructive mb-4" />
                        <p className="text-white">Camera access denied.</p>
                        <button
                            onClick={startCamera}
                            className="mt-4 flex items-center gap-2 text-sm text-muted-foreground hover:text-white"
                        >
                            <RefreshCw className="w-4 h-4" /> Try Again
                        </button>
                    </div>
                )}

                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover transform -scale-x-100"
                />

                {/* Scanning Overlay */}
                {stream && progress > 0 && progress < 100 && (
                    <div className="absolute inset-0 border-2 border-primary/50 z-20 animate-pulse bg-primary/5">
                        <div className="absolute top-4 left-4 text-xs font-mono text-primary bg-black/50 px-2 rounded">
                            ANALYZING... {progress}%
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-6 w-full flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                    {stream ? "Camera Active - Ready for session" : "Camera Inactive"}
                </div>

                {stream && progress === 0 && (
                    <button
                        onClick={handleStartAnalysis}
                        className="px-6 py-2 bg-secondary text-secondary-foreground font-medium rounded-md hover:bg-secondary/90 transition-colors shadow-[0_0_15px_rgba(45,212,191,0.3)]"
                    >
                        Start Analysis
                    </button>
                )}

                {progress === 100 && (
                    <div className="flex items-center gap-2 text-green-400">
                        <CheckCircle className="w-5 h-5" />
                        <span>Analysis Complete</span>
                    </div>
                )}
            </div>
        </div>
    );
}
