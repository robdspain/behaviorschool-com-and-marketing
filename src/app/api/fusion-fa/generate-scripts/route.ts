import { NextRequest, NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
// Using Gemini 2.5 Pro - Google's most capable model for nuanced clinical analysis
const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro-preview-05-06:generateContent";

export async function POST(request: NextRequest) {
  try {
    const { statement, context, studentName } = await request.json();

    if (!statement) {
      return NextResponse.json({ error: "Statement is required" }, { status: 400 });
    }

    if (!GEMINI_API_KEY) {
      // Fallback to template-based generation if no API key
      return NextResponse.json({
        validatingScripts: [generateTemplateValidating(statement, context)],
        challengingScripts: [generateTemplateChallenging(statement, context)],
        relationType: "Verbal Relation",
        relationExplanation: "The individual has formed a verbal relation with this thought.",
        suggestedTitle: generateSuggestedTitle(statement),
        source: "template",
      });
    }

    const prompt = `You are an expert in Acceptance and Commitment Therapy (ACT) and Relational Frame Theory (RFT), helping a school-based behavior analyst conduct a Fusion Functional Analysis.

A student${studentName ? ` (${studentName})` : ""} made this verbal statement: "${statement}"
${context ? `Context: ${context}` : ""}

Analyze this statement through the lens of Relational Frame Theory and generate:

1. SUGGESTED TITLE: A brief, evocative title for this statement (2-4 words, like "The Shiny Door" or "The Bad Morning")

2. RELATION TYPE: Identify the relational frame type using format "Category / Fusion Level"
   Examples: "Causal / Fused", "Coordination / Highly Fused", "Causal / Evaluative", "Temporal / Absolute", "Conditional / Rule-Governed"

3. RELATION EXPLANATION: A 2-3 sentence clinical explanation of the relational frame. Explain WHY this is this type of frame and what cognitive fusion is occurring. Be specific to the student's statement.

4. VALIDATING SCRIPTS: Generate exactly 4 empathetic, validating statements that acknowledge and support the student's experience. These should:
   - Make the thought feel understood and valid
   - Acknowledge the emotional experience
   - NOT challenge or question the thought
   - Be conversational and age-appropriate

5. CHALLENGING SCRIPTS: Generate exactly 4 gentle, curious questions/statements that promote defusion. These should:
   - Help the student notice the thought AS a thought
   - Use curious language ("I wonder...", "What if...", "Is it possible...")
   - Create psychological distance without invalidating
   - Be Socratic, not lecturing

Format your response as JSON:
{
  "suggestedTitle": "Brief Title Here",
  "relationType": "Category / Fusion Level",
  "relationExplanation": "2-3 sentence explanation of the relational frame and fusion pattern",
  "validatingScripts": [
    "First validating statement",
    "Second validating statement",
    "Third validating statement",
    "Fourth validating statement"
  ],
  "challengingScripts": [
    "First challenging question",
    "Second challenging question",
    "Third challenging question",
    "Fourth challenging question"
  ]
}

Make all scripts conversational, appropriate for a school-aged student, and directly reference their specific statement and context.`;

    const response = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1500,
        },
      }),
    });

    if (!response.ok) {
      console.error("Gemini API error:", await response.text());
      // Fallback to template
      return NextResponse.json({
        validatingScripts: [generateTemplateValidating(statement, context)],
        challengingScripts: [generateTemplateChallenging(statement, context)],
        relationType: "Verbal Relation",
        relationExplanation: "The individual has formed a verbal relation with this thought.",
        suggestedTitle: generateSuggestedTitle(statement),
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
          validatingScripts: parsed.validatingScripts || [generateTemplateValidating(statement, context)],
          challengingScripts: parsed.challengingScripts || [generateTemplateChallenging(statement, context)],
          relationType: parsed.relationType || "Verbal Relation",
          relationExplanation: parsed.relationExplanation || "The individual has formed a verbal relation with this thought.",
          suggestedTitle: parsed.suggestedTitle || generateSuggestedTitle(statement),
          source: "gemini",
        });
      } catch {
        // JSON parse failed, use text extraction
      }
    }
    
    // Fallback to template if parsing fails
    return NextResponse.json({
      validatingScripts: [generateTemplateValidating(statement, context)],
      challengingScripts: [generateTemplateChallenging(statement, context)],
      relationType: "Verbal Relation",
      relationExplanation: "The individual has formed a verbal relation with this thought.",
      suggestedTitle: generateSuggestedTitle(statement),
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

function generateSuggestedTitle(statement: string): string {
  // Extract key words for a title
  const words = statement.toLowerCase();
  if (words.includes("shiny") || words.includes("touch")) return "The Temptation";
  if (words.includes("bad day") || words.includes("bad morning")) return "The Bad Day";
  if (words.includes("stupid") || words.includes("dumb")) return "The Self-Doubt";
  if (words.includes("can't") || words.includes("impossible")) return "The Barrier";
  if (words.includes("always") || words.includes("never")) return "The Absolute";
  if (words.includes("hate") || words.includes("angry")) return "The Anger";
  if (words.includes("scared") || words.includes("afraid")) return "The Fear";
  if (words.includes("ghost") || words.includes("voice")) return "The Inner Voice";
  if (words.includes("normal") || words.includes("act")) return "The Mask";
  return "The Statement";
}

function generateTemplateValidating(statement: string, context?: string): string {
  const ctx = context ? `, especially ${context.toLowerCase()}` : "";
  return `"I hear you saying '${statement}'. When that thought shows up${ctx}, it probably feels completely true and makes a lot of sense."`;
}

function generateTemplateChallenging(statement: string, context?: string): string {
  const ctx = context ? ` ${context.toLowerCase()}` : "";
  return `"I'm curious—is '${statement}' a fact about you, or is it more like a thought your mind is having${ctx}? What would it be like to notice that thought without having to believe it or fight it?"`;
}
