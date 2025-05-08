import { currentUser } from "@clerk/nextjs/server";
import { getUserRole } from "@/lib/auth";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default async function Dashboard() {
  const user = await currentUser();
  const userRole = await getUserRole();
  
  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto py-8 px-4 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          <span className="gradient-text">Dashboard</span>
        </h1>
        <p className="text-muted-foreground">
          Welcome to your Briefly dashboard. Manage your reports and tasks here.
        </p>
      </div>
      
      <div className="rounded-xl overflow-hidden card-hover shadow-card mb-8 bg-card">
        <div className="bg-gradient-to-r from-primary to-accent px-6 py-5">
          <h2 className="text-white text-xl font-semibold">Welcome Back</h2>
        </div>
        <div className="p-6">
          <div className="flex flex-col sm:flex-row items-center gap-6 mb-4">
            <img
              src={user.imageUrl}
              alt={`${user.firstName}'s profile`}
              className="h-20 w-20 rounded-full object-cover border-4 border-background shadow-soft"
            />
            <div>
              <h2 className="text-2xl font-semibold text-center sm:text-left">
                Hello, {user.firstName}!
              </h2>
              <p className="text-muted-foreground flex items-center mt-1 justify-center sm:justify-start">
                <span className="inline-block w-3 h-3 bg-primary rounded-full mr-2"></span>
                <span className="font-medium capitalize">{userRole}</span> Account
              </p>
            </div>
          </div>
          
          <p className="text-muted-foreground mb-4 mt-6">
            Track your weekly progress, create reports, and manage your tasks all in one place.
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-card rounded-xl card-hover overflow-hidden animate-slide-up" style={{ animationDelay: '0ms' }}>
          <div className="bg-primary px-6 py-4">
            <h3 className="text-primary-foreground text-lg font-semibold">Quick Actions</h3>
          </div>
          <div className="p-6">
            <ul className="divide-y divide-border">
              <li className="py-3">
                <Link 
                  href="/input" 
                  className="text-foreground hover:text-primary flex items-center gap-3 font-medium transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                  </svg>
                  Record Update
                </Link>
              </li>
              <li className="py-3">
                <Link 
                  href="/dashboard/new-report" 
                  className="text-foreground hover:text-primary flex items-center gap-3 font-medium transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V8z" clipRule="evenodd" />
                  </svg>
                  Create New Report
                </Link>
              </li>
              <li className="py-3">
                <Link 
                  href="/dashboard/tasks" 
                  className="text-foreground hover:text-primary flex items-center gap-3 font-medium transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                  </svg>
                  View Tasks
                </Link>
              </li>
              <li className="py-3">
                <Link 
                  href="/profile" 
                  className="text-foreground hover:text-primary flex items-center gap-3 font-medium transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                  </svg>
                  Edit Profile
                </Link>
              </li>
              {userRole === "admin" && (
                <li className="py-3">
                  <Link 
                    href="/admin" 
                    className="text-accent hover:text-accent/80 flex items-center gap-3 font-medium transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Admin Dashboard
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
        
        <div className="bg-card rounded-xl card-hover overflow-hidden animate-slide-up" style={{ animationDelay: '150ms' }}>
          <div className="bg-primary/80 px-6 py-4">
            <h3 className="text-primary-foreground text-lg font-semibold">Recent Reports</h3>
          </div>
          <div className="p-6">
            <div className="flex flex-col justify-center items-center h-48">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-muted mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-muted-foreground text-center">No reports yet</p>
              <Link 
                href="/input" 
                className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg shadow-sm hover:bg-primary/90 transition-colors text-sm font-medium"
              >
                Create Your First Report
              </Link>
            </div>
          </div>
        </div>
        
        <div className="bg-card rounded-xl card-hover overflow-hidden animate-slide-up" style={{ animationDelay: '300ms' }}>
          <div className="bg-primary/60 px-6 py-4">
            <h3 className="text-primary-foreground text-lg font-semibold">Upcoming Tasks</h3>
          </div>
          <div className="p-6">
            <div className="flex flex-col justify-center items-center h-48">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-muted mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="text-muted-foreground text-center">No tasks yet</p>
              <span className="mt-4 text-sm text-muted-foreground">
                Tasks will appear here as they are created
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 