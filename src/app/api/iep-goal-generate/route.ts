export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

export async function POST(request: NextRequest) {
  try {
    const { studentDescription, behaviorArea, gradeLevel, specificConcern } =
      await request.json();

    if (!behaviorArea) {
      return NextResponse.json(
        { error: "Behavior area is required" },
        { status: 400 }
      );
    }

    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "AI generation not configured" },
        { status: 503 }
      );
    }

    const prompt = `You are an expert BCBA (Board Certified Behavior Analyst) writing IEP goals for a school setting. You specialize in writing high-quality, measurable, legally defensible IEP behavior goals.

QUALITY STANDARDS — every goal must follow this exact format:
"Given [condition], [student/the student] will [observable behavior] as measured by [measurement method] [criteria], across [X] consecutive [sessions/school days/weeks]."

REQUIREMENTS:
- Condition: specific setting, antecedent, or context (e.g., "When presented with a non-preferred task during classroom instruction")
- Behavior: operationally defined, observable, measurable — NO vague terms like "will improve," "will understand," "will learn"
- Criteria: specific percentage, frequency count, duration, or rate (e.g., "80% of opportunities," "no more than 2 incidents per week," "for at least 10 consecutive minutes")
- Measurement method: explicit (e.g., "frequency count," "percentage of opportunities," "duration recording," "momentary time sampling," "staff observation data")
- Consecutive criterion: number of consecutive sessions/days required to demonstrate mastery
- Must be realistic and age-appropriate for ${gradeLevel || "school-age"} students
- Must be BACB-aligned and school-specific

EXAMPLE HIGH-QUALITY GOALS (use these as benchmarks):
1. "Given frustration or denial of a preferred item, the student will use a replacement behavior (requesting a break, using words to express frustration) instead of engaging in physical aggression, reducing aggressive incidents to no more than 1 per week as measured by staff incident reports, across 4 consecutive weeks."

2. "Given whole-group instruction, the student will refrain from calling out or leaving their seat without permission, with no more than 2 disruptions per class period as measured by teacher frequency data, across 4 consecutive weeks."

3. "Given a non-preferred academic task, the student will begin the task within 2 minutes of the directive with or without adult support, in 4 out of 5 opportunities per day as measured by teacher data collection, across 10 consecutive school days."

4. "Given a structured group activity, the student will participate appropriately with peers by taking turns, sharing materials, and contributing ideas, in 4 out of 5 group activities per week as measured by teacher observation rubric, across 4 consecutive weeks."

NOW GENERATE 3 IEP goals for:
- Behavior area: ${behaviorArea}
- Grade level: ${gradeLevel || "Elementary"}
- Specific concern: ${specificConcern || behaviorArea}
${studentDescription ? `- Student context: ${studentDescription}` : ""}

Return ONLY a JSON array with exactly 3 goals. Each goal object must have:
{
  "condition": "...",
  "behavior": "...",
  "criteria": "...",
  "goal": "Full goal statement in the required format"
}

Do not include any text outside the JSON array. Do not use markdown code blocks.`;

    const response = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.3,
          topP: 0.8,
          maxOutputTokens: 2048,
        },
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Gemini API error:", err);
      return NextResponse.json({ error: "AI generation failed" }, { status: 500 });
    }

    const data = await response.json();
    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    // Clean up potential markdown wrapping
    const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

    let goals;
    try {
      goals = JSON.parse(cleaned);
    } catch {
      console.error("Failed to parse Gemini response:", text);
      return NextResponse.json(
        { error: "Failed to parse AI response" },
        { status: 500 }
      );
    }

    return NextResponse.json({ goals });
  } catch (err) {
    console.error("iep-goal-generate error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
