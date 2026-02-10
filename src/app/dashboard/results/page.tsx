"use client";

import { EmotionTimeline, EmotionRadar } from "@/components/features/dashboard/RiskCharts";
import { AlertTriangle, Download, ShieldCheck, Activity, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ResultsPage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const api = (await import("@/lib/api")).default;
                const res = await api.get('/dashboard/report/latest');
                setData(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background text-white">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        );
    }

    if (!data) return <div className="text-white">Failed to load report.</div>;

    const { analysis, raw_metrics } = data;

    return (
        <div className="min-h-screen bg-background p-6 lg:p-12">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Session Analysis Report</h1>
                        <p className="text-muted-foreground">Generated on {new Date().toLocaleDateString()}</p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors">
                        <Download className="w-4 h-4" />
                        <span>Export PDF</span>
                    </button>
                </div>

                {/* Risk Band */}
                <div className="glass-panel p-6 rounded-xl border-l-4 border-l-yellow-500 flex flex-col md:flex-row items-center gap-6">
                    <div className="p-4 bg-yellow-500/10 rounded-full">
                        <AlertTriangle className="w-8 h-8 text-yellow-500" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white">Current Risk Level: {analysis.tier}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                            Analysis indicates: {analysis.explanations.join(", ")}.
                            <br />
                            <span className="text-white font-medium opacity-75">NOTE: This is NOT a medical diagnosis.</span>
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-bold text-yellow-500">Score: {Math.round(analysis.risk_score)}</div>
                        <div className="text-xs text-muted-foreground">Risk Index</div>
                    </div>
                </div>

                {/* Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* Timeline Card */}
                    <div className="glass-panel p-6 rounded-xl">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-semibold text-white flex items-center gap-2">
                                <Activity className="w-4 h-4 text-primary" />
                                Sentiment Timeline
                            </h3>
                        </div>
                        <EmotionTimeline sentimentScore={raw_metrics.chat_sentiment} />
                    </div>

                    {/* Radar Card */}
                    <div className="glass-panel p-6 rounded-xl">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-semibold text-white flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-secondary" />
                                Emotion Distribution
                            </h3>
                        </div>
                        <EmotionRadar distribution={raw_metrics.emotion_distribution} />
                    </div>

                </div>

                {/* Recommendations */}
                <div className="glass-panel p-6 rounded-xl">
                    <h3 className="text-lg font-semibold text-white mb-4">Recommended Actions</h3>
                    <ul className="space-y-3">
                        <li className="flex items-start gap-3 text-sm text-muted-foreground">
                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                            {analysis.recommendation}
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
