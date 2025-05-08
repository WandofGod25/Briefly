import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Dashboard() {
  const user = await currentUser();
  
  if (!user) {
    redirect("/");
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Create New Report</h2>
        <p className="text-gray-600 mb-6">
          Start by recording your voice update or typing your report content.
        </p>
        
        <div className="space-y-4">
          <Link href="/input" className="block">
            <div className="p-4 border rounded-lg border-gray-200 hover:border-blue-500 transition-colors">
              <h3 className="text-lg font-medium mb-2">Voice Input</h3>
              <p className="text-gray-500 text-sm mb-3">
                Record your update using your microphone
              </p>
              <button 
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Start Recording
              </button>
            </div>
          </Link>
          
          <Link href="/input" className="block">
            <div className="p-4 border rounded-lg border-gray-200 hover:border-blue-500 transition-colors">
              <h3 className="text-lg font-medium mb-2">Text Input</h3>
              <p className="text-gray-500 text-sm mb-3">
                Type your update directly
              </p>
              <button 
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Start Writing
              </button>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
} 