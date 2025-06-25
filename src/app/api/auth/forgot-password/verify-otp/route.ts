import { NextRequest, NextResponse } from 'next/server';
// import { User } from '@/models/User';
import User from '@/models/User';
// import { connectToDatabase } from '@/lib/mongodb';
import { connectDB } from '@/lib/db';

export async function POST(request: NextRequest) {
    try {
        const { email, otp } = await request.json();

        if (!email || !otp) {
            return NextResponse.json(
                { success: false, message: 'Email and OTP are required' },
                { status: 400 }
            );
        }

        // Connect to database
        await connectDB();

        // Find user and check OTP
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

        // Verify OTP
        if (!user.resetPasswordOTP || user.resetPasswordOTP !== otp) {
            return NextResponse.json(
                { success: false, message: 'Invalid OTP' },
                { status: 400 }
            );
        }

        // Check if OTP has expired
        if (!user.resetPasswordOTPExpiry || user.resetPasswordOTPExpiry < new Date()) {
            return NextResponse.json(
                { success: false, message: 'OTP has expired' },
                { status: 400 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'OTP verified successfully'
        });

    } catch (error) {
        console.error('Error in verify OTP:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
} 