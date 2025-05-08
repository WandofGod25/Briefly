import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Briefly</h1>
          <div className="flex items-center gap-4">
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                  Sign Up
                </button>
              </SignUpButton>
            </SignedOut>
          </div>
        </div>
        
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">
            Transform your updates into structured reports
          </h2>
          <p className="text-gray-600 mb-8">
            Voice and text-first reporting assistant that helps you create clear, actionable updates
          </p>
          <SignedOut>
            <SignUpButton mode="modal">
              <button className="px-6 py-3 text-base font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                Get Started
              </button>
            </SignUpButton>
          </SignedOut>
        </div>
      </div>
    </div>
  );
}
