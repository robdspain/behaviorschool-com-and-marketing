// NextAuth completely disabled to avoid conflicts with Supabase auth
// import NextAuth from "next-auth";
// import Google from "next-auth/providers/google";

// Placeholder exports to prevent import errors
export const handlers = {
  GET: () => new Response('NextAuth disabled', { status: 404 }),
  POST: () => new Response('NextAuth disabled', { status: 404 })
};

export const auth = () => null;
export const signIn = () => Promise.reject('NextAuth disabled');
export const signOut = () => Promise.reject('NextAuth disabled');

// Original NextAuth configuration commented out
/*
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
    error: (error: Error) => {
      // Suppress auth errors in production when credentials are missing
      if (process.env.NODE_ENV === "production" && 
          error.message && 
          (error.message.includes("CLIENT_ID") || error.message.includes("CLIENT_SECRET"))) {
        return;
      }
      console.error(error);
    },
  },
});
*/



