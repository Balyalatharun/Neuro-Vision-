# Neuro-Vision

A mental health and risk assessment application built with Next.js, React, and MongoDB.

## Project Overview

Neuro-Vision is a comprehensive mental health platform that includes:

- **User Authentication**: Secure login and registration
- **Camera Module**: Integration with device camera
- **Chat Interface**: Real-time chat functionality with AI assistance
- **Risk Assessment**: Dashboard with risk analysis and charts
- **Emotion Detection**: AI-powered emotion analysis

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MongoDB URI
- JWT Secret

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

# Edit .env.local and add your configuration
```

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Environment Variables

Create a `.env.local` file with the following variables:

```
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
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
   - `MONGO_URI`
   - `JWT_SECRET`
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

This project uses MongoDB. You can:
- Use MongoDB Atlas (cloud): [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
- Use MongoDB Community (local)

Set the `MONGO_URI` in your environment variables.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [MongoDB Documentation](https://docs.mongodb.com)
- [Vercel Documentation](https://vercel.com/docs)

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is open source.
