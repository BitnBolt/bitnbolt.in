import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { connectDB } from "./db"
import bcrypt from "bcryptjs"
import User from "@/models/User"

export const authOptions: NextAuthOptions = {
    debug: process.env.NODE_ENV === 'development',
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            authorization: {
                params: {
                    prompt: "select_account",
                    access_type: "offline",
                    response_type: "code"
                }
            }
        }),
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Invalid credentials');
                }

                await connectDB();
                
                const user = await User.findOne({ email: credentials.email });
                
                if (!user || !user.password) {
                    throw new Error('User not found');
                }

                const isPasswordCorrect = await bcrypt.compare(
                    credentials.password,
                    user.password
                );

                if (!isPasswordCorrect) {
                    throw new Error('Invalid password');
                }

                return {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                    image: user.image,
                    role: user.role
                };
            }
        })
    ],
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
        updateAge: 24 * 60 * 60, // 24 hours
    },
    pages: {
        signIn: "/auth/signin",
        error: "/auth/error",
    },
    callbacks: {
        async signIn({ user, account }) {
            if (account?.provider === "google") {
                await connectDB();
                
                const existingUser = await User.findOne({ email: user.email });
                
                if (existingUser) {
                    // Update existing user with Google info and set provider as 'google'
                    await User.findOneAndUpdate(
                        { email: user.email },
                        {
                            $set: {
                                name: user.name || existingUser.name,
                                image: user.image || existingUser.image,
                                emailVerified: true,
                                provider: "google"
                            }
                        }
                    );
                    return true;
                }
                
                // Create new user for Google sign in, set provider as 'google'
                await User.create({
                    email: user.email,
                    name: user.name,
                    image: user.image,
                    emailVerified: true,
                    role: 'user',
                    provider: 'google'
                });
                return true;
            }

            // For credentials provider
            return true;
        },
        async jwt({ token, user, trigger }) {
            if (user) {
                token.role = user.role || 'user';
                token.id = user.id;
            }

            // Refresh user data on each sign in
            if (trigger === "signIn" || trigger === "signUp") {
                await connectDB();
                const dbUser = await User.findOne({ email: token.email });
                if (dbUser) {
                    token.role = dbUser.role;
                    token.id = dbUser._id.toString();
                }
            }

            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.role = token.role as string;
                session.user.id = token.id as string;
            }
            return session;
        }
    }
} 