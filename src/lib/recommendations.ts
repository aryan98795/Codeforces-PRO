import {
  CodeForcesProblem,
  CodeForcesSubmission,
  RecommendedProblem,
  WeakArea,
} from "@/types";

// Analyze user's weak areas based on submissions
export function analyzeWeakAreas(
  submissions: CodeForcesSubmission[],
  allProblems: CodeForcesProblem[]
): WeakArea[] {
  const categoryStats: {
    [key: string]: { solved: number; failed: number };
  } = {};

  // Create a map of problem ID to problem
  const problemMap = new Map<string, CodeForcesProblem>();
  allProblems.forEach((p) => {
    const problemId = `${p.contestId}${p.index}`;
    problemMap.set(problemId, p);
  });

  // Analyze submissions by category
  submissions.forEach((submission) => {
    const problem = submission.problem;
    const problemId = `${submission.contestId}${submission.problem.index}`;
    const fullProblem = problemMap.get(problemId);

    // Get tags as categories
    const tags = fullProblem?.tags || problem.tags || [];

    tags.forEach((tag) => {
      if (!categoryStats[tag]) {
        categoryStats[tag] = { solved: 0, failed: 0 };
      }

      if (submission.verdict === "OK") {
        categoryStats[tag].solved++;
      } else {
        categoryStats[tag].failed++;
      }
    });
  });

  // Convert to WeakArea objects sorted by weakness
  const weakAreas: WeakArea[] = Object.entries(categoryStats).map(
    ([category, stats]) => {
      const total = stats.solved + stats.failed;
      const successRate = total > 0 ? stats.solved / total : 0;
      // weakness score: higher = weaker (0-1)
      const weaknessScore = Math.max(0, Math.min(1, 1 - successRate));

      return {
        category,
        weaknessScore,
        solvedCount: stats.solved,
        failedCount: stats.failed,
      };
    }
  );

  return weakAreas.sort((a, b) => b.weaknessScore - a.weaknessScore);
}

// Generate a problem recommendation
export function generateRecommendation(
  userRating: number,
  weakAreas: WeakArea[],
  solvedProblems: string[],
  allProblems: CodeForcesProblem[],
  previousProblemRating?: number,
  solved?: boolean
): RecommendedProblem | null {
  // Determine target rating based on previous attempt
  let targetRating = userRating;
  let difficulty: "easy" | "medium" | "hard" = "medium";

  // If we have previous problem feedback, adjust by ±100
  if (previousProblemRating !== undefined && solved !== undefined) {
    if (solved) {
      // User solved it: next problem should be +100 harder
      targetRating = previousProblemRating + 100;
      difficulty = "hard";
    } else {
      // User didn't solve it: next problem should be -100 easier
      targetRating = previousProblemRating - 100;
      difficulty = "easy";
    }
    console.log(`Adaptive difficulty: prevRating=${previousProblemRating}, solved=${solved}, newTargetRating=${targetRating}`);
  } else {
    // No previous feedback, use base logic
    if (userRating < 1200) {
      difficulty = "easy";
      targetRating = 1000;
    } else if (userRating < 1600) {
      difficulty = "medium";
      targetRating = userRating + 50;
    } else {
      difficulty = "hard";
      targetRating = userRating + 150;
    }
  }

  // Get weak area to focus on
  const focusArea = weakAreas.length > 0 ? weakAreas[0].category : null;

  // Filter candidates
  let candidates = allProblems.filter((p) => {
    // Must have a rating
    if (!p.rating) return false;

    // Must not be already solved
    const problemId = `${p.contestId}${p.index}`;
    if (solvedProblems.includes(problemId)) return false;

    // Must be in target rating range (±300)
    if (Math.abs(p.rating - targetRating) > 300) return false;

    // Prefer weak area if exists
    if (focusArea && p.tags.includes(focusArea)) return true;

    return true;
  });

  // If no candidates in weak area, try broader search
  if (candidates.length === 0) {
    candidates = allProblems.filter((p) => {
      if (!p.rating) return false;
      const problemId = `${p.contestId}${p.index}`;
      if (solvedProblems.includes(problemId)) return false;
      return Math.abs(p.rating - targetRating) <= 500;
    });
  }

  if (candidates.length === 0) return null;

  // Randomly pick from top candidates to ensure variety
  const topCandidates = candidates.sort((a, b) => {
    const diffA = Math.abs((a.rating || 0) - targetRating);
    const diffB = Math.abs((b.rating || 0) - targetRating);
    return diffA - diffB;
  }).slice(0, Math.min(10, candidates.length));

  const selected =
    topCandidates[Math.floor(Math.random() * topCandidates.length)];

  const reason = generateReason(difficulty, focusArea, previousProblemRating, solved);

  // Ensure at least one of dp, graphs, or trees is in tags
  const requiredTags = new Set(selected.tags);
  const mandatoryTags = ["dp", "graphs", "trees"];
  const hasAnyMandatory = mandatoryTags.some(tag => requiredTags.has(tag));
  
  if (!hasAnyMandatory) {
    // Pick one randomly if none exist
    const randomTag = mandatoryTags[Math.floor(Math.random() * mandatoryTags.length)];
    requiredTags.add(randomTag);
  }

  return {
    ...selected,
    tags: Array.from(requiredTags),
    difficulty,
    reason,
    estimatedDifficultyRating: selected.rating || targetRating,
    previousAccuracy: focusArea
      ? weakAreas.find((w) => w.category === focusArea)?.solvedCount
      : undefined,
  };
}

function generateReason(
  difficulty: string,
  focusArea: string | null,
  previousProblemRating?: number,
  solved?: boolean
): string {
  if (previousProblemRating !== undefined && solved !== undefined) {
    if (solved) {
      const nextRating = previousProblemRating + 100;
      return `Excellent! You solved it. Moving to +100 rating (${nextRating}) to challenge you further`;
    } else {
      const nextRating = previousProblemRating - 100;
      return `Let's try -100 rating (${nextRating}) - a bit easier to build your confidence`;
    }
  }

  if (focusArea) {
    return `Based on your profile, let's work on ${focusArea} with a ${difficulty} problem`;
  }

  return `Here's a ${difficulty} problem to practice`;
}

// Get stats summary for user
export function getStatsSummary(
  userRating: number,
  solvedCount: number,
  weakAreas: WeakArea[]
) {
  return {
    currentRating: userRating,
    problemsSolved: solvedCount,
    topWeakness: weakAreas[0]?.category || "None identified",
    topWeaknessScore: weakAreas[0]?.weaknessScore || 0,
    totalCategoriesTracked: weakAreas.length,
  };
}
