import { NextRequest, NextResponse } from 'next/server';
// import { User } from '@/models/User';
import User from '@/models/User';
import { connectDB } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
    try {
        const { email, otp, newPassword } = await request.json();

        if (!email || !otp || !newPassword) {
            return NextResponse.json(
                { success: false, message: 'Email, OTP, and new password are required' },
                { status: 400 }
            );
        }

        // Connect to database
        await connectDB();

        // Find user and verify OTP
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

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 12);

        // Update password and clear OTP fields
        user.password = hashedPassword;
        user.resetPasswordOTP = null;
        user.resetPasswordOTPExpiry = null;
        await user.save();

        return NextResponse.json({
            success: true,
            message: 'Password reset successfully'
        });

    } catch (error) {
        console.error('Error in reset password:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
} 