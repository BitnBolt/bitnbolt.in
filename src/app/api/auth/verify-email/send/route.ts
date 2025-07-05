import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { sendVerificationEmail } from '@/lib/email';
import User from '@/models/User';
// import mongoose from 'mongoose';
// import clientPromise from '@';
import crypto from 'crypto';
import { connectDB } from '@/lib/db';

export async function POST() {
    try {
        const session = await getServerSession(authOptions);
        
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();
        
        const user = await User.findOne({ email: session.user?.email });
        
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        if (user.emailVerified) {
            return NextResponse.json({ error: 'Email already verified' }, { status: 400 });
        }

        // Generate verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');
        
        // Save token to user
        user.verificationToken = verificationToken;
        user.verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
        await user.save();

        // Generate verification link
        const verificationLink = `${process.env.NEXTAUTH_URL}/auth/verify-email?token=${verificationToken}`;

        // Send verification email
        await sendVerificationEmail(user.email, verificationLink, user.name);

        return NextResponse.json({ message: 'Verification email sent' });
    } catch (error) {
        console.error('Error sending verification email:', error);
        return NextResponse.json({ error: 'Failed to send verification email' }, { status: 500 });
    }
} 