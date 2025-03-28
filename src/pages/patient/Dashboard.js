"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import "./Dashboard.css"

const PatientDashboard = () => {
  const { contract, account } = useAuth()
  const [patientInfo, setPatientInfo] = useState(null)
  const [records, setRecords] = useState([])
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        if (!contract || !account) return

        // Fetch patient information
        const info = await contract.methods.getPatientInfo(account).call()
        setPatientInfo({
          name: info.name,
          age: info.age,
          gender: info.gender,
          recordCount: info.recordCount,
          dateRegistered: new Date(info.dateRegistered * 1000).toLocaleDateString(),
        })

        // Fetch patient records
        const recordCount = Number.parseInt(info.recordCount)
        const recordsData = []

        for (let i = 0; i < Math.min(recordCount, 5); i++) {
          const record = await contract.methods.getMedicalRecord(account, i).call()

          // Get doctor info for this record
          const doctorInfo = await contract.methods.getDoctorInfo(record.doctorAddress).call()

          recordsData.push({
            id: i,
            doctorName: doctorInfo.name,
            doctorAddress: record.doctorAddress,
            recordType: record.recordType,
            diagnosis: record.diagnosis,
            date: new Date(record.timestamp * 1000).toLocaleDateString(),
            recordHash: record.recordHash,
          })
        }

        setRecords(recordsData)

        // For demo purposes, we'll use mock appointment data
        // In a real app, this would come from the blockchain
        setAppointments([
          {
            id: 1,
            date: "2025-04-15",
            time: "10:00 AM",
            doctor: "Dr. Smith",
            type: "Follow-up",
            status: "Confirmed",
          },
          {
            id: 2,
            date: "2025-04-22",
            time: "2:30 PM",
            doctor: "Dr. Johnson",
            type: "Consultation",
            status: "Pending",
          },
        ])
      } catch (err) {
        console.error("Error fetching patient data:", err)
        setError("Failed to load patient data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchPatientData()
  }, [contract, account])

  if (loading) {
    return <div className="loading">Loading patient data...</div>
  }

  if (error) {
    return <div className="error-message">{error}</div>
  }

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Welcome, {patientInfo?.name}</h1>
      <p className="dashboard-subtitle">Access your medical records, appointments, and chat with our assistant.</p>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-content">
            <h3 className="stat-value">{patientInfo?.recordCount || 0}</h3>
            <p className="stat-label">Medical Records</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <h3 className="stat-value">{appointments.length}</h3>
            <p className="stat-label">Appointments</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👨‍⚕️</div>
          <div className="stat-content">
            <h3 className="stat-value">3</h3>
            <p className="stat-label">Doctors</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💬</div>
          <div className="stat-content">
            <h3 className="stat-value">5</h3>
            <p className="stat-label">Messages</p>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <div className="card-header">
            <h2 className="card-title">Recent Medical Records</h2>
            <p className="card-subtitle">Your latest health records on the blockchain</p>
          </div>
          <div className="card-body">
            {records.length > 0 ? (
              <div className="records-list">
                {records.map((record) => (
                  <div key={record.id} className="record-item">
                    <div className="record-details">
                      <h3 className="record-type">{record.recordType}</h3>
                      <p className="record-meta">
                        {record.date} • {record.doctorName}
                      </p>
                      <p className="record-diagnosis">
                        <strong>Diagnosis:</strong> {record.diagnosis}
                      </p>
                    </div>
                    <Link to={`/patient/records/${record.id}`} className="btn btn-outline btn-sm">
                      View
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-data-message">No medical records found.</p>
            )}
            <div className="card-actions">
              <Link to="/patient/records" className="btn btn-outline btn-block">
                View All Records
              </Link>
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <h2 className="card-title">Upcoming Appointments</h2>
            <p className="card-subtitle">Your scheduled doctor appointments</p>
          </div>
          <div className="card-body">
            {appointments.length > 0 ? (
              <div className="appointments-list">
                {appointments.map((appointment) => (
                  <div key={appointment.id} className="appointment-item">
                    <div className="appointment-details">
                      <h3 className="appointment-type">{appointment.type}</h3>
                      <p className="appointment-meta">
                        {appointment.date} • {appointment.time} • {appointment.doctor}
                      </p>
                      <span className={`appointment-status status-${appointment.status.toLowerCase()}`}>
                        {appointment.status}
                      </span>
                    </div>
                    <Link to={`/patient/appointments/${appointment.id}`} className="btn btn-outline btn-sm">
                      Details
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-data-message">No upcoming appointments.</p>
            )}
            <div className="card-actions">
              <Link to="/patient/appointments" className="btn btn-outline btn-block">
                View All Appointments
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-card mt-4">
        <div className="card-header">
          <h2 className="card-title">Need Help?</h2>
          <p className="card-subtitle">Chat with our AI assistant for guidance</p>
        </div>
        <div className="card-body">
          <p className="mb-3">
            Our AI assistant can help you navigate the platform, understand your medical records, and answer common
            questions about your health data.
          </p>
          <Link to="/patient/chat" className="btn btn-primary">
            <i className="fas fa-comment-dots mr-2"></i>
            Start Chat
          </Link>
        </div>
      </div>
    </div>
  )
}

export default PatientDashboard

