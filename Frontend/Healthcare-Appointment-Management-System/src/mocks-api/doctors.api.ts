import axiosInstance from "../utils/axios";

const getAllDoctors = async () => {
  const response = await axiosInstance.get("/doctors/all");
  console.log("Call api - all doctors")
  return response.data;
};


const getDoctorById = async (id: number | string) => {
  const accessToken = localStorage.getItem('token');
  const response = await axiosInstance.get(`/doctors/${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};

const updateProfile = async (id: number | string, data: any) => {
  const accessToken = localStorage.getItem('token');
  const response = await axiosInstance.put(`/doctors/${id}`, data, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};

export {getAllDoctors, getDoctorById, updateProfile}