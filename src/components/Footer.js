import "./Footer.css"

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3 className="footer-title">MediChain</h3>
          <p className="footer-description">
            Blockchain-powered healthcare management system for secure, transparent, and efficient medical record
            keeping.
          </p>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">Quick Links</h3>
          <ul className="footer-links">
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/login">Login</a>
            </li>
            <li>
              <a href="#about">About</a>
            </li>
            <li>
              <a href="#services">Services</a>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">Contact</h3>
          <ul className="footer-contact">
            <li>
              <i className="fas fa-map-marker-alt"></i> 123 Blockchain Ave, Digital City
            </li>
            <li>
              <i className="fas fa-phone"></i> +1 (555) 123-4567
            </li>
            <li>
              <i className="fas fa-envelope"></i> info@medichain.com
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} MediChain. All rights reserved.</p>
        <p>Powered by Ethereum Blockchain</p>
      </div>
    </footer>
  )
}

export default Footer

