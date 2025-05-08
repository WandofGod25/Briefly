import { auth, currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

// This is a development utility route to set the current user as an admin
// In production, you would use Clerk Dashboard or a proper admin panel
export async function POST(request: NextRequest) {
  // Only allow this in development environment
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json(
      { error: "This endpoint is only available in development" },
      { status: 403 }
    );
  }

  const { userId } = await auth();
  
  // Check if user is authenticated
  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }
  
  try {
    // Get the current Clerk secret key from environment variables
    const clerkSecretKey = process.env.CLERK_SECRET_KEY;
    
    if (!clerkSecretKey) {
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }
    
    // Make a direct API call to Clerk to update the user's metadata
    const response = await fetch(`https://api.clerk.com/v1/users/${userId}/metadata`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${clerkSecretKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "private_metadata": {
          "role": "admin"
        }
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update user role");
    }
    
    return NextResponse.json({ 
      success: true, 
      message: "User role set to admin. Please sign out and sign in again for changes to take effect." 
    });
  } catch (error) {
    console.error("Error setting admin role:", error);
    return NextResponse.json(
      { error: "Failed to update user role" },
      { status: 500 }
    );
  }
} 