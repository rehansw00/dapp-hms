"use client"
import { useState } from 'react'
import { uploadToIPFS, retrieveFromIPFS } from '@/lib/ipfs'
import { toast } from 'sonner'

interface Patient {
  id: string
  name: string
  email: string
  phone: string
  ipfsHash?: string
  medicalRecords?: string
  recordFile?: File | null
}

export function PatientManagement() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [currentPatient, setCurrentPatient] = useState<Patient>({
    id: '',
    name: '',
    email: '',
    phone: ''
  })
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCurrentPatient(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, patientId: string) => {
    const file = e.target.files?.[0]
    if (!file) return

    setPatients(prev => prev.map(p =>
      p.id === patientId ? { ...p, recordFile: file } : p
    ))
  }

  const uploadPatientRecord = async (patientId: string) => {
    const patient = patients.find(p => p.id === patientId)
    if (!patient?.recordFile) {
      toast.error('No file selected')
      return
    }

    setIsLoading(true)
    try {
      const cid = await uploadToIPFS(patient.recordFile)
      setPatients(prev => prev.map(p =>
        p.id === patientId ? { 
          ...p, 
          ipfsHash: cid, 
          recordFile: null,
          medicalRecords: 'File uploaded to IPFS: ' + cid
        } : p
      ))
      toast.success('Medical record uploaded to IPFS')
    } catch (error) {
      toast.error('Failed to upload record')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const retrieveMedicalRecord = async (patient: Patient) => {
    if (!patient.ipfsHash) {
      toast.error('No IPFS hash found for this patient')
      return
    }

    try {
      const data = await retrieveFromIPFS(patient.ipfsHash)
      const textDecoder = new TextDecoder()
      const content = textDecoder.decode(data)
      
      setPatients(prev => prev.map(p =>
        p.id === patient.id ? { 
          ...p, 
          medicalRecords: content 
        } : p
      ))
      toast.success('Medical record retrieved')
    } catch (error) {
      toast.error('Failed to retrieve record')
      console.error(error)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isEditing) {
      setPatients(prev => prev.map(p =>
        p.id === currentPatient.id ? currentPatient : p
      ))
    } else {
      setPatients(prev => [...prev, {
        ...currentPatient,
        id: Date.now().toString()
      }])
    }
    resetForm()
  }

  const editPatient = (patient: Patient) => {
    setCurrentPatient(patient)
    setIsEditing(true)
  }

  const deletePatient = (id: string) => {
    setPatients(prev => prev.filter(p => p.id !== id))
  }

  const resetForm = () => {
    setCurrentPatient({ id: '', name: '', email: '', phone: '' })
    setIsEditing(false)
  }

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Patient Management</h2>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          name="name"
          value={currentPatient.name}
          onChange={handleInputChange}
          placeholder="Name"
          className="border px-3 py-2 w-full"
        />
        <input
          name="email"
          value={currentPatient.email}
          onChange={handleInputChange}
          placeholder="Email"
          className="border px-3 py-2 w-full"
        />
        <input
          name="phone"
          value={currentPatient.phone}
          onChange={handleInputChange}
          placeholder="Phone"
          className="border px-3 py-2 w-full"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {isEditing ? 'Update' : 'Add'} Patient
        </button>
      </form>

      <div className="mt-6">
        <h3 className="text-xl font-medium mb-2">Patient List</h3>
        {patients.map((patient) => (
          <div key={patient.id} className="border p-4 mb-4 rounded">
            <p><strong>Name:</strong> {patient.name}</p>
            <p><strong>Email:</strong> {patient.email}</p>
            <p><strong>Phone:</strong> {patient.phone}</p>

            <div className="mt-2 space-x-2">
              <input
                type="file"
                onChange={(e) => handleFileChange(e, patient.id)}
              />
              <button
                onClick={() => uploadPatientRecord(patient.id)}
                disabled={isLoading}
                className="bg-green-500 text-white px-3 py-1 rounded"
              >
                {isLoading ? 'Uploading...' : 'Upload Record'}
              </button>
              <button
                onClick={() => retrieveMedicalRecord(patient)}
                className="bg-yellow-500 text-white px-3 py-1 rounded"
              >
                Retrieve Record
              </button>
              <button
                onClick={() => editPatient(patient)}
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => deletePatient(patient.id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>

            {patient.medicalRecords && (
              <pre className="bg-gray-100 p-2 mt-2 rounded whitespace-pre-wrap text-sm">
                {patient.medicalRecords}
              </pre>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
