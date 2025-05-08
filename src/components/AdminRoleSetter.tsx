"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";

export default function AdminRoleSetter() {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ success?: boolean; message?: string; error?: string } | null>(null);

  const setAdminRole = async () => {
    if (!user) return;
    
    setIsLoading(true);
    setResult(null);
    
    try {
      const response = await fetch("/api/set-admin-role", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setResult({ 
          success: true, 
          message: data.message || "Admin role set successfully" 
        });
        // Force a page reload to reflect the new role
        setTimeout(() => window.location.reload(), 1500);
      } else {
        setResult({ 
          success: false, 
          error: data.error || "Failed to set admin role" 
        });
      }
    } catch (error) {
      setResult({ 
        success: false, 
        error: "An unexpected error occurred" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="mt-6 p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-medium text-gray-900 mb-2">Developer Tools</h3>
      <p className="text-sm text-gray-600 mb-4">
        Set your user account as an admin to test admin-only features.
      </p>
      
      <button
        onClick={setAdminRole}
        disabled={isLoading}
        className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Setting role..." : "Set as Admin"}
      </button>
      
      {result && (
        <div className={`mt-4 p-3 rounded ${result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {result.success ? result.message : result.error}
        </div>
      )}
      
      <div className="mt-4 text-xs text-gray-500">
        <p>Note: This functionality is only available in development mode.</p>
      </div>
    </div>
  );
} 