import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { redirect } from "next/navigation";

export type UserRole = "admin" | "user";

/**
 * Check if the current user has a specific role
 * To be used in server components or server actions
 */
export async function hasRole(role: UserRole): Promise<boolean> {
  const { sessionClaims } = await auth();
  const userRole = sessionClaims?.role as string;
  
  return userRole === role;
}

/**
 * Check if the current user has admin role
 * To be used in server components or server actions
 */
export async function isAdmin(): Promise<boolean> {
  return hasRole("admin");
}

/**
 * Protect a route server-side based on user role
 * Redirects to dashboard if the user doesn't have the required role
 * To be used in server components
 */
export async function protectPage(role?: UserRole) {
  const { userId } = await auth();
  
  // Check if user is authenticated
  if (!userId) {
    redirect("/sign-in");
  }
  
  // If a specific role is required, check for it
  if (role && !(await hasRole(role))) {
    // Redirect to dashboard if they don't have the required role
    redirect("/dashboard");
  }
}

/**
 * Get the user's role from Clerk session claims
 * To be used in server components or server actions
 */
export async function getUserRole(): Promise<UserRole> {
  const { sessionClaims } = await auth();
  return (sessionClaims?.role as UserRole) || "user";
}

/**
 * Extract role from request headers 
 * To be used in API routes with the middleware
 */
export function getRoleFromRequest(req: NextRequest): UserRole {
  const role = req.headers.get("x-user-role");
  return (role as UserRole) || "user";
}

/**
 * Check if a user has required permission for an API route
 * To be used in API route handlers
 */
export function checkPermission(
  req: NextRequest, 
  requiredRole: UserRole
): NextResponse | null {
  const userRole = getRoleFromRequest(req);
  
  if (
    (requiredRole === "admin" && userRole !== "admin") ||
    (requiredRole === "user" && !userRole)
  ) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 403 }
    );
  }
  
  return null; // Continue with the request
} 