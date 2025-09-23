import axiosInstance from "../utils/axios";
import type { Appointment, BookAppointmentPayload, UpdateAppointmentPayload, UpdateAppointmentStatusPayload } from "./types";

/**
 * Books a new appointment for the logged-in patient.
 */
const bookAppointment = async (payload: BookAppointmentPayload): Promise<Appointment> => {
  const response = await axiosInstance.post('/api/appointments/book', payload);
  return response.data.data;
};

/**
 * Fetches all appointments for the currently logged-in doctor.
 */
const getDoctorAppointments = async (): Promise<Appointment[]> => {
  const response = await axiosInstance.get('/api/appointments/doctor');
  return response.data.data;
};

/**
 * Updates the status of a specific appointment (e.g., to accept or decline).
 * @param appointmentId The ID of the appointment to update.
 * @param payload The new status.
 */
const updateAppointmentStatus = async (
  appointmentId: number,
  payload: UpdateAppointmentStatusPayload
): Promise<Appointment> => {
  const response = await axiosInstance.patch(`/api/appointments/${appointmentId}/status`, payload);
  return response.data.data;
};

/**
 * Fetches all upcoming appointments for the logged-in patient.
 */
const getUpcomingPatientAppointments = async (): Promise<Appointment[]> => {
  const response = await axiosInstance.get('/api/patient-appointments/upcoming');
  return response.data.data;
};

/**
 * Fetches the appointment history for the logged-in patient.
 */
const getPatientAppointmentHistory = async (): Promise<Appointment[]> => {
  const response = await axiosInstance.get('/api/patient-appointments/history');
  return response.data.data;
};

/**
 * Updates the reason for a specific appointment.
 * @param appointmentId The ID of the appointment to update.
 * @param payload The new reason.
 */
const updateAppointmentReason = async (
  appointmentId: number,
  payload: UpdateAppointmentPayload
): Promise<Appointment> => {
  const response = await axiosInstance.patch(`/api/patient-appointments/${appointmentId}/reason`, payload);
  return response.data.data;
};

/**
 * Allows a patient to cancel their own appointment.
 */
const cancelPatientAppointment = async (appointmentId: number): Promise<Appointment> => {
    const response = await axiosInstance.patch(`/api/patient-appointments/${appointmentId}/cancel`);
    return response.data.data;
};

export { bookAppointment, getDoctorAppointments, updateAppointmentStatus, getUpcomingPatientAppointments, getPatientAppointmentHistory, updateAppointmentReason, cancelPatientAppointment };