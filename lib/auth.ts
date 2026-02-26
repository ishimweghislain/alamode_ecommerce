import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma as any),
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Invalid credentials");
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                });

                if (!user || !user.password) {
                    throw new Error("User not found");
                }

                const isValid = await bcrypt.compare(credentials.password, user.password);

                if (!isValid) {
                    throw new Error("Invalid password");
                }

                return user;
            },
        }),
    ],
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role;
                token.id = user.id;
            }

            // Refresh address/phone from DB on every token refresh
            const dbUser = await prisma.user.findUnique({
                where: { id: token.id as string },
                select: { address: true, phoneNumber: true }
            });

            if (dbUser) {
                token.address = dbUser.address;
                token.phoneNumber = dbUser.phoneNumber;
            }

            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                // @ts-ignore
                session.user.role = token.role;
                // @ts-ignore
                session.user.id = token.id;
                // @ts-ignore
                session.user.address = token.address;
                // @ts-ignore
                session.user.phoneNumber = token.phoneNumber;
            }
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
    // Add these for better production behavior on Vercel
    useSecureCookies: process.env.NODE_ENV === "production",
    cookies: {
        sessionToken: {
            name: process.env.NODE_ENV === "production" ? `__Secure-next-auth.session-token` : `next-auth.session-token`,
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                secure: process.env.NODE_ENV === "production"
            }
        }
    },
    pages: {
        signIn: "/login",
        error: "/login",
    },
    debug: process.env.NODE_ENV === "development",
};
