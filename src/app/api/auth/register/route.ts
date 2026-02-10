import { NextResponse } from 'next/server';
import * as admin from 'firebase-admin';
import { getAdminAuth, getAdminDb } from '@/lib/firebaseAdmin';

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

        const adminAuth = getAdminAuth();
        const adminDb = getAdminDb();

        // Check if user already exists in Firestore
        const usersRef = adminDb.collection('users');
        const existingUser = await usersRef.where('email', '==', email).get();

        if (!existingUser.empty) {
            return NextResponse.json(
                { detail: 'User already exists' },
                { status: 400 }
            );
        }

        // Create user with Firebase Authentication using Admin SDK
        const userRecord = await adminAuth.createUser({
            email: email,
            password: password,
            displayName: full_name,
        });

        // Store user data in Firestore
        await usersRef.doc(userRecord.uid).set({
            uid: userRecord.uid,
            full_name,
            email: userRecord.email,
            createdAt: admin.firestore.Timestamp.now(),
            updatedAt: admin.firestore.Timestamp.now(),
        });

        return NextResponse.json({
            uid: userRecord.uid,
            full_name,
            email: userRecord.email,
            detail: "User Registered Successfully"
        }, { status: 201 });

    } catch (error: any) {
        console.error("Register Error:", error);

        // Handle specific Firebase Admin errors
        if (error.code === 'auth/email-already-exists') {
            return NextResponse.json(
                { detail: 'Email is already in use' },
                { status: 400 }
            );
        }

        if (error.code === 'auth/invalid-password') {
            return NextResponse.json(
                { detail: 'Password should be at least 6 characters' },
                { status: 400 }
            );
        }

        if (error.code === 'auth/invalid-email') {
            return NextResponse.json(
                { detail: 'Invalid email address' },
                { status: 400 }
            );
        }

        if (error.message?.includes('FIREBASE_ADMIN_SDK_KEY')) {
            return NextResponse.json(
                { detail: 'Server configuration error. Admin SDK not properly configured.' },
                { status: 500 }
            );
        }

        console.error("Full error:", {
            code: error.code,
            message: error.message,
            stack: error.stack
        });

        return NextResponse.json(
            { detail: error?.message || 'Server Error' },
            { status: 500 }
        );
    }
}
