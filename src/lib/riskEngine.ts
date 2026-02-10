export default function calculateRiskScore(sentimentScore: number, dominantEmotion: string): { score: number, tier: string } {
    let score = 50; // Base score

    // 1. Sentiment Adjustment (Remote Chat)
    // Sentiment Range: -1.0 (Negative) to 1.0 (Positive)
    // Negative sentiment increases risk.
    if (sentimentScore < -0.5) score += 30;
    else if (sentimentScore < 0) score += 15;
    else if (sentimentScore > 0.5) score -= 10;

    // 2. Emotion Adjustment (Visual)
    switch (dominantEmotion.toLowerCase()) {
        case 'sad':
        case 'fear':
            score += 20;
            break;
        case 'angry':
            score += 15;
            break;
        case 'neutral':
            score -= 5;
            break;
        case 'happy':
            score -= 20;
            break;
    }

    // Cap Score
    score = Math.max(0, Math.min(100, score));

    // Determine Tier
    let tier = 'Low Risk';
    if (score >= 80) tier = 'High Risk';
    else if (score >= 50) tier = 'Moderate Risk';

    return { score, tier };
}
