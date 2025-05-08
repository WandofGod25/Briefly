"use client";

import { UserButton, useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { useEffect, useState } from "react";
import UserRoleDisplay from "./UserRoleDisplay";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
    return `relative inline-flex items-center px-4 py-2 text-sm font-medium ${
      isActive(path) 
        ? "text-indigo-600"
        : "text-gray-600 hover:text-indigo-500"
    } transition-colors duration-200 ease-in-out`;
  };

  // Get the active indicator class
  const getActiveBorderClass = (path: string) => {
    return isActive(path) 
      ? "absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500" 
      : "";
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">Briefly</span>
            </Link>
            
            <div className="hidden sm:ml-8 sm:flex sm:space-x-2">
              {isLoaded && isSignedIn && (
                <>
                  <Link 
                    href="/dashboard" 
                    className={getLinkClassName("/dashboard")}
                  >
                    Dashboard
                    <span className={getActiveBorderClass("/dashboard")}></span>
                  </Link>
                  
                  <Link
                    href="/input"
                    className={getLinkClassName("/input")}
                  >
                    Input
                    <span className={getActiveBorderClass("/input")}></span>
                  </Link>
                  
                  <Link
                    href="/profile"
                    className={getLinkClassName("/profile")}
                  >
                    Profile
                    <span className={getActiveBorderClass("/profile")}></span>
                  </Link>
                  
                  {isAdmin && (
                    <Link
                      href="/admin"
                      className={getLinkClassName("/admin")}
                    >
                      Admin
                      <span className={getActiveBorderClass("/admin")}></span>
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {isLoaded && isSignedIn && <UserRoleDisplay />}
            <UserButton afterSignOutUrl="/" />
            
            {/* Mobile menu button */}
            <div className="sm:hidden">
              <button 
                onClick={toggleMobileMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-indigo-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              >
                <span className="sr-only">Open main menu</span>
                <svg 
                  className={`${mobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`} 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor" 
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <svg 
                  className={`${mobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`} 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor" 
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className={`${mobileMenuOpen ? 'block' : 'hidden'} sm:hidden bg-white border-t border-gray-200`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          {isLoaded && isSignedIn && (
            <>
              <Link 
                href="/dashboard" 
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive("/dashboard") 
                    ? "bg-indigo-50 text-indigo-600" 
                    : "text-gray-600 hover:bg-gray-50 hover:text-indigo-500"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link 
                href="/input" 
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive("/input") 
                    ? "bg-indigo-50 text-indigo-600" 
                    : "text-gray-600 hover:bg-gray-50 hover:text-indigo-500"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Input
              </Link>
              <Link 
                href="/profile" 
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive("/profile") 
                    ? "bg-indigo-50 text-indigo-600" 
                    : "text-gray-600 hover:bg-gray-50 hover:text-indigo-500"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Profile
              </Link>
              {isAdmin && (
                <Link 
                  href="/admin" 
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive("/admin") 
                      ? "bg-indigo-50 text-indigo-600" 
                      : "text-gray-600 hover:bg-gray-50 hover:text-indigo-500"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Admin
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
} 