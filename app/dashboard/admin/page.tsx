import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, FileText, Database, Shield, PlusCircle } from "lucide-react"
import Link from "next/link"

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <p className="text-muted-foreground">Manage hospital system, doctors, and blockchain records.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Doctors" value="24" description="Registered doctors" icon={<Users className="h-5 w-5" />} />
        <StatsCard title="Patients" value="312" description="Total patients" icon={<FileText className="h-5 w-5" />} />
        <StatsCard title="Records" value="1,458" description="On blockchain" icon={<Database className="h-5 w-5" />} />
        <StatsCard title="Admins" value="3" description="System admins" icon={<Shield className="h-5 w-5" />} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Doctor Management</CardTitle>
            <CardDescription>Recently added doctors</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { id: 1, name: "Dr. Sarah Johnson", specialty: "Cardiology", date: "2025-03-15", status: "Active" },
                { id: 2, name: "Dr. Michael Chen", specialty: "Neurology", date: "2025-03-10", status: "Active" },
                { id: 3, name: "Dr. Emily Rodriguez", specialty: "Pediatrics", date: "2025-03-05", status: "Pending" },
                { id: 4, name: "Dr. David Kim", specialty: "Orthopedics", date: "2025-02-28", status: "Active" },
              ].map((doctor) => (
                <div key={doctor.id} className="flex justify-between items-center p-3 border rounded-md">
                  <div>
                    <p className="font-medium">{doctor.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {doctor.specialty} • Added: {doctor.date}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        doctor.status === "Active"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                      }`}
                    >
                      {doctor.status}
                    </span>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/admin/doctors/${doctor.id}`}>Manage</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-4">
              <Button variant="outline" className="w-full" asChild>
                <Link href="/dashboard/admin/doctors">View All Doctors</Link>
              </Button>
              <Button className="w-full" asChild>
                <Link href="/dashboard/admin/doctors/add">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Doctor
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
            <CardDescription>Blockchain network status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 border rounded-md">
                <div className="flex justify-between items-center mb-2">
                  <p className="font-medium">Network Status</p>
                  <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                    Online
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">Last block: #1,245,678</p>
              </div>

              <div className="p-3 border rounded-md">
                <div className="flex justify-between items-center mb-2">
                  <p className="font-medium">Smart Contract</p>
                  <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                    Active
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">Version: 1.2.0</p>
              </div>

              <div className="p-3 border rounded-md">
                <div className="flex justify-between items-center mb-2">
                  <p className="font-medium">Gas Usage</p>
                  <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                    Normal
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">Avg: 45 Gwei</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Add New Doctor</CardTitle>
            <CardDescription>Onboard a doctor to the blockchain system</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Add a new doctor to the hospital management system. The doctor will be registered on the blockchain and
              given access to patient records based on their role.
            </p>
            <Button asChild>
              <Link href="/dashboard/admin/doctors/add">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Doctor
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Analytics</CardTitle>
            <CardDescription>Blockchain usage statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium">Records Added (30d)</p>
                <p className="font-bold">245</p>
              </div>
              <div className="w-full bg-muted rounded-full h-2.5">
                <div className="bg-primary h-2.5 rounded-full" style={{ width: "70%" }}></div>
              </div>

              <div className="flex justify-between items-center">
                <p className="text-sm font-medium">Storage Usage</p>
                <p className="font-bold">62%</p>
              </div>
              <div className="w-full bg-muted rounded-full h-2.5">
                <div className="bg-primary h-2.5 rounded-full" style={{ width: "62%" }}></div>
              </div>

              <div className="flex justify-between items-center">
                <p className="text-sm font-medium">System Uptime</p>
                <p className="font-bold">99.8%</p>
              </div>
              <div className="w-full bg-muted rounded-full h-2.5">
                <div className="bg-primary h-2.5 rounded-full" style={{ width: "99.8%" }}></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function StatsCard({
  title,
  value,
  description,
  icon,
}: {
  title: string
  value: string
  description: string
  icon: React.ReactNode
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          </div>
          <div className="p-2 bg-primary/10 rounded-full text-primary">{icon}</div>
        </div>
      </CardContent>
    </Card>
  )
}

