import React, { useState, type ChangeEvent, type FormEvent } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../Context/AuthContext';
import { registerPatient } from '../../../../api/authService';
import type { RegisterPatientPayload } from '../../../../api/types';
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  Calendar,
  Droplets,
  Phone,
  MapPin,
  VenusAndMars,
  Cake,
  Stethoscope,
  ArrowLeft,
  UserPlus
} from 'lucide-react';
import './Register.css';

const PatientRegistration: React.FC = () => {
  // --- State Management ---
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    age: '',
    dob: '',
    bloodGroup: '',
    phoneNumber: '',
    address: '',
    gender: 'Male' as 'Male' | 'Female' | 'Other'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const { login: updateAuthContext } = useAuth();

  // Handle input changes
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // --- Form Submission ---
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      setIsSubmitting(false);
      return;
    }

    try {
      const payload: RegisterPatientPayload = {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        age: Number(formData.age),
        dob: formData.dob,
        bloodGroup: formData.bloodGroup,
        phoneNumber: Number(formData.phoneNumber),
        address: formData.address,
        gender: formData.gender
      };
      
      const authData = await registerPatient(payload);
      
      console.log("Patient registration successful", authData);
      toast.success("Registration successful!");

      // Update the global auth state after registration
      updateAuthContext(authData);

      // Redirect to the patient dashboard
      navigate('/patient/dashboard');

    } catch (error: any) {
      console.error("Registration failed", error);
      const errorMessage = error.response?.data?.message || "Registration failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Calculate maximum date for date of birth (18 years ago)
  const maxDobDate = new Date();
  maxDobDate.setFullYear(maxDobDate.getFullYear() - 18);
  const maxDobString = maxDobDate.toISOString().split('T')[0];

  // Blood group options
  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  // --- JSX Rendering ---
  return (
    <div className="patient-reg-container">
      {/* Left side - Image/Illustration (40%) */}
      <div className="patient-reg-left">
        <div className="patient-reg-back-button" onClick={() => navigate("/")}>
          <ArrowLeft size={20} />
          <span>Back to Home</span>
        </div>
        
        <div className="patient-reg-illustration">
          <div className="patient-reg-illustration-content">
            <Stethoscope size={48} />
            <h2>Join HealthConnect</h2>
            <p>Create your patient account to access personalized healthcare services</p>
          </div>
        </div>

        <div className="patient-reg-links">
          <p>Already have an account?</p>
          <Link to="/login" className="patient-reg-login-link">
            Sign In Now
          </Link>
        </div>
      </div>

      {/* Right side - Form (60%) */}
      <div className="patient-reg-right">
        <div className="patient-reg-form-container">
          <h1 className="patient-reg-title">Create Patient Account</h1>
          
          <form className="patient-reg-form" onSubmit={handleSubmit}>
            {/* Full Name */}
            <div className="patient-reg-input-group">
              <label htmlFor="name" className="patient-reg-label">
                <User size={16} className="patient-reg-label-icon" />
                Full Name
              </label>
              <input 
                id="name"
                name="name"
                type="text" 
                placeholder="Enter your full name" 
                value={formData.name} 
                onChange={handleInputChange} 
                required 
                className="patient-reg-input"
              />
            </div>
            
            {/* Email */}
            <div className="patient-reg-input-group">
              <label htmlFor="email" className="patient-reg-label">
                <Mail size={16} className="patient-reg-label-icon" />
                Email Address
              </label>
              <input 
                id="email"
                name="email"
                type="email" 
                placeholder="Enter your email" 
                value={formData.email} 
                onChange={handleInputChange} 
                required 
                className="patient-reg-input"
              />
            </div>
            
            {/* Password */}
            <div className="patient-reg-input-group">
              <label htmlFor="password" className="patient-reg-label">
                <Lock size={16} className="patient-reg-label-icon" />
                Password
              </label>
              <div className="patient-reg-password-container">
                <input 
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"} 
                  placeholder="Create a password" 
                  value={formData.password} 
                  onChange={handleInputChange} 
                  required 
                  className="patient-reg-input"
                />
                <button 
                  type="button" 
                  className="patient-reg-password-toggle"
                  onClick={togglePasswordVisibility}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            
            {/* Confirm Password */}
            <div className="patient-reg-input-group">
              <label htmlFor="confirmPassword" className="patient-reg-label">
                <Lock size={16} className="patient-reg-label-icon" />
                Confirm Password
              </label>
              <div className="patient-reg-password-container">
                <input 
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"} 
                  placeholder="Confirm your password" 
                  value={formData.confirmPassword} 
                  onChange={handleInputChange} 
                  required 
                  className="patient-reg-input"
                />
                <button 
                  type="button" 
                  className="patient-reg-password-toggle"
                  onClick={toggleConfirmPasswordVisibility}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            
            {/* Age and Date of Birth - Inline */}
            <div className="patient-reg-inline-fields">
              <div className="patient-reg-input-group patient-reg-input-group--half">
                <label htmlFor="age" className="patient-reg-label">
                  <User size={16} className="patient-reg-label-icon" />
                  Age
                </label>
                <input 
                  id="age"
                  name="age"
                  type="number" 
                  placeholder="Your age" 
                  value={formData.age} 
                  onChange={handleInputChange} 
                  required 
                  min="1"
                  max="120"
                  className="patient-reg-input"
                />
              </div>
              
              <div className="patient-reg-input-group patient-reg-input-group--half">
                <label htmlFor="dob" className="patient-reg-label">
                  <Cake size={16} className="patient-reg-label-icon" />
                  Date of Birth
                </label>
                <input 
                  id="dob"
                  name="dob"
                  type="date" 
                  value={formData.dob} 
                  onChange={handleInputChange} 
                  required 
                  max={maxDobString}
                  className="patient-reg-input"
                />
              </div>
            </div>
            
            {/* Gender and Blood Group - Inline */}
            <div className="patient-reg-inline-fields">
              <div className="patient-reg-input-group patient-reg-input-group--half">
                <label htmlFor="gender" className="patient-reg-label">
                  <VenusAndMars size={16} className="patient-reg-label-icon" />
                  Gender
                </label>
                <select 
                  id="gender"
                  name="gender"
                  value={formData.gender} 
                  onChange={handleInputChange} 
                  required
                  className="patient-reg-select"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div className="patient-reg-input-group patient-reg-input-group--half">
                <label htmlFor="bloodGroup" className="patient-reg-label">
                  <Droplets size={16} className="patient-reg-label-icon" />
                  Blood Group
                </label>
                <select 
                  id="bloodGroup"
                  name="bloodGroup"
                  value={formData.bloodGroup} 
                  onChange={handleInputChange} 
                  required 
                  className="patient-reg-select"
                >
                  <option value="">Select Blood Group</option>
                  {bloodGroups.map(group => (
                    <option key={group} value={group}>{group}</option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Phone Number */}
            <div className="patient-reg-input-group">
              <label htmlFor="phoneNumber" className="patient-reg-label">
                <Phone size={16} className="patient-reg-label-icon" />
                Phone Number
              </label>
              <input 
                id="phoneNumber"
                name="phoneNumber"
                type="tel" 
                placeholder="Your phone number" 
                value={formData.phoneNumber} 
                onChange={handleInputChange} 
                required 
                className="patient-reg-input"
              />
            </div>
            
            {/* Address */}
            <div className="patient-reg-input-group">
              <label htmlFor="address" className="patient-reg-label">
                <MapPin size={16} className="patient-reg-label-icon" />
                Address
              </label>
              <input 
                id="address"
                name="address"
                type="text" 
                placeholder="Your complete address" 
                value={formData.address} 
                onChange={handleInputChange} 
                required 
                className="patient-reg-input"
              />
            </div>

            <button 
              type="submit" 
              className="patient-reg-submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
          
          <div className="patient-reg-footer">
            <p>Are you a doctor? <Link to="/doctor/register" className="patient-reg-doctor-link">Register as a Doctor</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientRegistration;