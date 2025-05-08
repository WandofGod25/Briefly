"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export default function AuthStatus() {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const { user } = useUser();
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRoleFromToken() {
      if (!isLoaded || !isSignedIn) return;
      
      try {
        const token = await getToken({ template: "session-data" });
        if (token) {
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
        }
      } catch (error) {
        console.error("Error fetching token claims:", error);
      }
    }
    
    fetchRoleFromToken();
  }, [isLoaded, isSignedIn, getToken]);

  if (!isLoaded) {
    return <div className="p-4 bg-gray-100 rounded">Loading auth state...</div>;
  }

  if (!isSignedIn) {
    return (
      <div className="p-4 bg-red-50 text-red-800 rounded">
        Not signed in
      </div>
    );
  }

  return (
    <div className="p-4 bg-green-50 text-green-800 rounded">
      <div className="font-medium">Signed in as {user?.primaryEmailAddress?.emailAddress}</div>
      <div className="text-sm mt-1">
        Role: <span className="font-semibold">{userRole || "user"}</span>
      </div>
      <div className="text-sm mt-1">
        User ID: <span className="font-mono text-xs">{user?.id}</span>
      </div>
    </div>
  );
} 