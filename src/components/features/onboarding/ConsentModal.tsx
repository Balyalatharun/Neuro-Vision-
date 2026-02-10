"use client";

import { ShieldAlert, Check, X } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface ConsentModalProps {
    isOpen: boolean;
    onAccept: () => void;
    onDecline: () => void;
}

export function ConsentModal({ isOpen, onAccept, onDecline }: ConsentModalProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted || !isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="relative w-full max-w-lg overflow-hidden rounded-xl border border-white/10 bg-[#0a0a0b] shadow-2xl">
                <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 rounded-full bg-yellow-500/10 text-yellow-500">
                            <ShieldAlert className="w-6 h-6" />
                        </div>
                        <h2 className="text-xl font-semibold text-white">System Disclaimer & Consent</h2>
                    </div>

                    <div className="space-y-4 text-sm text-muted-foreground max-h-[60vh] overflow-y-auto pr-2">
                        <p>
                            Welcome to <strong>NEUROVISION</strong>. Before proceeding, please acknowledge the following:
                        </p>

                        <ul className="list-disc pl-5 space-y-2">
                            <li className="text-white/90">
                                <strong>Not a Medical Device:</strong> This system is an AI-based engineering project designed for early risk detection research. It does NOT provide medical diagnoses or replace professional mental health care.
                            </li>
                            <li className="text-white/90">
                                <strong>Data Privacy:</strong> Your text and facial data are processed for analysis purposes. No raw video is permanently stored. Face data is analyzed ephemerally or stored only as anonymized metadata (emotion scores) per session.
                            </li>
                            <li className="text-white/90">
                                <strong>Emergency:</strong> If you are in immediate danger or experiencing a medical emergency, please contact local emergency services immediately.
                            </li>
                        </ul>

                        <div className="bg-white/5 p-3 rounded-md border border-white/5 mt-4">
                            <p className="text-xs">
                                By clicking "I Understand & Accept", you voluntarily consent to participate in this AI-assisted session and understand its limitations.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-3 mt-8 justify-end">
                        <button
                            onClick={onDecline}
                            className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-white transition-colors"
                        >
                            Decline
                        </button>
                        <button
                            onClick={onAccept}
                            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ring-offset-[#0a0a0b]"
                        >
                            <Check className="mr-2 h-4 w-4" />
                            I Understand & Accept
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
