import { NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';
import { dbConnect } from '@/lib/db';
import User from '@/models/User';

export async function POST(req: Request) {
    try {
        const { full_name, email, password } = await req.json();

        if (!full_name || !email || !password) {
            return NextResponse.json(
                { detail: 'Please provide all fields' },
                { status: 400 }
            );
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { detail: 'Invalid email address' },
                { status: 400 }
            );
        }

        // Connect to MongoDB
        await dbConnect();

        // Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return NextResponse.json(
                { detail: 'User already exists' },
                { status: 400 }
            );
        }

        // Hash password
        const hashedPassword = await bcryptjs.hash(password, 10);

        // Create new user
        const user = await User.create({
            full_name,
            email: email.toLowerCase(),
            password: hashedPassword,
        });

        return NextResponse.json({
            _id: user._id,
            full_name: user.full_name,
            email: user.email,
            detail: "User Registered Successfully"
        }, { status: 201 });

    } catch (error: any) {
        console.error("Register Error:", error);

        if (error.code === 11000) {
            return NextResponse.json(
                { detail: 'Email is already in use' },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { detail: error?.message || 'Server Error' },
            { status: 500 }
        );
    }
}
