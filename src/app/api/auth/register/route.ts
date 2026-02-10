import { NextResponse } from 'next/server';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '@/lib/firebaseServer';

export async function POST(req: Request) {
    try {
        const { full_name, email, password } = await req.json();

        if (!full_name || !email || !password) {
            return NextResponse.json(
                { detail: 'Please provide all fields' },
                { status: 400 }
            );
        }

        // Check if user already exists in Firestore
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('email', '==', email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            return NextResponse.json(
                { detail: 'User already exists' },
                { status: 400 }
            );
        }

        // Create user with Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Store user data in Firestore
        const userDocRef = await addDoc(usersRef, {
            uid: user.uid,
            full_name,
            email: user.email,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        return NextResponse.json({
            uid: user.uid,
            full_name,
            email: user.email,
            detail: "User Registered Successfully"
        });

    } catch (error: any) {
        console.error("Register Error:", error);

        // Handle specific Firebase errors
        if (error.code === 'auth/email-already-in-use') {
            return NextResponse.json(
                { detail: 'Email is already in use' },
                { status: 400 }
            );
        }

        if (error.code === 'auth/weak-password') {
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

        return NextResponse.json(
            { detail: error?.message || 'Server Error' },
            { status: 500 }
        );
    }
}
