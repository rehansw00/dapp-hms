"use client"

import { useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Web3 from "web3"
import "./App.css"

// Components
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"

// Pages
import Home from "./pages/Home"
import Login from "./pages/Login"
import PatientDashboard from "./pages/patient/Dashboard"
import PatientRecords from "./pages/patient/Records"
import PatientAppointments from "./pages/patient/Appointments"
import PatientChat from "./pages/patient/Chat"
import DoctorDashboard from "./pages/doctor/Dashboard"
import DoctorPatients from "./pages/doctor/Patients"
import DoctorAddRecord from "./pages/doctor/AddRecord"
import DoctorAppointments from "./pages/doctor/Appointments"
import AdminDashboard from "./pages/admin/Dashboard"
import AdminDoctors from "./pages/admin/Doctors"
import AdminAddDoctor from "./pages/admin/AddDoctor"

// Context
import { AuthProvider } from "./context/AuthContext"

// Contract ABIs
import HospitalManagementABI from "./contracts/HospitalManagement.json"

function App() {
  const [web3, setWeb3] = useState(null)
  const [contract, setContract] = useState(null)
  const [account, setAccount] = useState(null)
  const [userRole, setUserRole] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initWeb3 = async () => {
      // Check if MetaMask is installed
      if (window.ethereum) {
        try {
          // Request account access
          await window.ethereum.request({ method: "eth_requestAccounts" })
          const web3Instance = new Web3(window.ethereum)
          setWeb3(web3Instance)

          // Get the user's account
          const accounts = await web3Instance.eth.getAccounts()
          setAccount(accounts[0])

          // Initialize the contract
          const networkId = await web3Instance.eth.net.getId()
          const deployedNetwork = HospitalManagementABI.networks[networkId]

          if (deployedNetwork) {
            const contractInstance = new web3Instance.eth.Contract(HospitalManagementABI.abi, deployedNetwork.address)
            setContract(contractInstance)
          } else {
            console.error("Contract not deployed to detected network.")
          }

          // Listen for account changes
          window.ethereum.on("accountsChanged", (accounts) => {
            setAccount(accounts[0])
            window.location.reload()
          })

          // Listen for chain changes
          window.ethereum.on("chainChanged", () => {
            window.location.reload()
          })
        } catch (error) {
          console.error("Error connecting to MetaMask", error)
        }
      } else {
        console.error("Please install MetaMask!")
      }
      setLoading(false)
    }

    initWeb3()
  }, [])

  // Determine user role based on blockchain data
  useEffect(() => {
    const checkUserRole = async () => {
      if (contract && account) {
        try {
          // Check if user is admin
          const isAdmin = await contract.methods.isAdmin(account).call()
          if (isAdmin) {
            setUserRole("admin")
            return
          }

          // Check if user is doctor
          const isDoctor = await contract.methods.isDoctor(account).call()
          if (isDoctor) {
            setUserRole("doctor")
            return
          }

          // Check if user is patient
          const isPatient = await contract.methods.isPatient(account).call()
          if (isPatient) {
            setUserRole("patient")
            return
          }

          // If no role is found, user is not registered
          setUserRole("unregistered")
        } catch (error) {
          console.error("Error checking user role:", error)
          setUserRole("unregistered")
        }
      }
    }

    checkUserRole()
  }, [contract, account])

  // Protected route component
  const ProtectedRoute = ({ element, allowedRoles }) => {
    if (loading) {
      return <div className="loading">Loading...</div>
    }

    if (!account) {
      return <Navigate to="/login" />
    }

    if (!userRole || !allowedRoles.includes(userRole)) {
      return <Navigate to="/login" />
    }

    return element
  }

  return (
    <AuthProvider value={{ web3, contract, account, userRole }}>
      <Router>
        <div className="app">
          <Navbar account={account} userRole={userRole} />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />

              {/* Patient Routes */}
              <Route
                path="/patient/dashboard"
                element={<ProtectedRoute element={<PatientDashboard />} allowedRoles={["patient"]} />}
              />
              <Route
                path="/patient/records"
                element={<ProtectedRoute element={<PatientRecords />} allowedRoles={["patient"]} />}
              />
              <Route
                path="/patient/appointments"
                element={<ProtectedRoute element={<PatientAppointments />} allowedRoles={["patient"]} />}
              />
              <Route
                path="/patient/chat"
                element={<ProtectedRoute element={<PatientChat />} allowedRoles={["patient"]} />}
              />

              {/* Doctor Routes */}
              <Route
                path="/doctor/dashboard"
                element={<ProtectedRoute element={<DoctorDashboard />} allowedRoles={["doctor"]} />}
              />
              <Route
                path="/doctor/patients"
                element={<ProtectedRoute element={<DoctorPatients />} allowedRoles={["doctor"]} />}
              />
              <Route
                path="/doctor/add-record"
                element={<ProtectedRoute element={<DoctorAddRecord />} allowedRoles={["doctor"]} />}
              />
              <Route
                path="/doctor/appointments"
                element={<ProtectedRoute element={<DoctorAppointments />} allowedRoles={["doctor"]} />}
              />

              {/* Admin Routes */}
              <Route
                path="/admin/dashboard"
                element={<ProtectedRoute element={<AdminDashboard />} allowedRoles={["admin"]} />}
              />
              <Route
                path="/admin/doctors"
                element={<ProtectedRoute element={<AdminDoctors />} allowedRoles={["admin"]} />}
              />
              <Route
                path="/admin/add-doctor"
                element={<ProtectedRoute element={<AdminAddDoctor />} allowedRoles={["admin"]} />}
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App

