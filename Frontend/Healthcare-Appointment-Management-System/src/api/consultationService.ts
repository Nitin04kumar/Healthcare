import axiosInstance from "../utils/axios";
import type { Consultation, CreateConsultationPayload } from "./types";


/**
 * Creates a new consultation record for a specific appointment.
 * @param appointmentId The ID of the appointment.
 * @param payload The consultation details.
 */
export const createConsultation = async (
  appointmentId: number,
  payload: CreateConsultationPayload
): Promise<Consultation> => {
  const response = await axiosInstance.post(`/api/consultations/${appointmentId}`, payload);
  return response.data.data;
};

/**
 * Fetches the consultation details for a specific appointment.
 * Can be called by either the patient or the doctor involved.
 * @param appointmentId The ID of the appointment.
 */
export const getConsultationForAppointment = async (appointmentId: number): Promise<Consultation> => {
  const response = await axiosInstance.get(`/api/consultations/appointment/${appointmentId}`);
  return response.data.data;
};

/**
 * Fetches a list of all past consultation records for the logged-in patient.
 */
export const getMyConsultations = async (): Promise<Consultation[]> => {
  const response = await axiosInstance.get('/api/patient-consultations');
  return response.data.data;
};