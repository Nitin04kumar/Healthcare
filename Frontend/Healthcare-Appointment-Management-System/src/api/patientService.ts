import axiosInstance from '../utils/axios';
import type { Appointment, BookAppointmentPayload, DoctorPublicProfile, PatientProfile, UpdatePatientProfilePayload } from './types';


/**
 * Fetches the full profile for the currently logged-in patient.
 */
const getMyPatientProfile = async (): Promise<PatientProfile> => {
  const response = await axiosInstance.get('/api/patients/me');
  return response.data.data;
};

/**
 * Updates the profile for the currently logged-in patient.
 */
const updateMyPatientProfile = async (payload: UpdatePatientProfilePayload): Promise<PatientProfile> => {
  const response = await axiosInstance.put('/api/patients/me', payload);
  return response.data.data;
};

/**
 * Fetches a list of all doctors with their public profiles and availability.
 */
const getAllDoctors = async (): Promise<DoctorPublicProfile[]> => {
  const response = await axiosInstance.get('/api/doctors/all');
  return response.data.data;
};

/**
 * Books a new appointment for the logged-in patient.
 */
const bookAppointment = async (payload: BookAppointmentPayload): Promise<Appointment> => {
  const response = await axiosInstance.post('/api/appointments/book', payload);
  return response.data.data;
};


export { getMyPatientProfile, updateMyPatientProfile, getAllDoctors, bookAppointment };