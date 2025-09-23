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

import DoctorProfileCard from "../../Components/Dashboard/doctor/DoctorProfileCard.tsx";
import DoctorAvailability from "../../Components/Dashboard/doctor/DocAvailability.tsx";
import Appointment from "../../Components/Dashboard/doctor/DocAppointments.tsx";
import PatientHistory from "../../Components/Dashboard/doctor/Mypatients.tsx";
import NotificationPanel from "../../Components/Dashboard/doctor/DocNotification.tsx";

import ProfileCard from "../../Components/Dashboard/Patient/Profile/PatientProfileCard.tsx";
import DoctorAvailabilityPatient from "../../Components/Dashboard/Patient/Availability/DoctorAvailability.tsx";
import NotificationCard from "../../Components/Dashboard/Patient/Notification/NotificationCard.tsx";
import AppointmentsPatient from "../../Components/Dashboard/Patient/Appointment/Appointments.tsx";
import Consultations from "../../Components/Dashboard/Patient/Consultant/Consultation.tsx";

import "./Doctor_dashboard.css"; // You can keep a common css file instead
import { logout } from "../../api/authService.ts";
import { useAuth } from "../../Context/AuthContext.tsx";

const DashboardLayoutCommon: React.FC = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();
  const notificationRef = useRef<HTMLDivElement>(null);

  const { user } = useAuth(); // user should have role: "doctor" | "patient"

  const logoutHandler = async () => {
    await logout();
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
    <div className="doctor-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <button className="menu-toggle" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <Menu size={24} />
          </button>
          <h1>Healthcare Dashboard</h1>
        </div>

        <div className="header-right">
          <div className="notification-container" ref={notificationRef}>
            <button
              className="notification-btn"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell size={24} />
              <span className="notification-badge">3</span>
            </button>

            {showNotifications && (
              <div className="notification-dropdown">
                <NotificationPanel />
              </div>
            )}
          </div>
          <div className="user-profile">
            <User size={24} />
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside className={`dashboard-sidebar ${isSidebarOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <Link to="/">
              <img src={assetsData.logo} alt="Healthcare Logo" />
              <span>HealthCare</span>
            </Link>
          </div>
          <button className="sidebar-close" onClick={() => setIsSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <ul>
            <li
              className={activeTab === "dashboard" ? "active" : ""}
              onClick={() => setActiveTab("dashboard")}
            >
              <Home size={20} />
              <span>Dashboard</span>
            </li>

            <li
              className={activeTab === "profile" ? "active" : ""}
              onClick={() => setActiveTab("profile")}
            >
              <User size={20} />
              <span>Profile</span>
            </li>

            <li className="logout-btn" onClick={logoutHandler}>
              <LogOut size={20} />
              <span>Logout</span>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Overlay for mobile */}
      {isSidebarOpen && <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>}

      {/* Main Content (Role-based Rendering) */}
      <main className="dashboard-main">
        {user?.role === "doctor" ? (
          <>
            {activeTab === "dashboard" && (
              <div className="dashboard-content">
                <div className="content-grid">
                  <div className="grid-card appointments-card">
                    <Appointment />
                  </div>
                  <div className="grid-card availability-card">
                    <DoctorAvailability />
                  </div>
                  <div className="grid-card patient-history-card">
                    <PatientHistory />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "profile" && (
              <div className="dashboard-content">
                <div className="content-grid">
                  <div className="grid-card full-width">
                    <DoctorProfileCard />
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            {activeTab === "dashboard" && (
              <div className="dashboard-content">
                <div className="content-grid">
                  <div className="grid-card cards-1">
                    <ProfileCard />
                  </div>
                  <div className="grid-card cards-2">
                    <Consultations />
                  </div>
                  <div className="grid-card cards-3">
                    <NotificationCard />
                  </div>
                  <div className="grid-card cards-4">
                    <AppointmentsPatient />
                  </div>
                  <div className="grid-card cards-5">
                    <DoctorAvailabilityPatient />
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="dashboard-footer">
        <p>© 2024 Healthcare - All rights reserved</p>
      </footer>
    </div>
  );
};

export default DashboardLayoutCommon;
