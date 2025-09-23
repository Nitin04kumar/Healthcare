import React, { useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

import ProtectedRoute from "./Components/Protect/ProtectRoute";
import { useAuth } from "./Context/AuthContext";
import Home from "./Page/Home/Home";
import NotFound from "./Page/404/NotFound";
import LoginAuth from "./Components/Auth/Login/LoginAuth";
import PatientRegistration from "./Components/Auth/Register/Patient/PatientRegistration";
import DoctorRegister from "./Components/Auth/Register/Doctor/DoctorRegister";

import ConsultationForm from "./Components/ConsultationPage/ConsultationForm";
import DashboardLayoutCommon from "./Page/Dashboard/DashboardLayoutCommon";

const App: React.FC = () => {
  const { isLoggedIn, user, loading } = useAuth();

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <div className="app__container">
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Auth pages */}
        <Route
          path="/auth/login"
          element={
            isLoggedIn ? <Navigate to="/dashboard" replace /> : <LoginAuth />
          }
        />
        <Route
          path="/auth/register"
          element={
            isLoggedIn ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <PatientRegistration />
            )
          }
        />
        <Route
          path="/doctor/register"
          element={
            isLoggedIn ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <DoctorRegister />
            )
          }
        />

        {/* Consultation Page */}
        <Route
          path="/consultation/:appointmentId"
          element={<ConsultationForm />}
        />

        {/* Common Dashboard Layout with role passed as prop */}
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute allowedRole={user?.role}>
              <DashboardLayoutCommon role={user?.role} />
            </ProtectedRoute>
          }
        />

        {/* Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default App;
