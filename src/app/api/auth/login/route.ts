import { NextResponse } from 'next/server';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebaseServer';

export async function POST(req: Request) {
    try {
        // Validate Firebase is initialized
        if (!db) {
            return NextResponse.json(
                { detail: 'Firebase not properly configured. Check environment variables.' },
                { status: 500 }
            );
        }

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

        // Use Firebase REST API for authentication
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
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('uid', '==', localId));
        const querySnapshot = await getDocs(q);

        let userData: any = {
            uid: localId,
            email: userEmail,
        };

        if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0];
            userData = {
                ...userData,
                full_name: userDoc.data().full_name,
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
