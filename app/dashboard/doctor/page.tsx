import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Calendar, MessageSquare, Users, PlusCircle } from "lucide-react"
import Link from "next/link"

export default function DoctorDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Doctor Dashboard</h1>
      <p className="text-muted-foreground">Manage patient records, appointments, and medical data on the blockchain.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Patients" value="48" description="Total patients" icon={<Users className="h-5 w-5" />} />
        <StatsCard title="Records" value="156" description="Medical records" icon={<FileText className="h-5 w-5" />} />
        <StatsCard title="Appointments" value="8" description="Today" icon={<Calendar className="h-5 w-5" />} />
        <StatsCard title="Messages" value="12" description="Unread" icon={<MessageSquare className="h-5 w-5" />} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Recent Patients</CardTitle>
            <CardDescription>Patients you've recently treated</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { id: 1, name: "John Doe", date: "2025-03-22", condition: "Hypertension", status: "Follow-up" },
                { id: 2, name: "Jane Smith", date: "2025-03-21", condition: "Diabetes", status: "New" },
                { id: 3, name: "Robert Johnson", date: "2025-03-20", condition: "Asthma", status: "Ongoing" },
                { id: 4, name: "Emily Davis", date: "2025-03-19", condition: "Arthritis", status: "Follow-up" },
              ].map((patient) => (
                <div key={patient.id} className="flex justify-between items-center p-3 border rounded-md">
                  <div>
                    <p className="font-medium">{patient.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {patient.date} • {patient.condition}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/doctor/patients/${patient.id}`}>View</Link>
                    </Button>
                    <Button size="sm" asChild>
                      <Link href={`/dashboard/doctor/records/add?patient=${patient.id}`}>
                        <PlusCircle className="h-4 w-4 mr-1" /> Record
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button variant="outline" className="w-full" asChild>
                <Link href="/dashboard/doctor/patients">View All Patients</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Today's Appointments</CardTitle>
            <CardDescription>Your schedule for today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { id: 1, time: "09:00 AM", patient: "John Doe", type: "Follow-up" },
                { id: 2, time: "10:30 AM", patient: "Jane Smith", type: "Consultation" },
                { id: 3, time: "01:00 PM", patient: "Robert Johnson", type: "Check-up" },
                { id: 4, time: "03:30 PM", patient: "Emily Davis", type: "Review" },
              ].map((appointment) => (
                <div key={appointment.id} className="p-3 border rounded-md">
                  <p className="font-medium">{appointment.time}</p>
                  <p className="text-sm">{appointment.patient}</p>
                  <p className="text-xs text-muted-foreground">{appointment.type}</p>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button variant="outline" className="w-full" asChild>
                <Link href="/dashboard/doctor/appointments">Full Schedule</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Add Medical Record</CardTitle>
            <CardDescription>Record patient data on the blockchain</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Create a new medical record for a patient. All data will be securely stored on the blockchain for
              transparent and immutable record-keeping.
            </p>
            <Button asChild>
              <Link href="/dashboard/doctor/records/add">
                <PlusCircle className="mr-2 h-4 w-4" />
                New Record
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Assistant</CardTitle>
            <CardDescription>Get help with medical records and patient data</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Our AI assistant can help you navigate the platform, understand patient history, and provide guidance on
              medical record documentation.
            </p>
            <Button asChild>
              <Link href="/dashboard/doctor/chat">
                <MessageSquare className="mr-2 h-4 w-4" />
                Open Assistant
              </Link>
            </Button>
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

