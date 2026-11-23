import dns from "node:dns";

if (!process.env.VERCEL) dns.setServers(["8.8.8.8", "1.1.1.1"]);
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { createAuthMiddleware, APIError } from "better-auth/api";
import { jwt } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { MongoClient } from "mongodb";

// Reuse one Mongo connection (important in dev hot-reload and serverless)
const globalForMongo = globalThis;
const client = globalForMongo._salonMongo || new MongoClient(process.env.MONGODB_URI || "mongodb://localhost:27017");
if (process.env.NODE_ENV !== "production") globalForMongo._salonMongo = client;
const db = client.db(process.env.MONGODB_DB || "salonbook");

export const auth = betterAuth({
  database: mongodbAdapter(db),
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  // Local v2 preview runs on 3001 while the unchanged API expects JWTs issued
  // with baseURL 3000. Trust both so the browser origin is accepted and the
  // token issuer still matches the server's AUTH_URL.
  trustedOrigins: [process.env.BETTER_AUTH_URL, process.env.BETTER_AUTH_PREVIEW_URL].filter(Boolean),
  emailAndPassword: { enabled: true, minPasswordLength: 6 },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
  },
  user: {
    modelName: "users",
    additionalFields: {
      // input:false -> a user can NEVER set these from the browser (no self-made admins)
      role: { type: "string", defaultValue: "customer", input: false },
      isBlocked: { type: "boolean", defaultValue: false, input: false },
      phone: { type: "string", required: false },
    },
  },
  hooks: {
    // Server-side password rules: 6+ chars, one uppercase, one lowercase
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path === "/sign-up/email") {
        const password = ctx.body?.password || "";
        if (!/[A-Z]/.test(password) || !/[a-z]/.test(password)) {
          throw new APIError("BAD_REQUEST", { message: "Password needs one uppercase and one lowercase letter" });
        }
      }
    }),
  },
  plugins: [
    // Issues short-lived JWTs that the Express API verifies through /api/auth/jwks
    jwt({ jwt: { definePayload: ({ user }) => ({ id: user.id, email: user.email, role: user.role }) } }),
    nextCookies(),
  ],
});
