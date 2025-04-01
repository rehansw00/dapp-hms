"use client";

import { useState } from "react";
import { uploadToIPFS, retrieveFromIPFS } from "@/lib/ipfs";
import { toast } from "sonner";
import { OverviewStats } from "@/components/dashboard/overview-stats";
import { RecentPatients } from "@/components/dashboard/recent-patients";
import { UpcomingAppointments } from "@/components/dashboard/upcoming-appointments";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { ProfileSection } from "@/components/dashboard/ProfileSection";
import { PatientManagement } from "@/components/dashboard/PatientManagement";

export default function DoctorDashboard() {
  const [file, setFile] = useState<File | null>(null);
  const [ipfsHash, setIpfsHash] = useState("");
  const [retrievedData, setRetrievedData] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [patientId, setPatientId] = useState("");
  const [error, setError] = useState("");
  const [filePreview, setFilePreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setError("");

    if (selectedFile.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => setFilePreview(reader.result as string);
      reader.readAsDataURL(selectedFile);
    } else {
      setFilePreview(null);
    }
  };

  const handleUpload = async () => {
    if (!file || !patientId) {
      setError("Please select a file and enter patient ID");
      return;
    }

    setIsLoading(true);
    try {
      const cid = await uploadToIPFS(file);
      setIpfsHash(cid);
      toast.success("File uploaded to IPFS successfully");
      await saveMedicalRecord(patientId, cid, file.name);
    } catch (err) {
      setError("Failed to upload file");
      toast.error("Upload failed");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetrieve = async () => {
    if (!ipfsHash) return;
    try {
      const data = await retrieveFromIPFS(ipfsHash);
      setRetrievedData(data.toString());
    } catch (error) {
      console.error("Retrieval failed:", error);
    }
  };

  async function saveMedicalRecord(patientId: string, cid: string, filename: string) {
    console.log(`Saving record for ${patientId}: ${cid} (${filename})`);
  }

  return (
    <div className="space-y-6 pb-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Doctor Dashboard</h1>
          <p className="text-muted-foreground">
            Manage patients, appointments, and medical records securely with blockchain technology.
          </p>
        </div>
      </div>

      <OverviewStats />
      <QuickActions />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <UpcomingAppointments />
          <RecentPatients />
          <PatientManagement />
        </div>

        <div className="space-y-4 bg-white p-4 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold">Upload Medical Record</h2>
          <input
            type="text"
            placeholder="Enter Patient ID"
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
          />
          <input type="file" onChange={handleFileChange} className="w-full" />

          {filePreview && (
            <img src={filePreview} alt="Preview" className="max-w-full max-h-48 rounded border" />
          )}

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            onClick={handleUpload}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            disabled={isLoading}
          >
            {isLoading ? "Uploading..." : "Upload to IPFS"}
          </button>

          {ipfsHash && (
            <div className="mt-2 text-sm">
              <p>Uploaded CID:</p>
              <code className="break-all">{ipfsHash}</code>
              <button onClick={handleRetrieve} className="mt-2 text-blue-600 underline">
                Retrieve File
              </button>
            </div>
          )}

          {retrievedData && (
            <div className="mt-4 bg-gray-100 p-2 rounded">
              <h3 className="font-semibold">Retrieved Data:</h3>
              <pre className="whitespace-pre-wrap break-words">{retrievedData}</pre>
            </div>
          )}
        </div>
      </div>

      <ProfileSection />
    </div>
  );
}
