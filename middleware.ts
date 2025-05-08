import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define public routes that don't require authentication
const publicRoutes = [
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/public(.*)",
  "/sso-callback(.*)",
  "/custom-sign-in(.*)",
];

// Create a route matcher for public routes
const isPublicRoute = createRouteMatcher(publicRoutes);

// Create a route matcher for admin routes
const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  // If it's a public route, allow access without authentication
  if (isPublicRoute(req)) {
    return;
  }

  // For admin routes, check both authentication and admin role
  if (isAdminRoute(req)) {
    await auth.protect((has) => {
      // Check for admin role using session claims
      return has({ role: "admin" });
    });
    return;
  }

  // For all other routes, require authentication
  await auth.protect();
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}; 