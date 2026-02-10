import { NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { dbConnect } from '@/lib/db';
import User from '@/models/User';

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json(
                { detail: 'Email and password are required' },
                { status: 400 }
            );
        }

        // Connect to MongoDB
        await dbConnect();

        // Find user by email
        const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

        if (!user) {
            return NextResponse.json(
                { detail: 'Invalid email or password' },
                { status: 401 }
            );
        }

        // Compare passwords
        const isPasswordCorrect = await bcryptjs.compare(password, user.password);

        if (!isPasswordCorrect) {
            return NextResponse.json(
                { detail: 'Invalid email or password' },
                { status: 401 }
            );
        }

        // Create JWT token
        const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
        const token = jwt.sign(
            { id: user._id, email: user.email },
            jwtSecret,
            { expiresIn: '7d' }
        );

        return NextResponse.json({
            access_token: token,
            token_type: 'bearer',
            user: {
                _id: user._id,
                full_name: user.full_name,
                email: user.email,
            }
        }, { status: 200 });

    } catch (error: any) {
        console.error("Login Error:", error);

        return NextResponse.json(
            { detail: error?.message || 'Server Error' },
            { status: 500 }
        );
    }
}
