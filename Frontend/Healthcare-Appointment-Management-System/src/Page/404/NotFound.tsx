import type React from "react"


import "./NotFound.css"
import { Link } from "react-router-dom"
import Navbar from "../../Components/Navbar/Navbar"
import { AuthProvider } from "../../Context/AuthContext"

const NotFound:React.FC = ()=> {
  return (
    <AuthProvider>
      <div className="not-found-container">
        <Navbar />

        <main className="not-found-main">
          <div className="not-found-content">
            {/* 404 Illustration */}
            <div className="not-found-illustration">
              <div className="not-found-icon-container">
                <i className="fas fa-stethoscope not-found-icon"></i>
              </div>
              <h1 className="not-found-title">404</h1>
              <h2 className="not-found-subtitle">Page Not Found</h2>
            </div>

            {/* Error Message */}
            <div className="not-found-card">
              <p className="not-found-description">
                We're sorry, but the page you're looking for seems to have gone missing. This might happen if the page
                has been moved, deleted, or you've entered an incorrect URL.
              </p>

              <div className="not-found-grid">
                <div className="not-found-section">
                  <h3 className="not-found-section-title">What you can do:</h3>
                  <ul className="not-found-list">
                    <li>• Check the URL for typos</li>
                    <li>• Go back to the previous page</li>
                    <li>• Visit our homepage</li>
                    <li>• Contact our support team</li>
                  </ul>
                </div>

                {/* <div className="not-found-section">
                  <h3 className="not-found-section-title">Quick Links:</h3>
                  <ul className="not-found-links">
                    <li>
                      <Link to="/" className="not-found-link">
                        • Homepage
                      </Link>
                    </li>
                    <li>
                      <Link to="/services" className="not-found-link">
                        • Our Services
                      </Link>
                    </li>
                    <li>
                      <Link to="/about" className="not-found-link">
                        • About Us
                      </Link>
                    </li>
                    <li>
                      <Link to="/contact" className="not-found-link">
                        • Contact Support
                      </Link>
                    </li>
                  </ul>
                </div> */}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="not-found-actions">
              <button onClick={() => window.history.back()} className="not-found-button not-found-button-secondary">
                <i className="fas fa-arrow-left"></i>
                Go Back
              </button>

              <Link to="/" className="not-found-button not-found-button-primary">
                <i className="fas fa-home"></i>
                Return Home
              </Link>
            </div>

            {/* Additional Help */}
            <div className="not-found-help">
              <h3 className="not-found-help-title">Need Additional Help?</h3>
              <p className="not-found-help-description">
                Our healthcare support team is available 24/7 to assist you with any questions or concerns.
              </p>
              <div className="not-found-help-actions">
                <Link to="/contact" className="not-found-help-button not-found-help-button-primary">
                  <i className="fas fa-phone"></i>
                  Contact Support
                </Link>
                <Link to="/" className="not-found-help-button not-found-help-button-secondary">
                  <i className="fas fa-question-circle"></i>
                  Help Center
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </AuthProvider>
  )
}

export default NotFound;