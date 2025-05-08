"use client";

import { UserButton, useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { useEffect, useState } from "react";
import UserRoleDisplay from "./UserRoleDisplay";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    async function checkAdminRole() {
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
          setIsAdmin(claims.role === "admin");
        }
      } catch (error) {
        console.error("Error checking admin role:", error);
      }
    }
    
    checkAdminRole();
  }, [isLoaded, isSignedIn, getToken]);

  // Helper function to determine if a link is active
  const isActive = (path: string) => {
    if (path === "/dashboard" && pathname === "/dashboard") {
      return true;
    }
    
    if (path !== "/dashboard" && pathname.startsWith(path)) {
      return true;
    }
    
    return false;
  };
  
  // Get the class name for navigation links
  const getLinkClassName = (path: string) => {
    return `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
      isActive(path) 
        ? "border-indigo-500 text-gray-900"
        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
    }`;
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-indigo-600">Briefly</span>
            </Link>
            
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {isLoaded && isSignedIn && (
                <>
                  <Link 
                    href="/dashboard" 
                    className={getLinkClassName("/dashboard")}
                  >
                    Dashboard
                  </Link>
                  
                  <Link
                    href="/profile"
                    className={getLinkClassName("/profile")}
                  >
                    Profile
                  </Link>
                  
                  {isAdmin && (
                    <Link
                      href="/admin"
                      className={getLinkClassName("/admin")}
                    >
                      Admin
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {isLoaded && isSignedIn && <UserRoleDisplay />}
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </div>
    </nav>
  );
} 