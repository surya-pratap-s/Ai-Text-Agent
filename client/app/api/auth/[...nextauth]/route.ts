import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),

        // Email + Password (Custom)
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (
                    credentials?.email === "test@example.com" &&
                    credentials?.password === "1234"
                ) {
                    return { id: "1", name: "Test User", email: "test@example.com" };
                }
                return null;
            },
        }),
    ],

    pages: {
        signIn: "/auth/signin",
    },

    session: { strategy: "jwt" },

    callbacks: {
        async jwt({ token, user }) {
            if (user) token.user = user;
            return token;
        },
        async session({ session, token }) {
            session.user = token.user as any;
            return session;
        },
        async redirect({ url, baseUrl }) {
            return baseUrl;
        },
    },

    secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
