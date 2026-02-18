import { ConvexHttpClient } from "convex/browser";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || process.env.CONVEX_URL;

export const getConvexClient = () => {
  if (!convexUrl) {
    throw new Error("Missing NEXT_PUBLIC_CONVEX_URL (Convex deployment URL)");
  }
  return new ConvexHttpClient(convexUrl);
};
