"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import "./Records.css"

const PatientRecords = () => {
  const { contract, account } = useAuth()
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        if (!contract || !account) return

        // Get patient info to get record count
        const patientInfo = await contract.methods.getPatientInfo(account).call()
        const recordCount = Number.parseInt(patientInfo.recordCount)

        // Fetch all records
        const recordsData = []

        for (let i = 0; i < recordCount; i++) {
          const record = await contract.methods.getMedicalRecord(account, i).call()

          // Get doctor info for this record
          const doctorInfo = await contract.methods.getDoctorInfo(record.doctorAddress).call()

          recordsData.push({
            id: i,
            doctorName: doctorInfo.name,
            doctorAddress: record.doctorAddress,
            recordType: record.recordType,
            diagnosis: record.diagnosis,
            symptoms: record.symptoms,
            treatment: record.treatment,
            medications: record.medications,
            notes: record.notes,
            date: new Date(record.timestamp * 1000).toLocaleDateString(),
            timestamp: record.timestamp,
            recordHash: record.recordHash,
          })
        }

        // Sort records by timestamp (newest first)
        recordsData.sort((a, b) => b.timestamp - a.timestamp)

        setRecords(recordsData)
      } catch (err) {
        console.error("Error fetching records:", err)
        setError("Failed to load medical records. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchRecords()
  }, [contract, account])

  const verifyRecord = async (recordId, recordHash) => {
    try {
      if (!contract || !account) return

      const isValid = await contract.methods.verifyRecordHash(account, recordId, recordHash).call()

      if (isValid) {
        alert("Record verified! This record is authentic and has not been tampered with.")
      } else {
        alert("Warning: Record verification failed! This record may have been tampered with.")
      }
    } catch (err) {
      console.error("Error verifying record:", err)
      alert("Error verifying record. Please try again later.")
    }
  }

  if (loading) {
    return <div className="loading">Loading medical records...</div>
  }

  if (error) {
    return <div className="error-message">{error}</div>
  }

  return (
    <div className="records-container">
      <div className="records-header">
        <h1 className="records-title">My Medical Records</h1>
        <button className="btn btn-outline">
          <i className="fas fa-download mr-2"></i>
          Export All
        </button>
      </div>

      <p className="records-subtitle">
        All your medical records are securely stored on the blockchain. Only you and your authorized healthcare
        providers can access them.
      </p>

      <div className="records-card">
        <div className="card-header">
          <h2 className="card-title">Medical History</h2>
          <p className="card-subtitle">Your complete medical history stored on the blockchain</p>
        </div>
        <div className="card-body">
          {records.length > 0 ? (
            <div className="records-list">
              {records.map((record) => (
                <div key={record.id} className="record-item">
                  <div className="record-header">
                    <div>
                      <h3 className="record-type">{record.recordType}</h3>
                      <p className="record-meta">
                        {record.date} • {record.doctorName}
                      </p>
                    </div>
                    <div className="record-actions">
                      <button
                        className="btn btn-sm btn-outline mr-2"
                        onClick={() => verifyRecord(record.id, record.recordHash)}
                      >
                        <i className="fas fa-shield-alt mr-1"></i>
                        Verify
                      </button>
                      <Link to={`/patient/records/${record.id}`} className="btn btn-sm btn-primary">
                        <i className="fas fa-eye mr-1"></i>
                        View
                      </Link>
                    </div>
                  </div>

                  <div className="record-content">
                    <div className="record-section">
                      <h4 className="record-section-title">Diagnosis</h4>
                      <p>{record.diagnosis}</p>
                    </div>

                    {record.symptoms && (
                      <div className="record-section">
                        <h4 className="record-section-title">Symptoms</h4>
                        <p>{record.symptoms}</p>
                      </div>
                    )}

                    {record.treatment && (
                      <div className="record-section">
                        <h4 className="record-section-title">Treatment</h4>
                        <p>{record.treatment}</p>
                      </div>
                    )}
                  </div>

                  <div className="record-footer">
                    <p className="record-hash">
                      <span className="hash-label">Blockchain ID:</span>
                      <span className="hash-value">{`${record.recordHash.substring(0, 10)}...${record.recordHash.substring(record.recordHash.length - 8)}`}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-records">
              <i className="fas fa-file-medical no-records-icon"></i>
              <h3>No Medical Records Found</h3>
              <p>You don't have any medical records yet. Records will appear here after your doctor adds them.</p>
            </div>
          )}
        </div>
      </div>

      <div className="records-card mt-4">
        <div className="card-header">
          <h2 className="card-title">Blockchain Verification</h2>
          <p className="card-subtitle">Verify the authenticity of your medical records</p>
        </div>
        <div className="card-body">
          <div className="verification-info">
            <div className="verification-icon">
              <i className="fas fa-shield-alt"></i>
            </div>
            <div className="verification-content">
              <p>
                Each medical record is secured with blockchain technology, ensuring that your data cannot be altered or
                tampered with. You can verify the authenticity of any record by checking its blockchain signature.
              </p>
              <p className="mt-2">
                The verification process compares the current state of your record with its original hash stored on the
                blockchain. If they match, the record is authentic and has not been modified.
              </p>
            </div>
          </div>
          <div className="verification-actions">
            <button className="btn btn-outline">
              <i className="fas fa-info-circle mr-2"></i>
              Learn More About Blockchain Security
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PatientRecords

