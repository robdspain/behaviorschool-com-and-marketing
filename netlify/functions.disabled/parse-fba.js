const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

const SYSTEM_PROMPT = `You are an expert BCBA specializing in parsing Functional Behavior Assessment documents. Read the following FBA text and extract the specified information into a valid JSON object. The JSON object must conform to this exact schema. If a field cannot be found, return an empty string "" for that field. Do not include the markdown characters \`\`\`json in your response.

**JSON Schema:**
{
  "studentName": "string",
  "targetBehavior": "string",
  "baselineData": "string",
  "functionOfBehavior": "attention" | "escape" | "tangible" | "sensory" | "unknown",
  "antecedents": "string",
  "consequences": "string",
  "replacementBehavior": "string"
}
`;

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { fbaText } = JSON.parse(event.body || '{}');
    if (!fbaText) {
      return { statusCode: 400, body: JSON.stringify({ error: 'fbaText is required' }) };
    }

    const fullPrompt = `${SYSTEM_PROMPT}\n\n**FBA Text:**\n${fbaText}`;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const rawJson = response.text().trim();
    
    const data = JSON.parse(rawJson);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error('FBA Parser Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to parse FBA text.' }),
    };
  }
};
