import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import AuthStatus from "@/components/AuthStatus";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 md:p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between text-sm lg:flex">
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
          <div className="flex items-center justify-center space-x-4 p-8 lg:p-0">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                  Sign Up
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <div className="flex items-center gap-4">
                <Link
                  href="/dashboard"
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Dashboard
                </Link>
                <UserButton afterSignOutUrl="/" />
              </div>
            </SignedIn>
          </div>
        </div>
      </div>

      <div className="relative flex flex-col place-items-center text-center max-w-3xl mx-auto mt-12">
        <h1 className="text-4xl md:text-6xl font-bold mb-8">
          <span className="text-indigo-600">Briefly</span> - Your Weekly Report Assistant
        </h1>
        <p className="text-lg mb-8 text-gray-600">
          Transform your voice notes and text updates into structured weekly reports, ready to share
          with your team or manager.
        </p>
        
        <div className="my-8">
          <AuthStatus />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Voice & Text Input</h3>
            <p className="text-gray-600">
              Capture your updates with voice recording or type them directly.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Smart Prompts</h3>
            <p className="text-gray-600">
              Get guided through the report creation process with smart prompts.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Multiple Formats</h3>
            <p className="text-gray-600">
              Export your reports as Markdown, email snippets, or Slack messages.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
