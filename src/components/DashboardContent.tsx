"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import type { RecommendedProblem } from "@/types";

export default function DashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const handle = searchParams.get("handle");

  const [recommendedProblem, setRecommendedProblem] = useState<RecommendedProblem | null>(null);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<"solved" | "attempted" | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchRecommendation = useCallback(async (prevRating?: number, solved?: boolean) => {
    try {
      setLoading(true);
      let url = `/api/recommendations?handle=${handle}`;
      if (prevRating !== undefined && solved !== undefined) {
        url += `&previousProblemRating=${prevRating}&solved=${solved}`;
      }
      console.log(`Fetching recommendation with URL: ${url}`);
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      console.log(`Received recommendation:`, data.problem.rating, data.problem.name);
      setRecommendedProblem(data.problem);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [handle]);

  useEffect(() => {
    if (!handle) { router.push("/"); return; }
    fetchRecommendation();
  }, [handle, router, fetchRecommendation]);

  const handleAction = async (status: "solved" | "attempted") => {
    if (!recommendedProblem || submitting) return;
    setSubmitting(true);
    const isSolved = status === "solved";
    console.log(`Action: ${status}, isSolved: ${isSolved}, currentRating: ${recommendedProblem.rating}`);
    try {
      await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          handle, 
          problemId: `${recommendedProblem.contestId}${recommendedProblem.index}`, 
          status 
        })
      });
      setFeedback(status);
      setTimeout(() => {
        setFeedback(null);
        // Fetch next recommendation with previous problem rating and solved status
        console.log(`Fetching with rating: ${recommendedProblem.rating}, solved: ${isSolved}`);
        fetchRecommendation(recommendedProblem.rating, isSolved);
      }, 1500);
    } catch (err) {
      console.error("Action error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex items-center justify-center text-white font-black text-2xl animate-pulse">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-lg blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-purple-600/20 rounded-lg blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
      </div>
      <div className="relative">LOADING...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 font-sans flex flex-col items-center justify-center p-60 text-white overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-lg blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-purple-600/20 rounded-lg blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
      </div>
      
      <div className="relative w-full max-w-4xl">
        <h1 className="text-white text-[10px] font-black uppercase tracking-[0.4em] text-center mb-6 opacity-70">
          Your Daily Target
        </h1>
        
        <br></br>

        {recommendedProblem && (
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-lg shadow-2xl overflow-hidden border border-slate-700/50 hover:border-blue-500/50 transition-all">
            <div className="p-8 sm:p-12 flex flex-col">
              
              {/* Header Info */}
              <div className="flex justify-between items-center mb-8 gap-6">
                
                <span className="text-white text-[10px] font-black uppercase tracking-[0.2em] bg-slate-700/50 border border-slate-600/50 px-4 py-2 rounded">
                  Rating: {recommendedProblem.rating}
                </span>
              </div>
            <br></br>

              {/* Title */}
              <h2 className="text-2xl sm:text-5xl font-black text-white leading-tight mb-8 tracking-tighter">
                {recommendedProblem.name}
              </h2>
              

              {/* Tags */}
              <div className="flex flex-wrap gap-5 p-5 mb-12">
                {recommendedProblem.tags.map(tag => (
                  <span key={tag} className="text-[9px] p-3  font-black text-slate-300 bg-slate-700/50 border border-slate-600/50 px-3 py-1.5 rounded-lg uppercase hover:bg-slate-600/50 transition-all">
                #{tag}
                  </span>
                ))}
              </div>
                
              



              {/* Primary Action */}
              <div className="flex flex-col gap-4">
                <a 
                  href={`https://codeforces.com/problemset/problem/${recommendedProblem.contestId}/${recommendedProblem.index}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full text-center bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-700 hover:via-blue-600 hover:to-cyan-600 text-white font-black py-5 rounded-lg shadow-xl hover:shadow-blue-500/50 transition-all active:scale-[0.98] text-xl uppercase tracking-widest"
                >
                  Solve on Codeforces
                </a>
                
                {/* Secondary Actions */}
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    disabled={submitting}
                    onClick={() => handleAction("solved")} 
                    className="py-4 rounded-lg font-black text-[11px] uppercase tracking-widest bg-emerald-500/20 text-emerald-300 border-2 border-emerald-500/50 hover:bg-emerald-500/40 hover:text-emerald-100 transition-all disabled:opacity-50"
                  >
                    {feedback === "solved" ? "Accepted!" : "Mark Solved"}
                  </button>
                  <button 
                    disabled={submitting}
                    onClick={() => handleAction("attempted")} 
                    className="py-4 rounded-lg font-black text-[11px] uppercase tracking-widest bg-slate-700/50 text-slate-300 border-2 border-slate-600/50 hover:bg-slate-600/50 hover:text-slate-100 transition-all disabled:opacity-50"
                  >
                    {feedback === "attempted" ? "Skipping..." : "New Problem"}
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>

    </div>
  );
}