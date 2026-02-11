import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      email: string;
      role?: "USER" | "TENANT";
    } & DefaultSession["user"];
  }

  interface User {
    email?: string;
    role?: "USER" | "TENANT";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    email?: string;
    role?: "USER" | "TENANT";
  }
}
