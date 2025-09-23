import axiosInstance from "../utils/axios";

export interface LoginCredential {
  email: string;
  password: string;
}

export interface LogoutCredential {
  refreshToken: string
}

const loginUser = async (credential: LoginCredential): Promise<any> => {
  try {
    const response = await axiosInstance.post("/auth/login", credential);
    console.log("auth api: ",response)
    return response.data;
  } catch (error: any) {
    console.log("Error at auth api", error);
    throw error?.response?.data?.message || "Login failed";
  }
};


const logOutuser = async (credential: LogoutCredential): Promise<any> => {
    try {
        const response = await axiosInstance.post("/auth/logout", credential);
        console.log(response);
        return response.data;
    } catch (error: any) {
        console.log("Error logout", error);
        throw error?.response?.data?.message || "logout failed";
    }
}


export { loginUser, logOutuser }