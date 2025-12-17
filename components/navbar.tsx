"use client"

import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { FileText, Settings, LogOut } from "lucide-react"

export function Navbar() {
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = () => {
    localStorage.removeItem("userId")
    router.push("/auth/login")
  }

  // Only show on dashboard pages
  if (!pathname?.includes("/dashboard") && !pathname?.includes("/resume")) {
    return null
  }

  return (
    <nav className="border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2 font-bold text-lg">
          <FileText className="w-5 h-5" />
          Resume Builder
        </Link>

        <div className="flex items-center gap-3">
          <Link href="/dashboard">
            <Button variant={pathname === "/dashboard" ? "default" : "ghost"}>Resumes</Button>
          </Link>
          <Link href="/settings">
            <Button variant={pathname === "/settings" ? "default" : "ghost"} size="icon">
              <Settings className="w-4 h-4" />
            </Button>
          </Link>
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </nav>
  )
}
