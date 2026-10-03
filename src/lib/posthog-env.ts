export const POSTHOG_API_HOST = "https://us.i.posthog.com";

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "::1", "0.0.0.0"]);

export function isLocalHostname(hostname: string): boolean {
  const host = hostname.toLowerCase().replace(/^\[|\]$/g, "");
  return LOCAL_HOSTS.has(host) || host.endsWith(".localhost");
}

export function isDeployPreviewHostname(hostname: string): boolean {
  const host = hostname.toLowerCase();
  return host.startsWith("deploy-preview-") || host.includes(".deploy-preview.");
}

/**
 * PostHog loads only when the public project key is set.
 * Localhost and Netlify deploy previews stay off unless the dev flag is "true".
 */
export function shouldInitializePostHog(input: {
  key: string | undefined;
  hostname: string;
  enableDev: string | undefined;
}): boolean {
  if (!input.key?.trim()) return false;
  const nonProduction = isLocalHostname(input.hostname) || isDeployPreviewHostname(input.hostname);
  if (nonProduction && input.enableDev !== "true") return false;
  return true;
}
