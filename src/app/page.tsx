"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [handle, setHandle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `https://codeforces.com/api/user.info?handles=${handle}`
      );
      const data = await response.json();

      if (!data.result || data.result.length === 0) {
        setError("CodeForces handle not found");
        setLoading(false);
        return;
      }

      router.push(`/dashboard?handle=${handle}`);
    } catch (err) {
      setError("Failed to fetch user data. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
      </div>

      <div className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 py-12 sm:py-20">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-12 sm:mb-16">
            <h1 className="text-5xl sm:text-7xl font-black text-white mb-4 sm:mb-6 tracking-tight leading-tight">
              Problem Pro
            </h1>
          </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <input
                  id="handle"
                  type="text"
                  placeholder="Enter your handle"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  className="w-full px-5 py-6 bg-slate-700/50 border-2 border-slate-600/50 text-white placeholder-slate-400 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all font-semibold text-lg"
                  disabled={loading}
                />
<br></br>
<br></br>
                {error && (
                  <div className="p-4 bg-red-500/20 border-2 border-red-500/50 rounded-xl">
                    <p className="text-sm text-red-200 font-semibold">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!handle || loading}
                  className="w-full bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-700 hover:via-blue-600 hover:to-cyan-600 disabled:from-slate-600 disabled:via-slate-600 disabled:to-slate-600 disabled:cursor-not-allowed text-white font-black py-5 rounded-xl transition-all shadow-2xl hover:shadow-blue-500/50 disabled:shadow-none text-lg uppercase tracking-widest"
                >
                  {loading ? "Loading..." : "Start Learning Now"}
                </button>
              </form>
          
        </div>
      </div>
    </div>
  );
}
