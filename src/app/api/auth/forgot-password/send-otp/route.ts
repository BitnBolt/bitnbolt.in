import { NextRequest, NextResponse } from 'next/server';
import { sendOTPEmail } from '@/lib/email';
// import { User } from '@/models/User';
import User from '@/models/User';
import { connectDB } from '@/lib/db';

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json(
                { success: false, message: 'Email is required' },
                { status: 400 }
            );
        }

        // Connect to database
        await connectDB();

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json(
                { success: false, message: 'User not found' },
                { status: 404 }
            );
        }

        // Check if user is using Google authentication
        if (user.provider === 'google') {
            return NextResponse.json(
                { 
                    success: false, 
                    message: 'This account uses Google Sign-In. Please reset your password through Google.' 
                },
                { status: 400 }
            );
        }

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Store OTP and its expiry in user document
        user.resetPasswordOTP = otp;
        user.resetPasswordOTPExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
        await user.save();

        // Send OTP email
        const emailResult = await sendOTPEmail(email, otp, user.name);

        if (!emailResult.success) {
            return NextResponse.json(
                { success: false, message: 'Failed to send OTP email' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'OTP sent successfully'
        });

    } catch (error) {
        console.error('Error in forgot password send OTP:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
} 