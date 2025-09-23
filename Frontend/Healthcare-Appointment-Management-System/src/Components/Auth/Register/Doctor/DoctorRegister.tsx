import React, { useState, type ChangeEvent, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { HomeIcon, MailIcon, SignatureIcon, LockKeyhole, UserRoundPlus, ArrowLeft } from 'lucide-react';
// import DoctorRegisterTheme from '../../../../assets/DoctorRegisterTheme.svg';
import './DoctorRegister.css';
import type { RegisterDoctorPayload } from '../../../../api/types';
import { useAuth } from '../../../../Context/AuthContext';
import { registerDoctor } from '../../../../api/authService';

const DoctorRegister: React.FC = () => {
  // --- State Management ---
  const [formData, setFormData] = useState<RegisterDoctorPayload>({
    name: '',
    email: '',
    password: '',
    specialization: '',
    exp: 0,
    qualification: '',
    rating: 0, // Hidden from frontend, set to 0 by default
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  
  const navigate = useNavigate();
  const { login: updateAuthContext } = useAuth();

  // Specialization options
  const specializations = [
    'Cardiology',
    'Dermatology',
    'Endocrinology',
    'Gastroenterology',
    'Neurology',
    'Oncology',
    'Orthopedics',
    'Pediatrics',
    'Psychiatry',
    'Radiology',
    'Surgery',
    'Urology'
  ];

  // Qualification options
  const qualifications = [
    'MBBS',
    'MD',
    'MS',
    'DM',
    'MCh',
    'DNB',
    'BDS',
    'MDS',
    'BAMS',
    'BHMS',
    'BUMS',
    'BVSc'
  ];

  // --- Handlers ---
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // For name field, ensure it starts with "Dr. "
    if (name === 'name') {
      // If user deletes the "Dr. " prefix, add it back
      if (!value.startsWith('Dr. ') && value.length > 0) {
        setFormData(prev => ({
          ...prev,
          [name]: 'Dr. ' + value
        }));
        return;
      }
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    if (!termsAccepted) {
      toast.error("You must accept the Terms and Conditions.");
      return;
    }

    try {
      const payload: RegisterDoctorPayload = { ...formData };
      
      const authData = await registerDoctor(payload);
      
      toast.success("Doctor registration successful!");
      
      // Update global state and navigate
      updateAuthContext(authData);
      navigate('/dashboard');

    } catch (error: any) {
      console.error("Doctor registration failed", error);
      const errorMessage = error.response?.data?.message || "Registration failed. Please try again.";
      toast.error(errorMessage);
    }
  };

  // --- JSX Rendering ---
  return (
    <div className="doctor-reg-container">
      {/* Left side - Image/Illustration (40%) */}
      <div className="doctor-reg-left">
        <div className="doctor-reg-back-button" onClick={() => navigate("/")}>
          <ArrowLeft size={20} />
          <span>Back to Home</span>
        </div>
        
        <div className="doctor-reg-illustration">
          <div className="doctor-reg-illustration-content">
            <h2>Join Our Medical Network</h2>
            <p>Connect with patients and grow your practice with our platform</p>
          </div>
        </div>

        <div className="doctor-reg-links">
          <p>Already have an account?</p>
          <Link to="/auth/login" className="doctor-reg-login-link">
            Sign In Now
          </Link>
        </div>
      </div>

      {/* Right side - Form (60%) */}
      <div className="doctor-reg-right">
        <div className="doctor-reg-form-container">
          <h1 className="doctor-reg-title">Doctor Registration</h1>
          <p className="doctor-reg-subtitle">Join our network of healthcare professionals</p>
          
          <form className="doctor-reg-form" onSubmit={handleSubmit}>
            {/* Name with Dr. prefix */}
            <div className="doctor-reg-input-group">
              <label htmlFor="name" className="doctor-reg-label">
                <SignatureIcon size={16} className="doctor-reg-label-icon" /> 
                Full Name
              </label>
              <input 
                id="name" 
                name="name" 
                type="text" 
                className="doctor-reg-input" 
                placeholder="Dr. Peter Parker" 
                value={formData.name} 
                onChange={handleChange} 
                required 
              />
            </div>

            {/* Email */}
            <div className="doctor-reg-input-group">
              <label htmlFor="email" className="doctor-reg-label">
                <MailIcon size={16} className="doctor-reg-label-icon" /> 
                Email Address
              </label>
              <input 
                id="email" 
                name="email" 
                type="email" 
                className="doctor-reg-input" 
                placeholder="peter@example.com" 
                value={formData.email} 
                onChange={handleChange} 
                required 
              />
            </div>
            
            {/* Specialization and Qualification - Inline */}
            <div className="doctor-reg-inline-fields">
              <div className="doctor-reg-input-group doctor-reg-input-group--half">
                <label htmlFor="specialization" className="doctor-reg-label">
                  Specialization
                </label>
                <select 
                  id="specialization" 
                  name="specialization" 
                  className="doctor-reg-select" 
                  value={formData.specialization} 
                  onChange={handleChange} 
                  required
                >
                  <option value="">Select Specialization</option>
                  {specializations.map(spec => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
              </div>
              
              <div className="doctor-reg-input-group doctor-reg-input-group--half">
                <label htmlFor="qualification" className="doctor-reg-label">
                  Qualification
                </label>
                <select 
                  id="qualification" 
                  name="qualification" 
                  className="doctor-reg-select" 
                  value={formData.qualification} 
                  onChange={handleChange} 
                  required
                >
                  <option value="">Select Qualification</option>
                  {qualifications.map(qual => (
                    <option key={qual} value={qual}>{qual}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Experience */}
            <div className="doctor-reg-input-group">
              <label htmlFor="exp" className="doctor-reg-label">
                Experience (Years)
              </label>
              <input 
                id="exp" 
                name="exp" 
                type="number" 
                className="doctor-reg-input" 
                placeholder="10" 
                value={formData.exp} 
                onChange={handleChange} 
                required 
                min="0"
                max="50"
              />
            </div>
            
            {/* Password */}
            <div className="doctor-reg-input-group">
              <label htmlFor="password" className="doctor-reg-label">
                <LockKeyhole size={16} className="doctor-reg-label-icon" /> 
                Password
              </label>
              <input 
                id="password" 
                name="password" 
                type="password" 
                className="doctor-reg-input" 
                placeholder="••••••••" 
                value={formData.password} 
                onChange={handleChange} 
                required 
              />
            </div>

            {/* Confirm Password */}
            <div className="doctor-reg-input-group">
              <label htmlFor="confirmPassword" className="doctor-reg-label">
                <LockKeyhole size={16} className="doctor-reg-label-icon" /> 
                Confirm Password
              </label>
              <input 
                id="confirmPassword" 
                name="confirmPassword" 
                type="password" 
                className="doctor-reg-input" 
                placeholder="••••••••" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                required 
              />
            </div>
            
            {/* Terms and Conditions */}
            <div className="doctor-reg-checkbox-group">
              <input 
                id="terms" 
                name="terms" 
                type="checkbox" 
                className="doctor-reg-checkbox-input" 
                checked={termsAccepted} 
                onChange={(e) => setTermsAccepted(e.target.checked)} 
              />
              <label htmlFor="terms" className="doctor-reg-checkbox-label">
                I accept the <Link to="/terms" className="doctor-reg-link">Terms and Conditions</Link>
              </label>
            </div>

            {/* Submit Button */}
            <button type="submit" className="doctor-reg-submit-btn">
              <UserRoundPlus size={18} /> 
              Register Now
            </button>
          </form>
          
          <div className="doctor-reg-footer">
            <p>Are you a patient? <Link to="/auth/register" className="doctor-reg-link">Register as a Patient</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorRegister;