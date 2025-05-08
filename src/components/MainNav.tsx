"use client"

import Link from "next/link"
import { UserButton, useAuth } from "@clerk/nextjs"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"

export default function MainNav() {
  const { isLoaded, isSignedIn, getToken } = useAuth()
  const [isAdmin, setIsAdmin] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    async function checkAdminRole() {
      if (!isLoaded || !isSignedIn) return
      
      try {
        const token = await getToken({ template: "session-data" })
        if (token) {
          const base64Url = token.split('.')[1]
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
          const jsonPayload = decodeURIComponent(
            atob(base64)
              .split('')
              .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
              .join('')
          )
          
          const claims = JSON.parse(jsonPayload)
          setIsAdmin(claims.role === "admin")
        }
      } catch (error) {
        console.error("Error checking admin role:", error)
      }
    }
    
    checkAdminRole()
  }, [isLoaded, isSignedIn, getToken])

  // Helper function to determine if a link is active
  const isActive = (path: string) => {
    if (path === "/dashboard" && pathname === "/dashboard") {
      return true
    }
    
    if (path !== "/dashboard" && pathname.startsWith(path)) {
      return true
    }
    
    return false
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-violet-500">Briefly</span>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex md:flex-1">
          {isLoaded && isSignedIn && (
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link href="/dashboard" legacyBehavior passHref>
                    <NavigationMenuLink className={cn(
                      navigationMenuTriggerStyle(),
                      isActive("/dashboard") ? "bg-accent text-accent-foreground" : ""
                    )}>
                      Dashboard
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/input" legacyBehavior passHref>
                    <NavigationMenuLink className={cn(
                      navigationMenuTriggerStyle(),
                      isActive("/input") ? "bg-accent text-accent-foreground" : ""
                    )}>
                      Input
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/profile" legacyBehavior passHref>
                    <NavigationMenuLink className={cn(
                      navigationMenuTriggerStyle(),
                      isActive("/profile") ? "bg-accent text-accent-foreground" : ""
                    )}>
                      Profile
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                {isAdmin && (
                  <NavigationMenuItem>
                    <Link href="/admin" legacyBehavior passHref>
                      <NavigationMenuLink className={cn(
                        navigationMenuTriggerStyle(),
                        isActive("/admin") ? "bg-accent text-accent-foreground" : ""
                      )}>
                        Admin
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                )}
              </NavigationMenuList>
            </NavigationMenu>
          )}
        </div>
        
        <div className="flex flex-1 items-center justify-end space-x-4">
          {isLoaded && isSignedIn && (
            <div className="flex items-center space-x-1">
              <div className="hidden sm:flex">
                {isAdmin && (
                  <span className="mr-2 rounded-full bg-purple-100 px-2 py-1 text-xs font-medium text-purple-800">
                    Admin
                  </span>
                )}
                {!isAdmin && isSignedIn && (
                  <span className="mr-2 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                    User
                  </span>
                )}
              </div>
              <UserButton afterSignOutUrl="/" />
            </div>
          )}
          
          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="block md:hidden border-t">
          <div className="container py-4 space-y-2">
            {isLoaded && isSignedIn && (
              <>
                <Link 
                  href="/dashboard" 
                  className={cn(
                    "block px-4 py-2 rounded-md text-sm font-medium",
                    isActive("/dashboard") 
                      ? "bg-accent text-accent-foreground" 
                      : "text-foreground hover:bg-accent/50"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link 
                  href="/input" 
                  className={cn(
                    "block px-4 py-2 rounded-md text-sm font-medium",
                    isActive("/input") 
                      ? "bg-accent text-accent-foreground" 
                      : "text-foreground hover:bg-accent/50"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Input
                </Link>
                <Link 
                  href="/profile" 
                  className={cn(
                    "block px-4 py-2 rounded-md text-sm font-medium",
                    isActive("/profile") 
                      ? "bg-accent text-accent-foreground" 
                      : "text-foreground hover:bg-accent/50"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                {isAdmin && (
                  <Link 
                    href="/admin" 
                    className={cn(
                      "block px-4 py-2 rounded-md text-sm font-medium",
                      isActive("/admin") 
                        ? "bg-accent text-accent-foreground" 
                        : "text-foreground hover:bg-accent/50"
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Admin
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
} 