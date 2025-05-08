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
  
  const containerStyle = {
    minHeight: '100vh',
    backgroundColor: '#f3f4f6',
  };
  
  const contentStyle = {
    maxWidth: '1152px',
    margin: '0 auto',
    padding: '32px 16px',
    border: '4px dashed purple',
  };
  
  return (
    <div style={containerStyle}>
      <Navigation />
      <div style={contentStyle}>
        {children}
      </div>
    </div>
  )
} 