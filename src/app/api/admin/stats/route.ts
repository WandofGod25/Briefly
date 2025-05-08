import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

// This route is protected by middleware
// Only authenticated users with admin role can access it
export async function GET(request: NextRequest) {
  const { userId } = await auth();
  
  // Double-check authentication (middleware should already handle this)
  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }
  
  // Return mock admin stats
  return NextResponse.json({
    totalUsers: 1254,
    activeUsers: 856,
    weeklyReportsGenerated: 325,
    tasksCreated: 1893,
    averageCompletionRate: 78.6,
    timestamp: new Date().toISOString()
  });
} 