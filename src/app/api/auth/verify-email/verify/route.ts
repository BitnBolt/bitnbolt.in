import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/User';
// import { connectToDatabase } from '@/lib/mongodb';
import { connectDB } from '@/lib/db';
import { use } from 'react';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const token = searchParams.get('token');

        if (!token) {
            return NextResponse.json({ error: 'Token is required' }, { status: 400 });
        }

        await connectDB();
        
        const user = await User.findOne({
            verificationToken: token,
            verificationTokenExpiry: { $gt: new Date() }
        });

        if (!user) {
            return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
        }

        // Mark email as verified and remove token
        user.emailVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiry = undefined;
        await user.save();

        return NextResponse.json({ message: 'Email verified successfully' });
    } catch (error) {
        console.error('Error verifying email:', error);
        return NextResponse.json({ error: 'Failed to verify email' }, { status: 500 });
    }
} 