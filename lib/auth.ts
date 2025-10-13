import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

interface GitHubProfile {
	login: string;
	avatar_url: string;
}

declare module "next-auth" {
	interface Session {
		user: {
			id: string;
			name?: string | null;
			email?: string | null;
			image?: string | null;
			username?: string;
			avatar?: string;
		};
		accessToken?: string;
	}

	interface JWT {
		accessToken?: string;
		username?: string;
		avatar?: string;
	}
}

export const { handlers, signIn, signOut, auth } = NextAuth({
	providers: [
		GitHub({
			clientId: process.env.GITHUB_CLIENT_ID!,
			clientSecret: process.env.GITHUB_CLIENT_SECRET!,
			authorization: {
				params: {
					scope: "read:user user:email repo",
				},
			},
		}),
	],
	callbacks: {
		async jwt({ token, account, profile }) {
			if (account && profile) {
				token.accessToken = account.access_token;
				token.username = (profile as unknown as GitHubProfile).login;
				token.avatar = (profile as unknown as GitHubProfile).avatar_url;
			}
			return token;
		},
		async session({ session, token }) {
			if (session.user) {
				session.user.username = token.username as string;
				session.user.avatar = token.avatar as string;
				session.accessToken = token.accessToken as string;
			}
			return session;
		},
		async signIn() {
			return true;
		},
	},
	pages: {
		signIn: "/",
	},
});

