// CodeForces User Info
export interface CodeForcesUser {
  handle: string;
  rating: number;
  maxRating: number;
  maxRank: string;
  lastOnlineTimeSeconds?: number;
  registrationTimeSeconds?: number;
}

// CodeForces Submission
export interface CodeForcesSubmission {
  id: number;
  contestId: number;
  creationTimeSeconds: number;
  relativeTimeSeconds: number;
  problem: CodeForcesProblem;
  author: {
    contestId: number;
    members: { handle: string }[];
    participantType: string;
    ghost: boolean;
    startTimeSeconds: number;
  };
  programmingLanguage: string;
  verdict: "OK" | "WRONG_ANSWER" | "TIME_LIMIT_EXCEEDED" | "RUNTIME_ERROR" | string;
  testset: string;
  passedTestCount: number;
  timeConsumedMillis: number;
  memoryConsumedBytes: number;
}

// CodeForces Problem
export interface CodeForcesProblem {
  contestId: number;
  problemsetName?: string;
  index: string;
  name: string;
  type: string;
  points?: number;
  rating?: number;
  tags: string[];
}

// Weakness Area Category
export interface WeakArea {
  category: string;
  weaknessScore: number; // 0-1, higher = weaker
  solvedCount: number;
  failedCount: number;
}

// Recommended Problem
export interface RecommendedProblem extends CodeForcesProblem {
  difficulty: "easy" | "medium" | "hard";
  reason: string;
  estimatedDifficultyRating: number;
  previousAccuracy?: number;
}
