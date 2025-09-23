import React, { useEffect, useState, useRef } from "react";
import "./Navbar.css";
import { useAuth } from "../../Context/AuthContext";
import assetsData from "../../assets/assetsData";
import { Link, useNavigate } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
// import { logOutuser } from "../../mocks-api/auth.api";



const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [color, setColor] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const { isLoggedIn, logout, user } = useAuth();
  // console.log(user)

  const handleScroll = () => {
    setColor(window.scrollY > 10);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen((prev) => !prev);
  };

  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    setIsProfileDropdownOpen(false);
    navigate('/');
  };

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMenuOpen]);

  return (
    <nav className={color ? "navbar-bg navbar" : "navbar"}>
      {/* Logo */}
      <Link to={"/"}>
        <div className="navbar__logo-container--left">
          <img
            className="navbar__logo"
            src={assetsData.logo || "/placeholder.svg"}
            alt="Logo"
          />
          <p className="logo__name font-secondary">
            <span className={`logo-span-text ${color ? "scrolled" : ""}`}>
              
            </span>{" "}
            Health care.
          </p>
        </div>
      </Link>

      {/* Desktop Menu */}
      <ul className="navbar__menu--mid desktop-only">
        
          <li className={`navbar__menu-item ${color ? "scrolled" : ""}`}>
          <ScrollLink to="home" smooth={true} duration={500} offset={-60}>
            Home
          </ScrollLink>
          </li>
          <li className={`navbar__menu-item ${color ? "scrolled" : ""}`}>

          <ScrollLink to="about" smooth={true} duration={500} offset={-60}>
            About
          </ScrollLink>
          </li>

          <li className={`navbar__menu-item ${color ? "scrolled" : ""}`}>
          <ScrollLink to="department" smooth={true} duration={500} offset={-60}>
            Department
          </ScrollLink>
          </li>
          <li className={`navbar__menu-item ${color ? "scrolled" : ""}`}>
          <ScrollLink to="contact" smooth={true} duration={500} offset={-60}>
            Contact
          </ScrollLink>
          </li>
      </ul>

      {/* Right Side */}
      {isLoggedIn ? (
        <div className="navbar__auth--right desktop-only">
          <Link to="/dashboard">
            <button className="dashboard-btn">Dashboard</button>
          </Link>
          <div className="navbar__profile-container" ref={profileRef}>
              <img
                src={user?.demo_image || assetsData.profile1}
                alt="Profile"
                className="navbar__profile-pic"
                onClick={toggleProfileDropdown}
              />
            <div
              className={`navbar__profile-dropdown ${
                isProfileDropdownOpen ? "show" : ""
              }`}
            >
              <div className="profile-info">
                <p className="profile-name">{user?.name || "User"}</p>
                <span className="profile-email">
                  {user?.email || "user@example.com"}
                </span>
              </div>
              <div className="profile-actions">
                <Link
                  to="/profile"
                  onClick={() => setIsProfileDropdownOpen(false)}
                >
                  <button className="profile-btn">Profile</button>
                </Link>
                <button className="logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <ul className="navbar__auth--right desktop-only">
          {/* <li className="navbar__auth-item notification">
            <i className="fas fa-bell notification-icon"></i>
          </li> */}
          <Link to="/auth/login">
            <li className="navbar__auth-item login-btn">Login</li>
          </Link>
          <Link to="/auth/register">
            <li className="navbar__auth-item register-btn">Register</li>
          </Link>
        </ul>
      )}

      {/* Hamburger Menu Icon */}
      <div className="navbar__menu-toggle" onClick={toggleMenu}>
        <i className={isMenuOpen ? "fas fa-times" : "fas fa-bars"}></i>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="navbar__collapsed-menu mobile-only">
          <ul className="navbar__menu--mid mobile-menu">
            <Link to="/home" onClick={() => setIsMenuOpen(false)}>
              <li className="navbar__menu-item mobile-menu-item">
                <i className="fas fa-home"></i>
                <span>Home</span>
              </li>
            </Link>
            <Link to="/about" onClick={() => setIsMenuOpen(false)}>
              <li className="navbar__menu-item mobile-menu-item">
                <i className="fas fa-info-circle"></i>
                <span>About</span>
              </li>
            </Link>
            <Link to="/departments" onClick={() => setIsMenuOpen(false)}>
              <li className="navbar__menu-item mobile-menu-item">
                <i className="fas fa-building"></i>
                <span>Departments</span>
              </li>
            </Link>
            <Link to="/contact" onClick={() => setIsMenuOpen(false)}>
              <li className="navbar__menu-item mobile-menu-item">
                <i className="fas fa-phone"></i>
                <span>Contact</span>
              </li>
            </Link>
          </ul>

          <div className="mobile-auth-section">
            {isLoggedIn ? (
              <div className="mobile-profile-section">
                <div className="mobile-profile-info">
                  <img
                    src={user?.demo_image || assetsData.profile1}
                    alt="Profile"
                    className="mobile-profile-pic"
                  />
                  <div className="mobile-profile-text">
                    <p className="mobile-profile-name">
                      {user?.name || "User"}
                    </p>
                    <span className="mobile-profile-email">
                      {user?.email || "user@example.com"}
                    </span>
                  </div>
                </div>
                <div className="mobile-profile-actions">
                  <Link
                    to="/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <button className="mobile-dashboard-btn">
                      <i className="fas fa-tachometer-alt"></i>
                      Dashboard
                    </button>
                  </Link>
                  <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                    <button className="mobile-profile-btn">
                      <i className="fas fa-user"></i>
                      Profile
                    </button>
                  </Link>
                  <button className="mobile-logout-btn" onClick={handleLogout}>
                    <i className="fas fa-sign-out-alt"></i>
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="mobile-auth-buttons">
                <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                  <button className="mobile-login-btn">
                    <i className="fas fa-sign-in-alt"></i>
                    Login
                  </button>
                </Link>
                <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                  <button className="mobile-register-btn">
                    <i className="fas fa-user-plus"></i>
                    Register
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
