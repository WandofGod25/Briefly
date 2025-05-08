"use client";

import { useAuth } from "@clerk/nextjs";
import { useState, useEffect } from "react";

export default function UserRoleDisplay() {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchUserRole() {
      if (!isLoaded || !isSignedIn) {
        setIsLoading(false);
        return;
      }
      
      try {
        // Get the token with claims
        const token = await getToken({ template: "session-data" });
        
        // Extract role from token claims if available
        if (token) {
          // Parse the JWT to get the claims
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(
            atob(base64)
              .split('')
              .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
              .join('')
          );
          
          const claims = JSON.parse(jsonPayload);
          setUserRole(claims.role || "user");
        } else {
          setUserRole("user");
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
        setUserRole("user");
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchUserRole();
  }, [isLoaded, isSignedIn, getToken]);
  
  if (!isLoaded || isLoading) {
    return <div className="animate-pulse h-6 w-16 bg-gray-200 rounded"></div>;
  }
  
  if (!isSignedIn) {
    return null;
  }
  
  return (
    <div className="flex items-center">
      <span className="text-sm font-medium text-gray-600 mr-2">Role:</span>
      <span className={`text-sm font-semibold px-2 py-1 rounded ${
        userRole === "admin" 
          ? "bg-purple-100 text-purple-800" 
          : "bg-blue-100 text-blue-800"
      }`}>
        {userRole}
      </span>
    </div>
  );
} 