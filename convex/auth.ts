import { createClient, type GenericCtx } from "@convex-dev/better-auth";
import { convex, crossDomain } from "@convex-dev/better-auth/plugins";
import { betterAuth } from "better-auth/minimal";
import { twoFactor } from "better-auth/plugins";
import { components } from "./_generated/api";
import type { DataModel } from "./_generated/dataModel";
import authConfig from "./auth.config";

const siteUrl = process.env.SITE_URL ?? "https://behaviorschool.com";

export const authComponent = createClient<DataModel>(components.betterAuth);

export const createAuth = (ctx: GenericCtx<DataModel>) => {
  return betterAuth({
    baseURL: siteUrl,
    trustedOrigins: [
      "https://behaviorschool.com",
      "https://www.behaviorschool.com",
      "https://app.behaviorschool.com",
      "https://learning.behaviorschool.com",
      "https://bcba-tools.behaviorschool.com",
    ],
    database: authComponent.adapter(ctx),
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
    },
    plugins: [
      twoFactor({
        issuer: "Behavior School",
        totpOptions: {
          digits: 6,
          period: 30,
        },
      }),
      crossDomain({ siteUrl }),
      convex({ authConfig }),
    ],
  });
};
