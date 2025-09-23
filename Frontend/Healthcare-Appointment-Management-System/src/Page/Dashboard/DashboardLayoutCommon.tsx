import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import assetsData from "../../assets/assetsData.ts";

import {
  Home,
  LogOut,
  User,
  Bell,
  Menu,
  X,
} from "lucide-react";


import DocNotification from "../../Components/Dashboard/doctor/DocNotification.tsx";
import NotificationCard from "../../Components/Dashboard/Patient/Notification/NotificationCard.tsx";
import DocAppointments from "../../Components/Dashboard/doctor/DocAppointments.tsx";
import DocAvailability from "../../Components/Dashboard/doctor/DocAvailability.tsx";
import DocPatientHistory from "../../Components/Dashboard/doctor/Mypatients.tsx";
import DoctorProfileCard from "../../Components/Dashboard/doctor/DoctorProfileCard.tsx";
import Appointments from "../../Components/Dashboard/Patient/Appointment/Appointments.tsx";
import DoctorAvailability from "../../Components/Dashboard/Patient/Availability/DoctorAvailability.tsx";
import Consultations from "../../Components/Dashboard/Patient/Consultant/Consultation.tsx";
import PatientProfileCard from "../../Components/Dashboard/Patient/Profile/PatientProfileCard.tsx";

import { useAuth } from "../../Context/AuthContext.tsx";

import './Doctor_dashboard.css'
import DoctorPatientPanel from "../../Components/Dashboard/doctor/DoctorPatientPanel.tsx";

const DashboardLayoutCommon: React.FC = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();
  const notificationRef = useRef<HTMLDivElement>(null);

  const { user, logout } = useAuth(); // user.role: "ROLE_DOCTOR" | "ROLE_PATIENT"

  const logoutHandler = () => {
    logout();
    toast.success("Logout successful");
    navigate("/");
  };

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard__header">
        <div className="dashboard__header-left">
          <button
            className="dashboard__menu-toggle"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Menu size={24} />
          </button>
          <h1 className="dashboard__title">Healthcare Dashboard</h1>
        </div>

        <div className="dashboard__header-right">
          <div className="dashboard__notification" ref={notificationRef}>
            <button
              className="dashboard__notification-btn"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell size={24} />
              <span className="dashboard__notification-badge">3</span>
            </button>

            {showNotifications && (
              <div className="dashboard__notification-dropdown">
                {user?.role === "ROLE_DOCTOR" ? (
                  <DocNotification />
                ) : (
                  <NotificationCard />
                )}
              </div>
            )}
          </div>
          <div className="dashboard__user-profile">
            <User size={24} />
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={`dashboard__sidebar ${isSidebarOpen ? "dashboard__sidebar--open" : ""}`}
      >
        <div className="dashboard__sidebar-header">
          <div className="dashboard__sidebar-logo">
            <Link to="/">
              <img src={assetsData.logo} alt="Healthcare Logo" />
              <span>HealthCare</span>
            </Link>
          </div>
          <button 
            className="dashboard__sidebar-close" 
            onClick={() => setIsSidebarOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        <nav className="dashboard__sidebar-nav">
          <ul className="dashboard__sidebar-list">
            <li
              className={`dashboard__sidebar-item ${activeTab === "dashboard" ? "dashboard__sidebar-item--active" : ""}`}
              onClick={() => setActiveTab("dashboard")}
            >
              <Home size={20} />
              <span>Dashboard</span>
            </li>

            <li
              className={`dashboard__sidebar-item ${activeTab === "profile" ? "dashboard__sidebar-item--active" : ""}`}
              onClick={() => setActiveTab("profile")}
            >
              <User size={20} />
              <span>Profile</span>
            </li>

            <li 
              className="dashboard__sidebar-item dashboard__sidebar-item--logout" 
              onClick={logoutHandler}
            >
              <LogOut size={20} />
              <span>Logout</span>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="dashboard__sidebar-overlay"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <main className="dashboard__main">
        {/* Doctor Dashboard */}
        {user?.role === "ROLE_DOCTOR" && (
          <>
            {activeTab === "dashboard" && (
              <div className="dashboard__content">
                <div className="dashboard__grid dashboard__grid--doctor">
                  <div className="dashboard__grid-card dashboard__grid-card--appointments">
                    <DocAppointments />
                  </div>
                  <div className="dashboard__grid-card dashboard__grid-card--availability">
                    < DocAvailability/>
                  </div>
                  <div className="dashboard__grid-card dashboard__grid-card--full-width">
                    <DoctorPatientPanel />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "profile" && (
              <div className="dashboard__content">
                <div className="dashboard__grid">
                  <div className="dashboard__grid-card dashboard__grid-card--full-width">
                    <DoctorProfileCard />
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Patient Dashboard */}
        {user?.role === "ROLE_PATIENT" && (
          <>
            {activeTab === "dashboard" && (
              <div className="dashboard__content">
                <div className="dashboard__grid dashboard__grid--patient">
                  <div className="dashboard__grid-card dashboard__grid-card--appointments">
                    <Appointments />
                  </div>
                  <div className="dashboard__grid-card dashboard__grid-card--consultations">
                    <Consultations />
                  </div>
                  <div className="dashboard__grid-card dashboard__grid-card--full-width">
                    <DoctorAvailability />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "profile" && (
              <div className="dashboard__content">
                <div className="dashboard__grid">
                  <div className="dashboard__grid-card dashboard__grid-card--full-width">
                    <PatientProfileCard />
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="dashboard__footer">
        <p>© 2024 Healthcare - All rights reserved</p>
      </footer>
    </div>
  );
};

export default DashboardLayoutCommon;