import { createAuthClient } from "better-auth/react";
import { twoFactorClient } from "better-auth/client/plugins";
import { convexClient, crossDomainClient } from "@convex-dev/better-auth/client/plugins";

const authBaseUrl =
  process.env.NEXT_PUBLIC_CONVEX_SITE_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://behaviorschool.com";

export const authClient = createAuthClient({
  baseURL: `${authBaseUrl}/api/auth`,
  plugins: [crossDomainClient(), convexClient(), twoFactorClient()],
});
