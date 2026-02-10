import { NextResponse } from 'next/server';
import calculateRiskScore from '@/lib/riskEngine';

// MOCK DATA for Demonstration
// In a real app, you would fetch the latest "ChatSession" and "EmotionSession" from DB
const MOCK_CHAT_SENTIMENT = -0.6; // Slightly negative
const MOCK_EMOTION_DISTRIBUTION = {
    happy: 10,
    sad: 60,
    neutral: 20,
    angry: 10
};

export async function GET(req: Request) {
    try {
        // 1. Identify Dominant Emotion
        const dominantEmotion = Object.entries(MOCK_EMOTION_DISTRIBUTION).reduce((a, b) => a[1] > b[1] ? a : b)[0];

        // 2. Calculate Risk
        const { score, tier } = calculateRiskScore(MOCK_CHAT_SENTIMENT, dominantEmotion);

        // 3. Generate Recommendations
        let recommendation = "Maintain healthy routine.";
        let explanations = ["Stable emotional baseline detected"];

        if (score >= 80) {
            recommendation = "Immediate professional consultation recommended.";
            explanations = ["High distress markers detected in chat", "Persistent negative facial affect"];
        } else if (score >= 50) {
            recommendation = "Consider speaking with a counselor.";
            explanations = ["Moderate signs of anxiety/sadness observed"];
        }

        const report = {
            analysis: {
                tier: tier,
                risk_score: score,
                recommendation: recommendation,
                explanations: explanations
            },
            raw_metrics: {
                chat_sentiment: MOCK_CHAT_SENTIMENT,
                emotion_distribution: MOCK_EMOTION_DISTRIBUTION
            }
        };

        return NextResponse.json(report);

    } catch (error) {
        console.error("Risk Report Error:", error);
        return NextResponse.json({ error: "Failed to generate report" }, { status: 500 });
    }
}
