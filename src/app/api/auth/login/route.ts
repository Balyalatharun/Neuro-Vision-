import { NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebaseAdmin';

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json(
                { detail: 'Please add all fields' },
                { status: 400 }
            );
        }

        if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
            return NextResponse.json(
                { detail: 'Firebase API key not configured' },
                { status: 500 }
            );
        }

        // Use Firebase REST API for authentication (since we need the password verification)
        const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
        const response = await fetch(
            `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                    returnSecureToken: true,
                }),
            }
        );

        if (!response.ok) {
            const error = await response.json();
            console.error("Firebase Auth Error:", error);
            return NextResponse.json(
                { detail: 'Invalid email or password' },
                { status: 400 }
            );
        }

        const data = await response.json();
        const { localId, idToken, email: userEmail } = data;

        // Get user data from Firestore
        const adminDb = getAdminDb();
        const usersRef = adminDb.collection('users');
        const userDoc = await usersRef.doc(localId).get();

        let userData: any = {
            uid: localId,
            email: userEmail,
        };

        if (userDoc.exists) {
            const docData = userDoc.data();
            userData = {
                ...userData,
                full_name: docData?.full_name,
            };
        }

        return NextResponse.json({
            access_token: idToken,
            token_type: 'bearer',
            user: userData,
        });

    } catch (error: any) {
        console.error("Login Error:", error);

        return NextResponse.json(
            { detail: error?.message || 'Server Error' },
            { status: 500 }
        );
    }
}
