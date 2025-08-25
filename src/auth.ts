import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || "placeholder",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "placeholder",
    }),
  ],
  callbacks: {
    async signIn() {
      // Only allow sign-in if credentials are properly configured
      if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
        return false;
      }
      return true;
    },
  },
  logger: {
    error: (code, metadata) => {
      // Suppress auth errors in production when credentials are missing
      if (process.env.NODE_ENV === "production" && 
          (code.includes("CLIENT_ID") || code.includes("CLIENT_SECRET"))) {
        return;
      }
      console.error(code, metadata);
    },
  },
});



