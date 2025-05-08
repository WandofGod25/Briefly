'use client';

import { useSignIn } from "@clerk/nextjs";
import { useState } from "react";

export default function SlackSignInButton() {
  const { signIn, isLoaded } = useSignIn();
  const [isLoading, setIsLoading] = useState(false);

  const signInWithSlack = async () => {
    if (!isLoaded) return;
    
    try {
      setIsLoading(true);
      await signIn.authenticateWithRedirect({
        strategy: "oauth_slack",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/dashboard",
      });
    } catch (error) {
      setIsLoading(false);
      console.error("Error signing in with Slack:", error);
    }
  };

  return (
    <button
      onClick={signInWithSlack}
      disabled={isLoading || !isLoaded}
      className="w-full flex items-center justify-center gap-3 py-2 px-4 bg-white border border-gray-300 rounded-md text-gray-800 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-70 transition"
    >
      {isLoading ? (
        <span className="animate-spin h-5 w-5 border-2 border-gray-500 border-t-transparent rounded-full" />
      ) : (
        <>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.687 8.834a2.528 2.528 0 0 1-2.522 2.521 2.527 2.527 0 0 1-2.521-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.522 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.522 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.521-2.522v-2.522h2.521zM15.165 17.687a2.527 2.527 0 0 1-2.521-2.522 2.527 2.527 0 0 1 2.521-2.52h6.313A2.528 2.528 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.522h-6.313z" fill="#E01E5A" />
          </svg>
          <span>Continue with Slack</span>
        </>
      )}
    </button>
  );
} 