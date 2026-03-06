import { NextRequest, NextResponse } from "next/server";

// In-memory storage for tracking user progress
const progressStore: {
  [key: string]: {
    problemId: string;
    solved: boolean;
    timestamp: number;
  }[];
} = {};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { handle, problemId, solved } = body;

    if (!handle || !problemId) {
      return NextResponse.json(
        { error: "handle and problemId are required" },
        { status: 400 }
      );
    }

    // Initialize store for handle if not exists
    if (!progressStore[handle]) {
      progressStore[handle] = [];
    }

    // Add progress record
    progressStore[handle].push({
      problemId,
      solved,
      timestamp: Date.now(),
    });

    return NextResponse.json({
      success: true,
      message: "Progress tracked",
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to track progress",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const handle = request.nextUrl.searchParams.get("handle");

    if (!handle) {
      return NextResponse.json(
        { error: "Handle parameter is required" },
        { status: 400 }
      );
    }

    const userProgress = progressStore[handle] || [];

    return NextResponse.json({
      handle,
      totalAttempts: userProgress.length,
      solvedCount: userProgress.filter((p) => p.solved).length,
      progress: userProgress.slice(-50), // Return last 50 attempts
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to fetch progress",
      },
      { status: 500 }
    );
  }
}
