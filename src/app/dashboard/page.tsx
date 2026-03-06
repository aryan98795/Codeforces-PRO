"use client";

import { Suspense } from "react";
import DashboardContent from "@/components/DashboardContent";

export default function Dashboard() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin mb-4 inline-block">
              <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full"></div>
            </div>
            <p className="text-white text-xl font-semibold">Loading...</p>
          </div>
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
