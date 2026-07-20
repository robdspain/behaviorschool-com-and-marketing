export const handler = async () => {
  const base = process.env.PUBLIC_BASE_URL || process.env.URL || "";
  const secret = process.env.TRANSFORMATION_NURTURE_SECRET || "";

  if (!base) {
    return { statusCode: 200, body: "No base URL configured" };
  }

  try {
    const response = await fetch(`${base.replace(/\/$/, "")}/api/transformation-program/nurture/process`, {
      method: "POST",
      headers: secret ? { "x-transformation-nurture-secret": secret } : {},
    });
    const body = await response.text();
    return { statusCode: 200, body: `Triggered: ${response.status} ${body}` };
  } catch (error) {
    return { statusCode: 500, body: `Error: ${String(error)}` };
  }
};
