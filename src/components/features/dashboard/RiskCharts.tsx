"use client";

import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from "recharts";

interface EmotionTimelineProps {
    sentimentScore: number;
}
interface EmotionRadarProps {
    distribution: Record<string, number>;
}

export function EmotionTimeline({ sentimentScore }: EmotionTimelineProps) {
    // Simulate time-series data based on single score for demo
    const data = [
        { time: "Start", sentiment: sentimentScore * 0.5 },
        { time: "2m", sentiment: sentimentScore * 0.8 },
        { time: "4m", sentiment: sentimentScore },
        { time: "6m", sentiment: sentimentScore * 1.1 },
        { time: "End", sentiment: sentimentScore },
    ];

    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="time" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip
                        contentStyle={{ backgroundColor: "#09090b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }}
                    />
                    <Line type="monotone" dataKey="sentiment" stroke="#8884d8" strokeWidth={2} activeDot={{ r: 8 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

export function EmotionRadar({ distribution }: EmotionRadarProps) {
    const emotionData = Object.keys(distribution).map(key => ({
        subject: key.charAt(0).toUpperCase() + key.slice(1),
        A: distribution[key] * 100,
        fullMark: 100
    }));

    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={emotionData}>
                    <PolarGrid opacity={0.2} />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#888888', fontSize: 12 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="transparent" />
                    <Radar
                        name="Session Emotions"
                        dataKey="A"
                        stroke="#2dd4bf"
                        fill="#2dd4bf"
                        fillOpacity={0.3}
                    />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
}
