import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const SYSTEM_PROMPT = `
You are NeuroVision, a professional and empathetic AI therapist conducting a mental health screening session.
Your role is to actively assess the user's mental well-being, not just passively listen.

GUIDELINES:
1.  **Ask Probing Questions**: Do not just acknowledge. Follow up with specific questions about their sleep, appetite, daily energy, anxiety levels, and mood patterns.
2.  **One Question at a Time**: Keep the conversation flowing naturally. Don't overwhelm the user.
3.  **Be Empathetic but Analytical**: Validate their feelings ("I understand that must be hard") but immediately pivot to gathering more context ("How long have you felt this way?").
4.  **Goal**: Your objective is to gather enough information to form a comprehensive clinical summary of their mental state.
5.  **Safety First**: If you detect immediate self-harm risk, prioritize safety resources immediately.

Start by asking how they have been feeling lately in regards to their overall mood and energy.
`;

export async function POST(req: Request) {
    try {
        const { message, history } = await req.json();
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return NextResponse.json(
                { reply: "AI Service Unavailable (Missing Configuration)" },
                { status: 500 }
            );
        }

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: SYSTEM_PROMPT }],
                },
                {
                    role: "model",
                    parts: [{ text: "I understand. I am NeuroVision, here to listen and support without judgment. How can I help you today?" }],
                },
                ...history.map((msg: any) => ({
                    role: msg.role === 'bot' ? 'model' : 'user',
                    parts: [{ text: msg.content }]
                }))
            ],
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({ reply: text });

    } catch (error: any) {
        console.error("Gemini Error:", error);

        if (error.status === 429 || (error.message && error.message.includes("429"))) {
            return NextResponse.json(
                { reply: "I'm receiving too many messages right now. Please give me a moment to catch up." },
                { status: 429 }
            );
        }

        return NextResponse.json(
            { reply: "I'm having trouble connecting to my thought processor." },
            { status: 500 }
        );
    }
}
