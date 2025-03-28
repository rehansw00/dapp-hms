import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Calendar, MessageSquare, User } from "lucide-react"
import Link from "next/link"

export default function PatientDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Welcome to your Patient Dashboard</h1>
      <p className="text-muted-foreground">Access your medical records, appointments, and chat with our assistant.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Medical Records"
          value="12"
          description="Total records"
          icon={<FileText className="h-5 w-5" />}
        />
        <StatsCard title="Appointments" value="2" description="Upcoming" icon={<Calendar className="h-5 w-5" />} />
        <StatsCard title="Doctors" value="3" description="Assigned to you" icon={<User className="h-5 w-5" />} />
        <StatsCard title="Messages" value="5" description="Unread" icon={<MessageSquare className="h-5 w-5" />} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Medical Records</CardTitle>
            <CardDescription>Your latest health records on the blockchain</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { id: 1, date: "2025-03-20", doctor: "Dr. Smith", type: "General Checkup" },
                { id: 2, date: "2025-02-15", doctor: "Dr. Johnson", type: "Blood Test" },
                { id: 3, date: "2025-01-10", doctor: "Dr. Williams", type: "X-Ray" },
              ].map((record) => (
                <div key={record.id} className="flex justify-between items-center p-3 border rounded-md">
                  <div>
                    <p className="font-medium">{record.type}</p>
                    <p className="text-sm text-muted-foreground">
                      {record.date} • {record.doctor}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/patient/records/${record.id}`}>View</Link>
                  </Button>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button variant="outline" className="w-full" asChild>
                <Link href="/dashboard/patient/records">View All Records</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
            <CardDescription>Your scheduled doctor appointments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { id: 1, date: "2025-03-25", time: "10:00 AM", doctor: "Dr. Smith", type: "Follow-up" },
                { id: 2, date: "2025-04-05", time: "2:30 PM", doctor: "Dr. Johnson", type: "Consultation" },
              ].map((appointment) => (
                <div key={appointment.id} className="flex justify-between items-center p-3 border rounded-md">
                  <div>
                    <p className="font-medium">{appointment.type}</p>
                    <p className="text-sm text-muted-foreground">
                      {appointment.date} • {appointment.time} • {appointment.doctor}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/patient/appointments/${appointment.id}`}>Details</Link>
                  </Button>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button variant="outline" className="w-full" asChild>
                <Link href="/dashboard/patient/appointments">View All Appointments</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Need Help?</CardTitle>
          <CardDescription>Chat with our AI assistant for guidance</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Our AI assistant can help you navigate the platform, understand your medical records, and answer common
            questions about your health data.
          </p>
          <Button asChild>
            <Link href="/dashboard/patient/chat">
              <MessageSquare className="mr-2 h-4 w-4" />
              Start Chat
            </Link>
          </Button>
        </CardContent>
      </Card>
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

