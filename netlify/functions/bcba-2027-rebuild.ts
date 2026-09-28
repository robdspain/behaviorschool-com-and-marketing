import type { Handler } from "@netlify/functions";

const handler: Handler = async () => {
  const buildHook = process.env.BCBA_2027_BUILD_HOOK || process.env.NETLIFY_BUILD_HOOK || "";
  if (!buildHook) {
    return {
      statusCode: 503,
      body: JSON.stringify({ ok: false, message: "BCBA_2027_BUILD_HOOK is not configured" }),
    };
  }

  const response = await fetch(buildHook, { method: "POST" });
  return {
    statusCode: response.ok ? 202 : 502,
    body: JSON.stringify({ ok: response.ok, upstreamStatus: response.status }),
  };
};

export { handler };
