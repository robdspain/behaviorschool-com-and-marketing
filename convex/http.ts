import { httpRouter } from "convex/server";
import { authComponent, createAuth } from "./auth";
import { stripeWebhook } from "./stripeWebhook";

const http = httpRouter();

authComponent.registerRoutesLazy(http, createAuth, {
  basePath: "/api/auth",
  cors: true,
  trustedOrigins: [process.env.SITE_URL ?? "https://behaviorschool.com"],
});

http.route({
  path: "/api/stripe/behaviorschool",
  method: "POST",
  handler: stripeWebhook,
});

export default http;
