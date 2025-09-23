import axiosInstance from "../utils/axios";
import type {
  AuthResponse,
  LoginPayload,
  RegisterPatientPayload,
} from "./types";

const registerPatient = async (
  payload: RegisterPatientPayload
): Promise<AuthResponse> => {
  try {
    const response = await axiosInstance.post(
      "/auth/register-patient",
      payload
    );
    return response.data.data;
  } catch (error: any) {
    // Return a consistent error object
    return Promise.reject(
      error.response?.data || { message: "Registration failed" }
    );
  }
};

const registerDoctor = async (
  payload: RegisterPatientPayload
): Promise<AuthResponse> => {
  try {
    const response = await axiosInstance.post("/auth/register-doctor", payload);
    return response.data.data;
  } catch (error: any) {
    return Promise.reject(
      error.response?.data || { message: "Registration failed" }
    );
  }
};

const login = async (credentials: LoginPayload): Promise<AuthResponse> => {
  try {
    const response = await axiosInstance.post(
      "/auth/public/signin",
      credentials
    );
    const { status, token, user, message } = response.data || {};
    if (!status || !token || !user) {
      return Promise.reject({ message: message || "Login failed" });
    }
    // Map backend response to AuthResponse shape expected by app
    return {
      accessToken: token,
      expiresIn: 3600,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  } catch (error: any) {
    return Promise.reject(error.response?.data || { message: "Login failed" });
  }
};

const logout = async (): Promise<string> => {
  try {
    const response = await axiosInstance.post("/auth/logout");
    //remove user from loaclstorage
    localStorage.removeItem("user");
    return response.data.data;
  } catch (error: any) {
    return Promise.reject(error.response?.data || { message: "Logout failed" });
  }
};

const refreshToken = async (): Promise<AuthResponse> => {
  try {
    console.log("authContext - refreshToken called");
    const response = await axiosInstance.post("/auth/refresh");
    return response.data.data;
  } catch (error: any) {
    console.log("authContext - refreshToken error", error);
    return Promise.reject(
      error.response?.data || { message: "Token refresh failed" }
    );
  }
};

export { registerPatient, registerDoctor, login, logout, refreshToken };
