import {
  fetchCodeForcesUser,
  fetchUserSubmissions,
  fetchAllProblems,
  getSolvedProblems,
} from "@/lib/codeforces-api";
import {
  analyzeWeakAreas,
  generateRecommendation,
  getStatsSummary,
} from "@/lib/recommendations";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const handle = request.nextUrl.searchParams.get("handle");
    const previousProblemRatingStr = request.nextUrl.searchParams.get("previousProblemRating");
    const solvedStr = request.nextUrl.searchParams.get("solved");

    if (!handle) {
      return NextResponse.json(
        { error: "Handle parameter is required" },
        { status: 400 }
      );
    }

    // Parse optional parameters
    const previousProblemRating = previousProblemRatingStr ? parseInt(previousProblemRatingStr) : undefined;
    const solved = solvedStr === "true" ? true : solvedStr === "false" ? false : undefined;

    console.log(`API recommendations called with: previousProblemRating=${previousProblemRating}, solved=${solved}, solvedStr=${solvedStr}`);

    // Fetch user data
    const user = await fetchCodeForcesUser(handle);

    // Fetch submissions
    const submissions = await fetchUserSubmissions(handle);

    // Fetch all problems
    const allProblems = await fetchAllProblems();

    // Get solved problems
    const solvedProblems = getSolvedProblems(submissions);

    // Analyze weak areas
    const weakAreas = analyzeWeakAreas(submissions, allProblems);

    // generate recommendation with previous feedback
    const recommendedProblem = generateRecommendation(
      user.rating || 1200,
      weakAreas,
      solvedProblems,
      allProblems,
      previousProblemRating,
      solved
    );

    if (!recommendedProblem) {
      return NextResponse.json(
        { error: "Could not generate recommendation" },
        { status: 500 }
      );
    }

    // Create user profile
    const profile = {
      id: handle,
      codeforcesHandle: handle,
      rating: user.rating || 1200,
      maxRating: user.maxRating || 1200,
      solvedProblems,
      weakAreas: weakAreas.slice(0, 10),
      createdAt: Date.now(),
      lastUpdated: Date.now(),
    };

    const response = NextResponse.json({
      profile,
      problem: recommendedProblem,
      stats: getStatsSummary(user.rating || 1200, solvedProblems.length, weakAreas),
    });

    // Add caching headers for faster response
    response.headers.set('Cache-Control', 'public, max-age=60, s-maxage=60');
    response.headers.set('Content-Type', 'application/json');

    return response;
  } catch (error) {
    console.error("Recommendation error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to generate recommendation",
      },
      { status: 500 }
    );
  }
}
