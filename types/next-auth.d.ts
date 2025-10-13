import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user: {
      username?: string;
      avatar?: string;
    } & DefaultSession["user"];
  }

  interface JWT {
    accessToken?: string;
    username?: string;
    avatar?: string;
  }
}

