import { ReactNode } from 'react'
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Navigation from '@/components/Navigation';

interface DashboardLayoutProps {
  children: ReactNode
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/sign-in");
  }
  
  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  )
} 