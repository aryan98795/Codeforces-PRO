# CodeForces Problem Recommender System - Architecture

## System Overview

A Next.js-based web application that analyzes CodeForces profiles and recommends problems based on user skill level and weak areas.

## Tech Stack
- **Frontend**: React 19 + Next.js 16 (App Router)
- **Backend**: Next.js API Routes
- **Styling**: Tailwind CSS
- **External API**: CodeForces Public API (read-only, no auth needed)
- **Deployment**: Vercel (free)

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Home page
│   ├── dashboard/
│   │   └── page.tsx            # Main dashboard with problem display
│   └── api/
│       ├── codeforces/
│       │   ├── user-info.ts    # Fetch CodeForces user data
│       │   ├── user-status.ts  # Fetch submission history
│       │   └── problems.ts     # Get all problems from CodeForces
│       ├── recommendations/
│       │   └── route.ts        # Generate problem recommendations
│       └── progress/
│           └── route.ts        # Track user progress
├── components/
│   ├── ProfileInput.tsx        # Input CodeForces username
│   ├── ProblemCard.tsx         # Display problem details
│   ├── ProgressTracker.tsx     # Show user stats
│   └── RecommendationEngine.tsx # Display recommendations
├── lib/
│   ├── codeforces-api.ts       # CodeForces API client
│   └── recommendations.ts      # Algorithm for recommendations
├── types/
│   └── index.ts                # TypeScript interfaces
└── styles/
    └── globals.css             # Global styles
```

## Core Features

### 1. CodeForces Profile Analysis
- Fetch user rating and submission history
- Identify weak topics/problem types
- Analyze solving patterns

### 2. Problem Recommendation Engine
**Algorithm:**
- Start with medium-difficulty problems
- If solved: recommend harder problem in same category
- If not attempted: retry or recommend easier related problem
- Track performance per topic area



## Data Flow

1. **User Inputs CodeForces Handle** → Home Page
2. **Fetch Profile Data** → API Route (`/api/codeforces/user-info`)
3. **Analyze Submissions** → API Route (`/api/codeforces/user-status`)
4. **Generate Recommendations** → API Route (`/api/recommendations`)
5. **Display Problem** → Dashboard
6. **Track Progress** → In-memory storage

## Deployment

- **Frontend & Backend**: Deploy to Vercel (Next.js native, free tier supports unlimited traffic)
- **API Routes**: Included with Next.js deployment on Vercel
- **Data Storage**: In-memory tracking (no persistence across server restarts)
- **API Integration**: CodeForces has no rate limit restrictions for public data

## Next Steps

1. ✅ Set up Next.js project
2. ✅ Install dependencies (axios)
4. Create CodeForces API client
5. Create recommendation engine logic
6. Build components (UI)
7. Create API routes
8. Test with sample data
9. Deploy to Vercel
