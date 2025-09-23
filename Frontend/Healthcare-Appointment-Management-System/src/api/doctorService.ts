import type { ChangePasswordPayload, CreateAvailabilityPayload, DoctorAvailability, DoctorProfile, PatientForDoctor, PatientHistory, UpdateAvailabilityPayload, UpdateDoctorProfilePayload } from "./types";
import axiosInstance from "../utils/axios";
const getPublicDoctors = async (): Promise<DoctorProfile[]> => {
    const response = await axiosInstance.get('/api/doctors/top-rated');
    return response.data.data;
}

// Fetches the full profile for the currently logged-in doctor
const getMyDoctorProfile = async (): Promise<DoctorProfile> => {
  const response = await axiosInstance.get('/api/doctors/me');
  return response.data.data;
};

// Updates the profile for the currently logged-in doctor
const updateMyDoctorProfile = async (payload: UpdateDoctorProfilePayload): Promise<DoctorProfile> => {
  const response = await axiosInstance.put('/api/doctors/me', payload);
  return response.data.data;
};

// Changes the password for the currently logged-in doctor
const changeMyPassword = async (payload: ChangePasswordPayload): Promise<string> => {
  const response = await axiosInstance.patch('/api/doctors/me/change-password', payload);
  return response.data.data;
};

/**
 * Creates a new availability slot for the logged-in doctor.
 */
const addDoctorAvailability = async (payload: CreateAvailabilityPayload): Promise<DoctorAvailability> => {
  const response = await axiosInstance.post('/api/doctors/availability', payload);
  return response.data.data;
};

/**
 * Fetches all availability slots for the logged-in doctor for a specific date.
 */
const getDoctorAvailabilityForDate = async (date: string): Promise<DoctorAvailability[]> => {
  const response = await axiosInstance.get('/api/doctors/availability', {
    params: { date } // e.g., date = "2025-09-17"
  });
  return response.data.data;
};

/**
 * Updates an existing availability slot (e.g., to mark it as unavailable).
 */
const updateDoctorAvailability = async (availabilityId: number, payload: UpdateAvailabilityPayload): Promise<DoctorAvailability> => {
  const response = await axiosInstance.patch(`/api/doctors/availability/${availabilityId}`, payload);
  return response.data.data;
};

/**
 * Gets all availability slots for the logged-in doctor.
 */
const getAllDoctorAvailability = async (): Promise<DoctorAvailability[]> => {
  const response = await axiosInstance.get('/api/doctors/availability/all');
  return response.data.data;
}

/**
 * Deletes an availability slot for the logged-in doctor.
 */
const deleteDoctorAvailability = async (availabilityId: number): Promise<string> => {
  const response = await axiosInstance.delete(`/api/doctors/availability/${availabilityId}`);
  return response.data.data;
};

/**
 * Fetches a list of all patients associated with the logged-in doctor.
 */
const getAssociatedPatients = async (): Promise<PatientForDoctor[]> => {
  const response = await axiosInstance.get('/api/doctor-panel/patients');
  return response.data.data;
};

/**
 * Fetches the complete medical history of a specific patient for the logged-in doctor.
 * @param patientId The ID of the patient.
 */
const getPatientHistory = async (patientId: number): Promise<PatientHistory> => {
  const response = await axiosInstance.get(`/api/doctor-panel/patients/${patientId}/history`);
  return response.data.data;
};

export { getPublicDoctors, 
  getMyDoctorProfile, 
  updateMyDoctorProfile, 
  changeMyPassword, 
  addDoctorAvailability, 
  getDoctorAvailabilityForDate, 
  updateDoctorAvailability, 
  deleteDoctorAvailability, 
  getAllDoctorAvailability,
  getAssociatedPatients,
  getPatientHistory 

};