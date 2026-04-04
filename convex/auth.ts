import { createClient, type GenericCtx } from "@convex-dev/better-auth";
import { convex, crossDomain } from "@convex-dev/better-auth/plugins";
import { createAuthMiddleware } from "@better-auth/core/api";
import { betterAuth } from "better-auth/minimal";
import { hashPassword } from "better-auth/crypto";
import { twoFactor } from "better-auth/plugins";
import type { GenericActionCtx } from "convex/server";
import { components, internal } from "./_generated/api";
import type { DataModel } from "./_generated/dataModel";
import authConfig from "./auth.config";
import { writeAuditLog } from "./audit_logger";

const siteUrl = process.env.SITE_URL ?? "https://behaviorschool.com";

export const authComponent = createClient<DataModel>(components.betterAuth);

/**
 * FERPA A4: Password must be ≥12 chars with uppercase, lowercase, digit, and
 * special character. Tested against plaintext before hashing.
 */
const PASSWORD_COMPLEXITY_RE =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+\[\]{};:'",.<>/?\\|`~]).{12,}$/;

function getRequestIp(headers: Headers) {
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim();
  }

  return headers.get("x-real-ip") ?? undefined;
}

function getHeader(headers: Headers | undefined, key: string) {
  return headers?.get(key) ?? undefined;
}

function getResponseStatus(returned: unknown) {
  if (returned instanceof Response) {
    return returned.status;
  }

  return 200;
}

function isSuccessfulResponse(returned: unknown) {
  return getResponseStatus(returned) < 400;
}

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
      twoFactor({
        issuer: "Behavior School",
      }),
    ],
    hooks: {
      after: createAuthMiddleware(async (authContext) => {
        if (!["/sign-in/email", "/sign-out", "/change-password", "/set-password", "/reset-password", "/two-factor/enable", "/two-factor/verify-totp", "/two-factor/disable"].includes(authContext.path)) {
          return;
        }

        const status = isSuccessfulResponse(authContext.context.returned) ? "success" : "failure";
        const actor = authContext.context.newSession?.user ?? authContext.context.session?.user ?? null;
        const actionByPath: Record<string, string> = {
          "/sign-in/email": status === "success" ? "login_success" : "login_failure",
          "/sign-out": "logout",
          "/change-password": "password_change",
          "/set-password": "password_set",
          "/reset-password": "password_reset",
          "/two-factor/enable": status === "success" ? "mfa_enrollment_started" : "mfa_enrollment_failed",
          "/two-factor/verify-totp": status === "success" ? "mfa_totp_verified" : "mfa_totp_verification_failed",
          "/two-factor/disable": status === "success" ? "mfa_disabled" : "mfa_disable_failed",
        };

        await writeAuditLog({
          category: "auth",
          actionType: actionByPath[authContext.path] ?? authContext.path.replaceAll("/", "").trim(),
          resource: "better_auth",
          status,
          actorUserId: actor?.id,
          actorEmail: actor?.email,
          method: authContext.method,
          ipAddress: authContext.headers ? getRequestIp(authContext.headers) : undefined,
          userAgent: getHeader(authContext.headers, "user-agent"),
          metadata: {
            path: authContext.path,
            responseStatus: getResponseStatus(authContext.context.returned),
          },
        });
      }),
    },
  });
};
