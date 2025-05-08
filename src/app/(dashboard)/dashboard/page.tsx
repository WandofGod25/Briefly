import { currentUser } from "@clerk/nextjs/server";
import { getUserRole } from "@/lib/auth";
import Link from "next/link";

export default async function Dashboard() {
  const user = await currentUser();
  const userRole = await getUserRole();
  
  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <img
            src={user.imageUrl}
            alt={`${user.firstName}'s profile`}
            className="h-16 w-16 rounded-full object-cover"
          />
          <div>
            <h2 className="text-xl font-semibold">Welcome, {user.firstName}!</h2>
            <p className="text-gray-600">
              Role: <span className="font-medium">{userRole}</span>
            </p>
          </div>
        </div>
        
        <p className="text-gray-700 mb-4">
          This is your personal dashboard where you can manage your reports and tasks.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-3">Quick Actions</h3>
          <ul className="space-y-2">
            <li>
              <Link 
                href="/dashboard/new-report" 
                className="text-indigo-600 hover:text-indigo-800"
              >
                Create new report
              </Link>
            </li>
            <li>
              <Link 
                href="/dashboard/tasks" 
                className="text-indigo-600 hover:text-indigo-800"
              >
                View tasks
              </Link>
            </li>
            <li>
              <Link 
                href="/profile" 
                className="text-indigo-600 hover:text-indigo-800"
              >
                Edit profile
              </Link>
            </li>
            {userRole === "admin" && (
              <li>
                <Link 
                  href="/admin" 
                  className="text-purple-600 hover:text-purple-800 font-medium"
                >
                  Admin Dashboard
                </Link>
              </li>
            )}
          </ul>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-3">Recent Reports</h3>
          <p className="text-gray-500 italic">No reports yet</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-3">Upcoming Tasks</h3>
          <p className="text-gray-500 italic">No tasks yet</p>
        </div>
      </div>
    </div>
  );
} 