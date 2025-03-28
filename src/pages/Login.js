"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import "./Login.css"

const Login = () => {
  const { web3, contract, account, userRole } = useAuth()
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState(null)
  const [registrationMode, setRegistrationMode] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "male",
  })
  const navigate = useNavigate()

  useEffect(() => {
    // If user is already logged in, redirect to appropriate dashboard
    if (account && userRole) {
      redirectToDashboard()
    }
  }, [account, userRole])

  const redirectToDashboard = () => {
    if (userRole === "admin") {
      navigate("/admin/dashboard")
    } else if (userRole === "doctor") {
      navigate("/doctor/dashboard")
    } else if (userRole === "patient") {
      navigate("/patient/dashboard")
    }
  }

  const connectWallet = async () => {
    setIsConnecting(true)
    setError(null)

    try {
      if (window.ethereum) {
        await window.ethereum.request({ method: "eth_requestAccounts" })
        window.location.reload() // Reload to update context
      } else {
        throw new Error("MetaMask is not installed")
      }
    } catch (err) {
      console.error("Error connecting to MetaMask", err)
      setError(err.message || "Failed to connect to MetaMask")
    } finally {
      setIsConnecting(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const registerAsPatient = async (e) => {
    e.preventDefault()
    setError(null)

    try {
      if (!contract || !account) {
        throw new Error("Contract or account not available")
      }

      // Call the smart contract to register as a patient
      await contract.methods
        .registerPatient(formData.name, Number.parseInt(formData.age), formData.gender)
        .send({ from: account })

      // Redirect to patient dashboard after successful registration
      navigate("/patient/dashboard")
    } catch (err) {
      console.error("Error registering as patient:", err)
      setError(err.message || "Failed to register as patient")
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2 className="login-title">{registrationMode ? "Register as Patient" : "Login to MediChain"}</h2>
          <p className="login-subtitle">
            {registrationMode
              ? "Create your patient account on the blockchain"
              : "Connect with MetaMask to access the hospital management system"}
          </p>
        </div>

        {error && (
          <div className="alert alert-danger">
            <i className="fas fa-exclamation-circle"></i> {error}
          </div>
        )}

        {!account ? (
          <div className="metamask-section">
            <div className="metamask-logo">
              <img src="/images/metamask-logo.png" alt="MetaMask" />
            </div>
            <button className="btn btn-primary btn-block" onClick={connectWallet} disabled={isConnecting}>
              {isConnecting ? "Connecting..." : "Connect with MetaMask"}
            </button>
            <p className="metamask-info">
              <i className="fas fa-info-circle"></i> You need MetaMask to use this application.
              {!window.ethereum && (
                <a
                  href="https://metamask.io/download/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="metamask-download"
                >
                  Download MetaMask
                </a>
              )}
            </p>
          </div>
        ) : registrationMode ? (
          <form className="registration-form" onSubmit={registerAsPatient}>
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-control"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="age" className="form-label">
                Age
              </label>
              <input
                type="number"
                id="age"
                name="age"
                className="form-control"
                value={formData.age}
                onChange={handleInputChange}
                required
                min="1"
                max="120"
              />
            </div>

            <div className="form-group">
              <label htmlFor="gender" className="form-label">
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                className="form-select"
                value={formData.gender}
                onChange={handleInputChange}
                required
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary btn-block">
              Register
            </button>

            <button type="button" className="btn btn-outline btn-block mt-3" onClick={() => setRegistrationMode(false)}>
              Back to Login
            </button>
          </form>
        ) : userRole === "unregistered" ? (
          <div className="unregistered-section">
            <p className="unregistered-message">Your wallet is connected, but you're not registered in the system.</p>
            <button className="btn btn-primary btn-block" onClick={() => setRegistrationMode(true)}>
              Register as Patient
            </button>
            <p className="unregistered-info">
              <i className="fas fa-info-circle"></i> Only patients can self-register. Doctors must be added by an admin.
            </p>
          </div>
        ) : (
          <div className="redirect-section">
            <p className="redirect-message">You're already logged in as {userRole}. Redirecting to dashboard...</p>
            <div className="loading-spinner"></div>
            <button className="btn btn-primary btn-block mt-3" onClick={redirectToDashboard}>
              Go to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Login

