import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";

import type { UserInfo } from "../../api/types";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRole: UserInfo["role"]; // This uses 'ROLE_PATIENT' | 'ROLE_DOCTOR'
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRole,
}) => {
  const { isLoggedIn, user, loading } = useAuth();

  // If the user is not logged in, redirect to the login page
  //`replace` prevents going back to protected page after logout
  if (!isLoggedIn || !user) {
    return <Navigate to="/auth/login" replace />;
  }

  // If the user's role does not match the required role, redirect
  // This check will now work correctly.
  if (user.role !== allowedRole) {
    // It's good practice to have a dedicated unauthorized page
    return <Navigate to="/unauthorized" replace />;
  }

  // If all checks pass, render the protected component
  return <>{children}</>;
};

export default ProtectedRoute;
