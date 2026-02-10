from typing import List, Dict

class RiskEngine:
    @staticmethod
    def calculate_risk(chat_sentiment: float, emotion_dist: Dict[str, float]) -> Dict:
        """
        Combines textual sentiment and facial emotion distribution to determine risk tier.
        """
        risk_score = 0.0
        explanations = []

        # 1. Textual Analysis Risk
        if chat_sentiment < -0.5:
            risk_score += 30
            explanations.append("Significant negative sentiment in conversation.")
        elif chat_sentiment < -0.2:
            risk_score += 10
            explanations.append("Mild negative sentiment detected.")

        # 2. Facial Analysis Risk
        sad_score = emotion_dist.get('sad', 0)
        fear_score = emotion_dist.get('fear', 0)
        
        if sad_score > 0.4:
            risk_score += 30
            explanations.append("High frequency of sadness expressions.")
        
        if fear_score > 0.3:
            risk_score += 20
            explanations.append("Elevated anxiety indicators observed.")

        # Determine Tier
        tier = "Low"
        if risk_score > 60:
            tier = "High"
        elif risk_score > 30:
            tier = "Moderate"

        return {
            "risk_score": risk_score,
            "tier": tier,
            "explanations": explanations,
            "recommendation": RiskEngine._get_recommendation(tier)
        }

    @staticmethod
    def _get_recommendation(tier: str) -> str:
        if tier == "High":
            return "Immediate consultation with a mental health professional is recommended."
        elif tier == "Moderate":
            return "Consider scheduling a check-in with a counselor or practicing stress-reduction techniques."
        else:
            return "Maintain current wellness practices. Monitor for any changes."
