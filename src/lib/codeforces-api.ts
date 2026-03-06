import axios from "axios";
import {
  CodeForcesUser,
  CodeForcesSubmission,
  CodeForcesProblem,
} from "@/types";

const CF_API_BASE = "https://codeforces.com/api";

// Fetch user info from CodeForces
export async function fetchCodeForcesUser(
  handle: string
): Promise<CodeForcesUser> {
  try {
    const response = await axios.get(`${CF_API_BASE}/user.info?handles=${handle}`);

    if (!response.data.result || response.data.result.length === 0) {
      throw new Error("User not found");
    }

    return response.data.result[0];
  } catch (error) {
    throw new Error(`Failed to fetch CodeForces user: ${error}`);
  }
}

// Fetch user submissions from CodeForces
export async function fetchUserSubmissions(
  handle: string
): Promise<CodeForcesSubmission[]> {
  try {
    const response = await axios.get(
      `${CF_API_BASE}/user.status?handle=${handle}&from=1&count=10000`
    );

    return response.data.result || [];
  } catch (error) {
    throw new Error(`Failed to fetch submissions: ${error}`);
  }
}

// Fetch all problems from CodeForces
export async function fetchAllProblems(): Promise<CodeForcesProblem[]> {
  try {
    const response = await axios.get(`${CF_API_BASE}/problemset.problems`);

    return response.data.result.problems || [];
  } catch (error) {
    throw new Error(`Failed to fetch problems: ${error}`);
  }
}

// Get solved problem IDs from submissions
export function getSolvedProblems(submissions: CodeForcesSubmission[]): string[] {
  const solvedSet = new Set<string>();

  submissions.forEach((submission) => {
    if (submission.verdict === "OK") {
      const problemId = `${submission.problem.contestId}${submission.problem.index}`;
      solvedSet.add(problemId);
    }
  });

  return Array.from(solvedSet);
}

// Filter problems by rating range
export function filterProblemsByRating(
  problems: CodeForcesProblem[],
  minRating: number,
  maxRating: number
): CodeForcesProblem[] {
  return problems.filter(
    (p) => p.rating && p.rating >= minRating && p.rating <= maxRating
  );
}

// Filter problems by tags
export function filterProblemsByTags(
  problems: CodeForcesProblem[],
  tags: string[]
): CodeForcesProblem[] {
  return problems.filter((p) =>
    tags.some((tag) => p.tags.includes(tag))
  );
}

// Get problems with specific difficulty (based on rating)
export function getProblemsByDifficulty(
  problems: CodeForcesProblem[],
  difficulty: "easy" | "medium" | "hard"
): CodeForcesProblem[] {
  let minRating = 0;
  let maxRating = 5000;

  if (difficulty === "easy") {
    minRating = 800;
    maxRating = 1400;
  } else if (difficulty === "medium") {
    minRating = 1400;
    maxRating = 2000;
  } else if (difficulty === "hard") {
    minRating = 2000;
    maxRating = 5000;
  }

  return filterProblemsByRating(problems, minRating, maxRating);
}
