// ===================================================================
// AUTHENTICATION & USER TYPES
// ===================================================================

/**
 * Matches the UserInfoDto from the backend.
 * Represents the core user information returned after login/registration.
 */
export interface UserInfo {
  id: number;
  email: string;
  role: 'ROLE_PATIENT' | 'ROLE_DOCTOR';
}

/**
 * Matches the AuthResponseDto from the backend.
 * This is the shape of the data object in a successful auth response.
 */
export interface AuthResponse {
  accessToken: string;
  expiresIn: number;
  user: UserInfo;
}

// ===================================================================
// API PAYLOAD TYPES (Data sent TO the backend)
// ===================================================================

/**
 * Matches the LoginRequestDto from the backend.
 * Used for the login endpoint.
 */
export interface LoginPayload {
  email: string;
  password: string;
}

/**
 * Matches the RegisterPatientDto from the backend.
 * Used for the patient registration endpoint.
 */
export interface RegisterPatientPayload {
  email: string;
  password: string;
  name: string;
  age: number;
  dob: string; // Should be in "YYYY-MM-DD" format
  bloodGroup: string;
  phoneNumber: number;
  address: string;
  gender: 'Male' | 'Female' | 'Other';
}

/**
 * Matches the RegisterDoctorDto from the backend.
 * Used for the doctor registration endpoint.
 */
export interface RegisterDoctorPayload {
  email: string;
  password: string;
  name: string;
  specialization: string;
  exp: number;
  qualification: string;
  rating: number;
}

// ===================================================================
// DOMAIN-SPECIFIC TYPES (Profiles, Appointments, etc.)
// ===================================================================

/**
 * Represents the full Patient profile data from the backend.
 */
export interface PatientProfile {
  id: number;
  name: string;
  age: number;
  dob: string; // "YYYY-MM-DD"
  bloodGroup: string;
  phoneNumber: number;
  address: string;
  gender: 'Male' | 'Female' | 'Other';
  user: UserInfo; // The linked user account
}

/**
 * Represents the full Doctor profile data from the backend.
 */
export interface DoctorProfile {
  id: number;
  name: string;
  specialization: string;
  exp: number;
  qualification: string;
  rating: number;
  user: UserInfo; // The linked user account
}

/**
 * Payload for a doctor to set their availability.
 */
export interface SetAvailabilityPayload {
  date: string; // "YYYY-MM-DD"
  timeSlot: string; // e.g., "10:00-10:30"
  isAvailable: boolean;
}

/**
 * Represents a Doctor's availability slot from the backend.
 */
export interface DoctorAvailability {
  availabilityId: number;
  doctor: DoctorProfile;
  date: string; // "YYYY-MM-DD"
  timeSlot: string;
  isAvailable: boolean;
}

/**
 * Payload for a patient to book an appointment.
 */
export interface BookAppointmentPayload {
  doctorId: number;
  date: string; // "YYYY-MM-DD"
  timeSlot: string;
  reason: string;
  specialty: string;
}

/**
 * Represents an Appointment from the backend.
 */
export interface Appointment {
  appointmentId: number;
  doctor: DoctorProfile;
  patient: PatientProfile;
  date: string; // "YYYY-MM-DD"
  timeSlot: string;
  status: 'Booked' | 'Cancelled' | 'Completed';
  reason: string;
  specialty: string;
}

/**
 * Represents the Doctor profile data(limit) from the backend.
 */

export interface PublicDoctorInfo {
  id: number;
  name: string;
  specialization: string;
  rating: number;
  exp: number;
}

/**
 * Payload for updating a doctor's profile.
 */
export interface UpdateDoctorProfilePayload {
  name?: string;
  specialization?: string;
  exp?: number;
  qualification?: string;
}

/**
 * Payload for changing a Doctor's password.
 */
export interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
}

/**
 * Payload for creating a new availability slot.
 */
export interface CreateAvailabilityPayload {
  date: string; // "YYYY-MM-DD"
  timeSlot: string; // e.g., "10:00-10:30"
  isAvailable: boolean;
}

/**
 * Payload for updating an existing availability slot.
 */
export interface UpdateAvailabilityPayload {
  isAvailable: boolean;
}

/**
 * Represents the full patient profile data received from the backend.
 */
export interface PatientProfile {
  id: number;
  name: string;
  email: string;
  age: number;
  dob: string;
  bloodGroup: string;
  phoneNumber: number;
  address: string;
  gender: 'Male' | 'Female' | 'Other';
}

/**
 * Represents the payload for updating a patient's profile.
 */
export interface UpdatePatientProfilePayload {
  name: string;
  age: number;
  bloodGroup: string;
  phoneNumber: number;
  address: string;
  gender: 'Male' | 'Female' | 'Other';
}

/**
 * Represents an individual availability slot for a doctor.
 */
export interface Availability {
  availabilityId: number;
  doctorId: number;
  date: string;       // e.g., "2025-09-20"
  timeSlot: string;   // e.g., "10:00-10:30"
  isAvailable: boolean;
}

/**
 * Represents the detailed public profile of a doctor, including their available time slots.
 */
export interface DoctorPublicProfile {
  id: number;
  name: string;
  specialization: string;
  exp: number;
  qualification: string;
  rating: number;
  availability: Availability[];
}

/**
 * Represents the payload sent by a patient to book an appointment.
 */
export interface BookAppointmentPayload {
  doctorId: number;
  date: string;
  timeSlot: string;
  reason: string;
}

/**
 * Represents an appointment object returned from the backend.
 */
export interface Appointment {
  appointmentId: number;
  doctorId: number;
  doctorName: string;
  patientId: number;
  patientName: string;
  date: string;
  timeSlot: string;
  status: 'Waiting' | 'Booked' | 'Cancelled' | 'Completed';
  reason: string;
}

/**
 * Represents a notification object received from the backend.
 */
export interface Notification {
  id: number;
  message: string;
  isRead: boolean;
}

/**
 * Represents the payload for updating an appointment's status.
 */
export interface UpdateAppointmentStatusPayload {
  status: 'Booked' | 'Cancelled' | 'Completed' | 'Waiting';
}


/**
 * Represents the payload for updating an appointment's reason.
 */
export interface UpdateAppointmentPayload {
  reason: string;
}

/**
 * Represents the detailed consultation record returned from the backend.
 */
export interface Consultation {
  consultationId: number;
  appointmentId: number;
  patientId: number;
  doctorId: number;
  date: string; // e.g., "2025-09-20"
  symptoms: string;
  bloodPressure: string;
  height: number;
  weight: number;
  description: string;
  notes: string;
  status: 'Ongoing' | 'Completed' | 'FollowUp';
}

/**
 * Represents the payload a doctor sends to create a new consultation record.
 */
export interface CreateConsultationPayload {
  symptoms: string;
  bloodPressure: string;
  height: number;
  weight: number;
  description: string;
  notes: string;
  status: 'Ongoing' | 'Completed' | 'FollowUp';
}

/**
 * Represents a patient in the doctor's patient list.
 */
export interface PatientForDoctor {
  patientId: number;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
}

/**
 * Represents the complete medical history of a single patient,
 * including their profile and all associated appointments and consultations.
 */
export interface PatientHistory {
  patientProfile: PatientProfile;
  appointments: Appointment[];
  consultations: Consultation[];
}