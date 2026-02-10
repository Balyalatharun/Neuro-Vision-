import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { JWT_SECRET } from '@/lib/auth';

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json(
                { detail: 'Please add all fields' },
                { status: 400 }
            );
        }

        await connectDB();

        // Check for user
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return NextResponse.json(
                { detail: 'Invalid credentials' },
                { status: 400 }
            );
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return NextResponse.json(
                { detail: 'Invalid credentials' },
                { status: 400 }
            );
        }

        // Generate Token
        const token = jwt.sign({ id: user._id }, JWT_SECRET, {
            expiresIn: '30d',
        });

        return NextResponse.json({
            access_token: token,
            token_type: 'bearer',
            user: {
                id: user._id,
                full_name: user.full_name,
                email: user.email,
            },
        });

    } catch (error: any) {
        console.error("Login Error:", error);

        const isDbError = error?.name === 'MongoNetworkError' || error?.code === 'ECONNREFUSED' || error?.message?.includes('connect');
        if (isDbError) {
            return NextResponse.json(
                { detail: 'Database unavailable. Please ensure MongoDB is running (e.g. mongodb://localhost:27017).' },
                { status: 503 }
            );
        }

        return NextResponse.json(
            { detail: error?.message || 'Server Error' },
            { status: 500 }
        );
    }
}
