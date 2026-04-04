import { createClient, type GenericCtx } from "@convex-dev/better-auth";
import { convex, crossDomain } from "@convex-dev/better-auth/plugins";
import { betterAuth } from "better-auth/minimal";
import { hashPassword } from "better-auth/crypto";
import type { GenericActionCtx } from "convex/server";
import { components, internal } from "./_generated/api";
import type { DataModel } from "./_generated/dataModel";
import authConfig from "./auth.config";

const siteUrl = process.env.SITE_URL ?? "https://behaviorschool.com";

export const authComponent = createClient<DataModel>(components.betterAuth);

/**
 * FERPA A4: Password must be ≥12 chars with uppercase, lowercase, digit, and
 * special character. Tested against plaintext before hashing.
 */
const PASSWORD_COMPLEXITY_RE =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+\[\]{};:'",.<>/?\\|`~]).{12,}$/;

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

    // -------------------------------------------------------------------------
    // FERPA A4: Password policy
    // -------------------------------------------------------------------------
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
      // Minimum 12-character passwords
      minPasswordLength: 12,
      password: {
        // Validate complexity before hashing; complexity covers FERPA's
        // requirement for mixed-character-class passwords.
        hash: async (password) => {
          if (!PASSWORD_COMPLEXITY_RE.test(password)) {
            throw new Error(
              "Password must be at least 12 characters and contain uppercase, " +
                "lowercase, a number, and a special character.",
            );
          }
          return hashPassword(password);
        },
        // verifyPassword not overridden — default scrypt verify works with
        // the hash format produced by better-auth/crypto hashPassword.
      },
    },

    // -------------------------------------------------------------------------
    // FERPA A5: 30-minute inactivity session timeout
    // Setting expiresIn=1800 and updateAge=0 means every request extends the
    // session by 30 min, so the session expires exactly 30 min after the last
    // activity (inactivity timeout).
    // -------------------------------------------------------------------------
    session: {
      expiresIn: 30 * 60, // 30 minutes in seconds
      updateAge: 0,        // Refresh timestamp on every authenticated request
    },

    // -------------------------------------------------------------------------
    // FERPA A5: Secure cookie flags (HttpOnly, Secure, SameSite)
    // -------------------------------------------------------------------------
    advanced: {
      useSecureCookies: true,
      defaultCookieAttributes: {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
      },
    },

    // -------------------------------------------------------------------------
    // FERPA A4: Account lockout — rate-limit sign-in to 5 attempts per 15 min.
    // Exceeding the limit returns 429 Too Many Requests (effective lockout).
    // -------------------------------------------------------------------------
    rateLimit: {
      enabled: true,
      storage: "database",
      customRules: {
        "/sign-in/email": { window: 15 * 60, max: 5 },
      },
    },

    // -------------------------------------------------------------------------
    // FERPA A4: Password history tracking (no reuse of last 12 passwords).
    // Hashes are stored via internal mutations after each account create/update.
    //
    // NOTE: Full reuse *enforcement* (rejecting a reused password before it is
    // accepted) requires access to the plaintext at the point of checking, which
    // the databaseHooks `after` callbacks do not provide. The hashes stored here
    // enable a Convex action wrapper (e.g. a custom /api/change-password route)
    // to call internal.passwordHistory.getHistory, verify each stored hash
    // against the new plaintext, and reject before forwarding to better-auth.
    // -------------------------------------------------------------------------
    databaseHooks: {
      account: {
        create: {
          after: async (account) => {
            if (account.providerId === "credential" && account.password) {
              await (ctx as GenericActionCtx<DataModel>).runMutation(internal.passwordHistory.store, {
                userId: account.userId,
                passwordHash: account.password,
              });
            }
          },
        },
        update: {
          after: async (account) => {
            if (account.password && account.userId) {
              await (ctx as GenericActionCtx<DataModel>).runMutation(internal.passwordHistory.store, {
                userId: account.userId,
                passwordHash: account.password,
              });
            }
          },
        },
      },
    },

    plugins: [
      crossDomain({ siteUrl }),
      convex({ authConfig, jwt: { expirationSeconds: 1800 } }),
    ],
  });
};
