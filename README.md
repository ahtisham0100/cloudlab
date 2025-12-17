# Resume Builder Web App

A full-stack serverless resume builder built with Next.js 15, MongoDB, and Tailwind CSS. Create, edit, and export professional resumes with AI-powered suggestions.

## Features

- **Authentication** - Secure signup/login with bcrypt password hashing
- **Resume Editor** - Multi-section editor with live preview
- **Multiple Templates** - Minimal, Modern, and Professional designs
- **AI Suggestions** - Rule-based AI for summaries, skills, and ATS scoring
- **Export Options** - Download as HTML (print to PDF) or JSON
- **Serverless Architecture** - MongoDB backend with Next.js API routes

## Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account (free tier works perfectly)

## Setup Instructions

### 1. Clone and Install

```bash
npm install
```

### 2. Set Up MongoDB

1. Go to [MongoDB Atlas](https://cloud.mongodb.com) and create a free account
2. Create a new cluster (free M0 tier)
3. Create a database user with read/write permissions
4. Get your connection string from "Connect" → "Connect your application"
5. Replace `<password>` with your database user password

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/resume_builder
```

**Important**: Replace with your actual MongoDB connection string from step 2.

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Sign Up** - Create an account with email and password
2. **Create Resume** - Click "New Resume" to start
3. **Edit Sections** - Add personal info, education, experience, skills, and projects
4. **Switch Templates** - Choose from 3 professional designs
5. **Get AI Help** - Generate summaries, skill suggestions, and ATS scores
6. **Export** - Download as HTML (can be printed to PDF) or JSON

## Database Collections

The app automatically creates these MongoDB collections:

- `users` - User accounts with hashed passwords
- `resumes` - Resume data with all sections

## Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS v4, shadcn/ui
- **Backend**: Next.js API Routes (serverless functions)
- **Database**: MongoDB with native Node.js driver
- **Authentication**: Cookie-based sessions with bcrypt
- **AI**: Rule-based suggestion engine (no external API required)

## Project Structure

```
├── app/
│   ├── (dashboard)/        # Protected dashboard routes
│   ├── api/                # Serverless API routes
│   ├── auth/               # Authentication pages
│   └── resume/[id]/        # Resume editor
├── components/
│   ├── templates/          # Resume templates
│   └── ui/                 # shadcn/ui components
└── lib/
    ├── mongodb.ts          # Database connection
    └── auth.ts             # Authentication utilities
```

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project to [Vercel](https://vercel.com)
3. Add `MONGODB_URI` environment variable in Vercel project settings
4. Deploy!

The app is serverless-ready and scales automatically.

## Troubleshooting

**Can't connect to MongoDB?**
- Verify your connection string is correct
- Check MongoDB Atlas IP whitelist (allow 0.0.0.0/0 for development)
- Ensure database user has proper permissions

**Resume not saving?**
- Check browser console for errors
- Verify MongoDB connection in terminal
- Make sure `.env.local` file exists

## License

MIT
# cloudlab
