import { NextRequest, NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

export async function POST(request: NextRequest) {
  try {
    const { statement, context } = await request.json();

    if (!statement) {
      return NextResponse.json({ error: "Statement is required" }, { status: 400 });
    }

    if (!GEMINI_API_KEY) {
      // Fallback to template-based generation if no API key
      return NextResponse.json({
        validating: generateTemplateValidating(statement, context),
        challenging: generateTemplateChallenging(statement, context),
        source: "template",
      });
    }

    const prompt = `You are an expert in Acceptance and Commitment Therapy (ACT) and Relational Frame Theory (RFT), helping a school-based behavior analyst conduct a Fusion Functional Analysis.

A student made this verbal statement: "${statement}"
${context ? `Context: ${context}` : ""}

Generate TWO clinical scripts:

1. VALIDATING SCRIPT: A statement that validates and supports the student's verbal relation. This should acknowledge their experience and make the thought feel true/understandable. The goal is to strengthen the fusion with the thought.

2. CHALLENGING SCRIPT: A gentle, curious question that helps the student notice the thought AS a thought (defusion). Don't invalidate or argue—just create psychological distance. Use curious language like "I wonder..." or "What if..."

Format your response as JSON:
{
  "validating": "The validating script here",
  "challenging": "The challenging script here",
  "frameType": "The relational frame type (e.g., Self-as-Content, Temporal-Always, Conditional, Causal)"
}

Make the scripts conversational, appropriate for a school-aged student, and directly reference their specific statement. Keep each script 1-3 sentences.`;

    const response = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500,
        },
      }),
    });

    if (!response.ok) {
      console.error("Gemini API error:", await response.text());
      // Fallback to template
      return NextResponse.json({
        validating: generateTemplateValidating(statement, context),
        challenging: generateTemplateChallenging(statement, context),
        source: "template",
      });
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    
    // Parse JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]);
        return NextResponse.json({
          validating: parsed.validating || generateTemplateValidating(statement, context),
          challenging: parsed.challenging || generateTemplateChallenging(statement, context),
          frameType: parsed.frameType || "Verbal Relation",
          source: "gemini",
        });
      } catch {
        // JSON parse failed, use text extraction
      }
    }
    
    // Fallback to template if parsing fails
    return NextResponse.json({
      validating: generateTemplateValidating(statement, context),
      challenging: generateTemplateChallenging(statement, context),
      source: "template",
    });
    
  } catch (error) {
    console.error("Script generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate scripts" },
      { status: 500 }
    );
  }
}

function generateTemplateValidating(statement: string, context?: string): string {
  const ctx = context ? `, especially ${context.toLowerCase()}` : "";
  return `"I hear you saying '${statement}'. When that thought shows up${ctx}, it probably feels completely true and makes a lot of sense."`;
}

function generateTemplateChallenging(statement: string, context?: string): string {
  const ctx = context ? ` ${context.toLowerCase()}` : "";
  return `"I'm curious—is '${statement}' a fact about you, or is it more like a thought your mind is having${ctx}? What would it be like to notice that thought without having to believe it or fight it?"`;
}
