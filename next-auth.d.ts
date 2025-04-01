import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role: string;
  }

  interface JWT {
    role?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
  }
}