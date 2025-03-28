import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Download, Eye } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

export default function PatientRecords() {
  // Sample medical records data
  const records = [
    {
      id: 1,
      date: "2025-03-20",
      doctor: "Dr. Smith",
      type: "General Checkup",
      diagnosis: "Healthy",
      status: "completed",
      blockchainId: "0x8f7d3b2e1a5c4d6e9f8b7a2c1d4e5f6a7b8c9d0e",
    },
    {
      id: 2,
      date: "2025-02-15",
      doctor: "Dr. Johnson",
      type: "Blood Test",
      diagnosis: "Iron deficiency",
      status: "completed",
      blockchainId: "0x7c6b5a4d3e2f1g0h9i8j7k6l5m4n3o2p1q0r9s",
    },
    {
      id: 3,
      date: "2025-01-10",
      doctor: "Dr. Williams",
      type: "X-Ray",
      diagnosis: "No fractures detected",
      status: "completed",
      blockchainId: "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t",
    },
    {
      id: 4,
      date: "2024-12-05",
      doctor: "Dr. Brown",
      type: "Cardiology",
      diagnosis: "Normal heart function",
      status: "completed",
      blockchainId: "0x9s8r7q6p5o4n3m2l1k0j9i8h7g6f5e4d3c2b1a",
    },
    {
      id: 5,
      date: "2024-11-20",
      doctor: "Dr. Davis",
      type: "Allergy Test",
      diagnosis: "Pollen allergy",
      status: "completed",
      blockchainId: "0x2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Medical Records</h1>
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Export All
        </Button>
      </div>

      <p className="text-muted-foreground">
        All your medical records are securely stored on the blockchain. Only you and your authorized healthcare
        providers can access them.
      </p>

      <Card>
        <CardHeader>
          <CardTitle>Medical History</CardTitle>
          <CardDescription>Your complete medical history stored on the blockchain</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {records.map((record) => (
              <div key={record.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{record.type}</h3>
                      <Badge variant="outline">{record.status}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {record.date} • {record.doctor}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/patient/records/${record.id}`}>
                        <Eye className="mr-1 h-4 w-4" />
                        View
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4" />
                      <span className="sr-only">Download</span>
                    </Button>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium">Diagnosis:</p>
                  <p className="text-sm">{record.diagnosis}</p>
                </div>
                <div className="mt-2">
                  <p className="text-xs text-muted-foreground">
                    Blockchain ID: {record.blockchainId.substring(0, 10)}...
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Blockchain Verification</CardTitle>
          <CardDescription>Verify the authenticity of your medical records</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Each medical record is secured with blockchain technology, ensuring that your data cannot be altered or
            tampered with. You can verify the authenticity of any record by checking its blockchain signature.
          </p>
          <div className="flex gap-4">
            <Button variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              Verify Record
            </Button>
            <Button variant="outline">Learn More About Blockchain Security</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

