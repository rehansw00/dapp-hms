import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PlusCircle, Search } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

export default function PatientsList() {
  // Sample patients data
  const patients = [
    {
      id: 1,
      name: "John Doe",
      age: 45,
      gender: "Male",
      condition: "Hypertension",
      lastVisit: "2025-03-22",
      status: "Active",
    },
    {
      id: 2,
      name: "Jane Smith",
      age: 38,
      gender: "Female",
      condition: "Diabetes",
      lastVisit: "2025-03-21",
      status: "Active",
    },
    {
      id: 3,
      name: "Robert Johnson",
      age: 62,
      gender: "Male",
      condition: "Asthma",
      lastVisit: "2025-03-20",
      status: "Active",
    },
    {
      id: 4,
      name: "Emily Davis",
      age: 29,
      gender: "Female",
      condition: "Arthritis",
      lastVisit: "2025-03-19",
      status: "Active",
    },
    {
      id: 5,
      name: "Michael Wilson",
      age: 55,
      gender: "Male",
      condition: "Coronary Artery Disease",
      lastVisit: "2025-03-15",
      status: "Critical",
    },
    {
      id: 6,
      name: "Sarah Thompson",
      age: 42,
      gender: "Female",
      condition: "Migraine",
      lastVisit: "2025-03-10",
      status: "Active",
    },
    {
      id: 7,
      name: "David Brown",
      age: 70,
      gender: "Male",
      condition: "Parkinson's Disease",
      lastVisit: "2025-03-05",
      status: "Stable",
    },
    {
      id: 8,
      name: "Jennifer Martinez",
      age: 33,
      gender: "Female",
      condition: "Anxiety Disorder",
      lastVisit: "2025-03-01",
      status: "Active",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Patients</h1>
        <Button asChild>
          <Link href="/dashboard/doctor/records/add">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Record
          </Link>
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search patients..." className="pl-8" />
        </div>
        <Button variant="outline">Filter</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Patient List</CardTitle>
          <CardDescription>Manage your patients and their medical records</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="grid grid-cols-7 border-b bg-muted/50 px-4 py-3 text-sm font-medium">
              <div className="col-span-2">Patient</div>
              <div>Age</div>
              <div>Gender</div>
              <div>Condition</div>
              <div>Last Visit</div>
              <div className="text-right">Actions</div>
            </div>
            <div className="divide-y">
              {patients.map((patient) => (
                <div key={patient.id} className="grid grid-cols-7 items-center px-4 py-3">
                  <div className="col-span-2 font-medium">{patient.name}</div>
                  <div>{patient.age}</div>
                  <div>{patient.gender}</div>
                  <div className="flex items-center gap-2">
                    {patient.condition}
                    {patient.status === "Critical" && (
                      <Badge variant="destructive" className="ml-2">
                        Critical
                      </Badge>
                    )}
                  </div>
                  <div>{patient.lastVisit}</div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/doctor/patients/${patient.id}`}>View</Link>
                    </Button>
                    <Button size="sm" asChild>
                      <Link href={`/dashboard/doctor/records/add?patient=${patient.id}`}>Add Record</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

