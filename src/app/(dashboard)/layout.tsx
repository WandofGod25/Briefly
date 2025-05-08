import { ReactNode } from 'react'
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: ReactNode
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/sign-in");
  }
  
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  )
} 