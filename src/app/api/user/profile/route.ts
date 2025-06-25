import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { authOptions } from "@/lib/auth";

// GET: Return user's phoneNumber and deliveryAddress if present
export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }

        await connectDB();
        const user = await User.findOne({ email: session.user.email });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Always return phoneNumber and deliveryAddress, even if null
        return NextResponse.json({
            phoneNumber: user.phoneNumber ?? null,
            deliveryAddress: user.deliveryAddress ?? {
                street: null,
                city: null,
                state: null,
                postalCode: null,
                country: null
            },
            emailVerified: user.emailVerified
        });
    } catch (error) {
        console.error("Error fetching profile:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// PUT: Update user's phoneNumber or deliveryAddress
export async function PUT(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }

        const data = await request.json();
        const { phoneNumber, deliveryAddress } = data;

        await connectDB();
        const user = await User.findOne({ email: session.user.email });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Only update phoneNumber or deliveryAddress if provided
        let updated = false;
        if (typeof phoneNumber !== "undefined") {
            user.phoneNumber = phoneNumber;
            updated = true;
        }
        if (typeof deliveryAddress !== "undefined") {
            // Only update fields that exist in the model
            user.deliveryAddress = {
                street: deliveryAddress?.street ?? null,
                city: deliveryAddress?.city ?? null,
                state: deliveryAddress?.state ?? null,
                postalCode: deliveryAddress?.postalCode ?? null,
                country: deliveryAddress?.country ?? null
            };
            updated = true;
        }

        if (updated) {
            await user.save();
        }

        return NextResponse.json({
            message: "Profile updated successfully",
            phoneNumber: user.phoneNumber ?? null,
            deliveryAddress: user.deliveryAddress ?? {
                street: null,
                city: null,
                state: null,
                postalCode: null,
                country: null
            }
        });
    } catch (error) {
        console.error("Error updating profile:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}