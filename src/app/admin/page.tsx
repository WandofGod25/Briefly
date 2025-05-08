import { protectPage, getUserRole } from "@/lib/auth";

export default async function AdminPage() {
  // Protect this page - only admins can access it
  await protectPage("admin");
  
  // Get additional user info if needed
  const userRole = await getUserRole();
  
  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <span className="inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-2.5 py-0.5 rounded">
            {userRole.toUpperCase()} ACCESS
          </span>
        </div>
        
        <p className="text-gray-700 mb-4">
          Welcome to the admin dashboard. This page is only accessible to users with the admin role.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
            <h3 className="font-medium text-gray-900 mb-2">User Management</h3>
            <p className="text-gray-600 text-sm">Manage user accounts and permissions</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
            <h3 className="font-medium text-gray-900 mb-2">System Settings</h3>
            <p className="text-gray-600 text-sm">Configure application settings</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
            <h3 className="font-medium text-gray-900 mb-2">Analytics</h3>
            <p className="text-gray-600 text-sm">View usage statistics and reports</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
            <h3 className="font-medium text-gray-900 mb-2">Content Management</h3>
            <p className="text-gray-600 text-sm">Manage application content</p>
          </div>
        </div>
      </div>
    </div>
  );
} 