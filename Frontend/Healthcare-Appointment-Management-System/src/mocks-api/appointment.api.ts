import axiosInstance from '../utils/axios';

export const getAppointmentsByDoctorId = async (doctorId: number | string) => {
  const accessToken = localStorage.getItem('token');
  console.log("getAppointmentsByDoctorId api called")
  const response = await axiosInstance.get(`/appointment/doctor/${doctorId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};

export const getAppointmentsByPatientId = async (patientId: number | string) => {
  const accessToken = localStorage.getItem('token');
  console.log("getAppointmentsByPatientId api called")
  const response = await axiosInstance.get(`/appointments/patient/${patientId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};

export const cancelAppointment = async (appointmentId: number | string, userId: number | string) => {
  const accessToken = localStorage.getItem('token');
  const response = await axiosInstance.post(`/appointment/cancel`, {
    appointmentId,
    userId,
  }, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};

// In your appointment.api file
export const bookAppointment = async (doctorId: number | string, date: string, time: string) => {
  try {
    const accessToken = localStorage.getItem('token');
    const response = await axiosInstance.post('/appointments', {
      doctorId,
      date,
      time,
    }, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

