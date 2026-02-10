import { NextResponse } from 'next/server';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';

// Initialize Firebase (using config from env)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json(
                { detail: 'Please add all fields' },
                { status: 400 }
            );
        }

        // Use Firebase REST API for authentication
        const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
        const response = await fetch(
            `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
            {
                method: 'POST',
                body: JSON.stringify({
                    email,
                    password,
                    returnSecureToken: true,
                }),
            }
        );

        if (!response.ok) {
            const error = await response.json();
            return NextResponse.json(
                { detail: 'Invalid credentials' },
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
