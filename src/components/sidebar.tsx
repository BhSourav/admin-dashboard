"use client"

/**
 * Sidebar Navigation Component
 * 
 * Main navigation sidebar with privilege-based menu items.
 * Shows/hides menu items based on user permissions.
 */

import React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { 
  Home, 
  TrendingDown, 
  TrendingUp, 
  BarChart2, 
  FileText, 
  Upload,
  LogOut,
  Moon,
  Sun
} from "lucide-react"
import { useTheme } from "next-themes"

type NavItem = {
  name: string
  href: string
  icon: React.ReactNode
  privilegeKey?: 'can_add_expense' | 'can_add_income' | 'can_view_reports' | 'can_upload_bills' | 'can_download_reports'
}

const navItems: NavItem[] = [
  { 
    name: "Dashboard", 
    href: "/dashboard", 
    icon: <Home className="h-4 w-4" /> 
  },
  { 
    name: "Add Expense", 
    href: "/dashboard/expenses/add", 
    icon: <TrendingDown className="h-4 w-4" />,
    privilegeKey: 'can_add_expense'
  },
  { 
    name: "Add Income", 
    href: "/dashboard/income/add", 
    icon: <TrendingUp className="h-4 w-4" />,
    privilegeKey: 'can_add_income'
  },
  { 
    name: "Reports & Analytics", 
    href: "/dashboard/reports", 
    icon: <BarChart2 className="h-4 w-4" />,
    privilegeKey: 'can_view_reports'
  },
  { 
    name: "Upload Bills", 
    href: "/dashboard/bills", 
    icon: <Upload className="h-4 w-4" />,
    privilegeKey: 'can_upload_bills'
  },
  { 
    name: "Download Reports", 
    href: "/dashboard/downloads", 
    icon: <FileText className="h-4 w-4" />,
    privilegeKey: 'can_download_reports'
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, privileges, signOut } = useAuth()
  const { theme, setTheme } = useTheme()

  /**
   * Check if user has privilege to access a menu item
   */
  const hasPrivilege = (privilegeKey?: string) => {
    if (!privilegeKey || !privileges) return true
    return privileges[privilegeKey as keyof typeof privileges] === true
  }

  /**
   * Handle sign out
   */
  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/login')
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  return (
    <div className="flex flex-col h-screen w-64 border-r bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      {/* App Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              FinanceTracker
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Financial Management</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          // Check if user has privilege to see this item
          if (!hasPrivilege(item.privilegeKey)) return null

          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200",
                isActive
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/30"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              )}
            >
              <span className={cn("mr-3", isActive && "text-white")}>
                {item.icon}
              </span>
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="w-full justify-start"
        >
          {theme === 'dark' ? (
            <Sun className="h-4 w-4 mr-3" />
          ) : (
            <Moon className="h-4 w-4 mr-3" />
          )}
          Toggle Theme
        </Button>

        {/* User Info & Sign Out */}
        <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-xl">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Signed in as</p>
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate mb-2">
            {user?.email}
          </p>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleSignOut}
            className="w-full"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  )
}
