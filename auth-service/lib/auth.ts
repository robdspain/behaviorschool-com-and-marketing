import { betterAuth } from "better-auth";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const auth = betterAuth({
  database: pool,
  baseURL: process.env.NEXT_PUBLIC_AUTH_URL ?? "https://auth.behaviorschool.com",
  secret: process.env.BETTER_AUTH_SECRET,
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins: [
    "https://behaviorschool.com",
    "https://www.behaviorschool.com",
    "https://app.behaviorschool.com",
    "https://learning.behaviorschool.com",
    // local dev
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:5173",
  ],
  advanced: {
    crossSubDomainCookies: {
      enabled: true,
      domain: ".behaviorschool.com",
    },
  },
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
