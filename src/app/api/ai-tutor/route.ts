import { OpenAI } from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { questionContext, userMessage, conversationHistory } = body;

    const systemPrompt = `You are an expert BCBA tutor. Your goal is to help students understand behavior analysis concepts and prepare for the BCBA exam.
    
    Context:
    - Question: ${questionContext.question}
    - Correct Answer: ${questionContext.correctAnswer}
    - Explanation: ${questionContext.explanation}
    - User Answer: ${questionContext.userAnswer}
    
    Guidelines:
    - Be encouraging and supportive.
    - If the user was wrong, help them understand why without being condescending.
    - If the user was right, help them deepen their understanding.
    - Keep responses concise (under 3 paragraphs).
    - Use technical behavioral terminology (Cooper, Heron, Heward) but explain it simply.
    - Do not give away the answer immediately if they are asking for a hint; guide them.
    `;

    const messages = [
      { role: "system", content: systemPrompt },
      ...conversationHistory,
      { role: "user", content: userMessage },
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messages as any,
    });

    return NextResponse.json({
      response: completion.choices[0].message.content,
    });
  } catch (error: any) {
    console.error("AI Tutor Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate response" },
      { status: 500 }
    );
  }
}
