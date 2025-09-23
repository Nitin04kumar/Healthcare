import axiosInstance from "../utils/axios";

const getPatientById = async (id: number | string) => {
    console.log("Patient profile api called");
  const accessToken = localStorage.getItem('token');
  const response = await axiosInstance.get(`/patient/${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  console.log(response.data);
  return response.data;
};


const updatePatientProfile = async (id: number | string, data: any) => {
  const accessToken = localStorage.getItem('token');
  const response = await axiosInstance.put(`/patients/${id}`, data, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};

export {getPatientById, updatePatientProfile}