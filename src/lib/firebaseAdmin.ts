// Server-side Firebase Admin SDK initialization
import * as admin from 'firebase-admin';

let adminApp: admin.app.App | null = null;

function getAdminApp() {
  if (adminApp) {
    return adminApp;
  }

  try {
    // Only initialize if not already done
    if (!admin.apps.length) {
      // Get service account from environment variable
      const serviceAccountJson = process.env.FIREBASE_ADMIN_SDK_KEY;
      
      if (!serviceAccountJson) {
        console.warn('FIREBASE_ADMIN_SDK_KEY environment variable is not set. Admin SDK will not be available.');
        return null;
      }

      const serviceAccount = JSON.parse(serviceAccountJson);

      adminApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      });
    } else {
      adminApp = admin.app();
    }
  } catch (error) {
    console.error('Failed to initialize Firebase Admin SDK:', error);
    return null;
  }

  return adminApp;
}

export function getAdminAuth() {
  const app = getAdminApp();
  if (!app) {
    throw new Error('Firebase Admin SDK not initialized. Check FIREBASE_ADMIN_SDK_KEY environment variable.');
  }
  return admin.auth(app);
}

export function getAdminDb() {
  const app = getAdminApp();
  if (!app) {
    throw new Error('Firebase Admin SDK not initialized. Check FIREBASE_ADMIN_SDK_KEY environment variable.');
  }
  return admin.firestore(app);
}
