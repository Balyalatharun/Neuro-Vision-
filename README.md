# Neuro-Vision

A mental health and risk assessment application built with Next.js, React, and Firebase.

## Project Overview

Neuro-Vision is a comprehensive mental health platform that includes:

- **User Authentication**: Secure login and registration via Firebase Auth
- **Camera Module**: Integration with device camera
- **Chat Interface**: Real-time chat functionality with AI assistance
- **Risk Assessment**: Dashboard with risk analysis and charts
- **Emotion Detection**: AI-powered emotion analysis
- **Cloud Storage**: Firestore database for user data

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Firebase Project (get from [firebase.google.com](https://firebase.google.com))

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Balyalatharun/Neuro-Vision-.git
cd Neuro-Vision-
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Copy the example environment file
cp .env.example .env.local

# Edit .env.local and add your Firebase configuration
```

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Environment Variables

Create a `.env.local` file with the following Firebase variables:

```
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
NODE_ENV=development
```

See `.env.example` for all available options.

## Project Structure

```
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── api/               # API routes
│   │   ├── auth/              # Authentication pages
│   │   └── dashboard/         # Dashboard pages
│   ├── components/            # React components
│   ├── lib/                   # Utility functions and libraries
│   └── models/                # Database models
├── backend/                   # Python FastAPI backend (optional)
├── public/                    # Static assets
└── vercel.json               # Vercel deployment configuration
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Deploy on Vercel

### Quick Deploy

The easiest way to deploy is using the [Vercel Platform](https://vercel.com):

1. Push your code to GitHub
2. Go to [https://vercel.com/new](https://vercel.com/new)
3. Import your GitHub repository
4. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
   - `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`
   - `NEXT_PUBLIC_GEMINI_API_KEY`
   - `NEXT_PUBLIC_API_URL`
5. Click Deploy

### Environment Variables on Vercel

In your Vercel project settings:
1. Go to Settings → Environment Variables
2. Add all required variables from `.env.example`
3. Redeploy the project

### Manual Deployment Steps

If deploying manually:
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

## Database

This project uses Firebase services:

- **Authentication**: Firebase Authentication (email/password)
- **Database**: Cloud Firestore (NoSQL document database)
- **Storage**: Cloud Storage (for files and images)

### Setup Firebase:
1. Create a Firebase project at [firebase.google.com](https://firebase.google.com)
2. Enable Authentication (Email/Password method)
3. Create a Firestore database
4. Copy your Firebase config and add to `.env.local`

Set all `NEXT_PUBLIC_FIREBASE_*` variables in your environment.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [MongoDB Documentation](https://docs.mongodb.com)
- [Vercel Documentation](https://vercel.com/docs)

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is open source.
