"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import "./Navbar.css"

const Navbar = ({ account, userRole }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const getDashboardLink = () => {
    if (userRole === "admin") return "/admin/dashboard"
    if (userRole === "doctor") return "/doctor/dashboard"
    if (userRole === "patient") return "/patient/dashboard"
    return "/login"
  }

  const truncateAddress = (address) => {
    if (!address) return ""
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">⚕️</span>
          <span className="logo-text">MediChain</span>
        </Link>

        <div className="menu-icon" onClick={toggleMenu}>
          <i className={isMenuOpen ? "fas fa-times" : "fas fa-bars"}></i>
        </div>

        <ul className={isMenuOpen ? "nav-menu active" : "nav-menu"}>
          <li className="nav-item">
            <Link to="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>
          </li>

          {account ? (
            <>
              <li className="nav-item">
                <Link to={getDashboardLink()} className="nav-link" onClick={() => setIsMenuOpen(false)}>
                  Dashboard
                </Link>
              </li>

              {userRole === "patient" && (
                <>
                  <li className="nav-item">
                    <Link to="/patient/records" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                      My Records
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/patient/appointments" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                      Appointments
                    </Link>
                  </li>
                </>
              )}

              {userRole === "doctor" && (
                <>
                  <li className="nav-item">
                    <Link to="/doctor/patients" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                      Patients
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/doctor/appointments" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                      Appointments
                    </Link>
                  </li>
                </>
              )}

              {userRole === "admin" && (
                <>
                  <li className="nav-item">
                    <Link to="/admin/doctors" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                      Manage Doctors
                    </Link>
                  </li>
                </>
              )}
            </>
          ) : (
            <li className="nav-item">
              <Link to="/login" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                Login
              </Link>
            </li>
          )}
        </ul>

        {account && (
          <div className="wallet-info">
            <div className="wallet-address">
              <span className="address-label">Connected:</span>
              <span className="address-value">{truncateAddress(account)}</span>
            </div>
            {userRole && (
              <div className="user-role">
                <span className={`role-badge role-${userRole}`}>
                  {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar

