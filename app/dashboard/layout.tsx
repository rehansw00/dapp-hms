"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
  Home,
  Users,
  FileText,
  Calendar,
  MessageSquare,
  Settings,
  LogOut,
  User,
  PlusCircle,
  Database,
} from "lucide-react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [account, setAccount] = useState<string | null>(null)
  const [role, setRole] = useState<string | null>(null)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated with MetaMask
    const checkAuth = async () => {
      if (typeof window !== "undefined" && window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: "eth_accounts" })
          if (accounts.length === 0) {
            // Not connected, redirect to login
            router.push("/login")
            return
          }

          setAccount(accounts[0])

          // Determine role based on path
          // In a real app, you would get this from your smart contract
          const pathParts = pathname?.split("/") || [];
          const roleFromPath = pathParts[2];
          
          if (roleFromPath === "admin" || roleFromPath === "doctor" || roleFromPath === "patient") {
            setRole(roleFromPath);
          } else {
            setRole("patient"); // Default role
          }
        } catch (error) {
          console.error("Failed to check authentication", error)
          router.push("/login")
        }
      } else {
        router.push("/login")
      }
    }

    checkAuth()
  }, [pathname, router])

  const handleLogout = () => {
    // In a real app, you would handle disconnecting from MetaMask
    router.push("/login")
  }

  // Get menu items based on role
  const getMenuItems = () => {
    const baseItems = [
      {
        name: "Dashboard",
        icon: Home,
        path: `/dashboard/${role}`,
      },
      {
        name: "Profile",
        icon: User,
        path: `/dashboard/${role}/profile`,
      },
      {
        name: "Chat Assistant",
        icon: MessageSquare,
        path: `/dashboard/${role}/chat`,
      },
      {
        name: "Settings",
        icon: Settings,
        path: `/dashboard/${role}/settings`,
      },
    ]

    if (role === "admin") {
      return [
        ...baseItems,
        {
          name: "Manage Doctors",
          icon: Users,
<<<<<<< HEAD
          path: "/dashboard/admin/doctors",
=======
          path: `/dashboard/${role}/doctors`,
>>>>>>> e52528a2ff2bc17f73cf90522ac229f92bf53480
        },
        {
          name: "Add Doctor",
          icon: PlusCircle,
<<<<<<< HEAD
          path: "/dashboard/admin/doctors/add",
=======
          path: `/dashboard/${role}/doctors/add`,
>>>>>>> e52528a2ff2bc17f73cf90522ac229f92bf53480
        },
      ]
    } else if (role === "doctor") {
      return [
        ...baseItems,
        {
          name: "Patients",
          icon: Users,
<<<<<<< HEAD
          path: "/dashboard/doctor/patients",
=======
          path: `/dashboard/${role}/patients`,
>>>>>>> e52528a2ff2bc17f73cf90522ac229f92bf53480
        },
        {
          name: "Add Record",
          icon: FileText,
<<<<<<< HEAD
          path: "/dashboard/doctor/records/add",
=======
          path: `/dashboard/${role}/records/add`,
>>>>>>> e52528a2ff2bc17f73cf90522ac229f92bf53480
        },
        {
          name: "Appointments",
          icon: Calendar,
<<<<<<< HEAD
          path: "/dashboard/doctor/appointments",
=======
          path: `/dashboard/${role}/appointments`,
>>>>>>> e52528a2ff2bc17f73cf90522ac229f92bf53480
        },
      ]
    } else {
      // Patient
      return [
        ...baseItems,
        {
          name: "My Records",
          icon: Database,
<<<<<<< HEAD
          path: "/dashboard/patient/records",
=======
          path: `/dashboard/${role}/records`,
>>>>>>> e52528a2ff2bc17f73cf90522ac229f92bf53480
        },
        {
          name: "Appointments",
          icon: Calendar,
<<<<<<< HEAD
          path: "/dashboard/patient/appointments",
=======
          path: `/dashboard/${role}/appointments`,
>>>>>>> e52528a2ff2bc17f73cf90522ac229f92bf53480
        },
      ]
    }
  }

  if (!account || !role) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-background">
        <Sidebar>
          <SidebarHeader className="border-b border-border">
            <div className="flex items-center p-2">
              <div className="font-bold text-xl text-primary">MediChain</div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {getMenuItems().map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild isActive={pathname === item.path}>
                    <Link href={item.path}>
                      <item.icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="border-t border-border p-2">
            <div className="flex flex-col gap-2">
              <div className="px-3 py-2">
                <p className="text-sm font-medium">{role.charAt(0).toUpperCase() + role.slice(1)}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {account.substring(0, 6)}...{account.substring(account.length - 4)}
                </p>
              </div>
              <Button variant="outline" className="w-full justify-start" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>

        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="h-14 border-b border-border flex items-center px-4">
            <SidebarTrigger className="mr-2" />
            <div className="flex-1">
              <h1 className="text-lg font-medium">{role.charAt(0).toUpperCase() + role.slice(1)} Dashboard</h1>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-4">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}
<<<<<<< HEAD

=======
>>>>>>> e52528a2ff2bc17f73cf90522ac229f92bf53480
