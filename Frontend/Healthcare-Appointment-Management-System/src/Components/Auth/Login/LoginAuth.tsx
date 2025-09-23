import React, { useState, type ChangeEvent, type FormEvent } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { login as apiLogin } from "../../../api/authService.ts";
import { useAuth } from "../../../Context/AuthContext";
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  Stethoscope, 
  UserPlus,
  Home,
  ArrowLeft
} from 'lucide-react';
import './Login.css';

const LoginAuth: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { login: updateAuthContext } = useAuth();

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // Basic validation
    if (!email || !password) {
      toast.error("Please enter both email and password.");
      setIsLoading(false);
      return;
    }

    try {
      const authData = await apiLogin({ email, password });
      // console.log("Login api response", authData);

      if(!authData || !authData.accessToken) {
        toast.error("Login failed. Please try again.");
        setIsLoading(false);
        throw new Error("Invalid login response");
      } else if(authData.user.role == 'ROLE_DOCTOR') {
        toast.success('Login successful! Welcome Doctor');
        navigate('/dashboard');
      } else if(authData.user.role == 'ROLE_PATIENT') {
        toast.success('Login successful! Welcome back');
        navigate('/dashboard');
      }

      updateAuthContext(authData);
      
    } catch (error: any) {
      console.error("Error at Login Auth", error);
      let errorMessage = "Invalid credentials. Please try again.";
      if (error.response?.data?.error) {
        const err = error.response.data.error;
        errorMessage = `Login failed (${err.status}): ${err.message}`;
        if (err.path) {
          errorMessage += ` [${err.path}]`;
        }
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Left side - Image/Illustration */}
      <div className="login-left">
        <div className="login-back-button" onClick={() => navigate("/")}>
          <ArrowLeft size={20} />
          <span>Back to Home</span>
        </div>
        
        <div className="login-illustration">
          <div className="login-illustration-content">
            <h2>Welcome to HealthConnect</h2>
            <p>Your journey to better healthcare starts here</p>
          </div>
        </div>

        <div className="login-credentials">
          <div className="login-credentials__user login-credentials__user--doctor">
            <h4>Doctor Test Account</h4>
            <p className="login-credentials__email">doctor@example.com</p>
            <p className="login-credentials__password">Password: doctor123</p>
          </div>
          
          <div className="login-credentials__user login-credentials__user--patient">
            <h4>Patient Test Account</h4>
            <p className="login-credentials__email">patient@example.com</p>
            <p className="login-credentials__password">Password: patient123</p>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="login-right">
        <div className="login-form-container">
          <div className="login-header">
            <div className="login-icon">
              <Stethoscope size={32} />
            </div>
            <h1>Sign In</h1>
            <p>Access your HealthConnect account</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="login-input-group">
              <label htmlFor="email" className="login-label">
                <Mail size={18} className="login-input-icon" />
                Email Address
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={handleEmailChange}
                required
                className="login-input"
              />
            </div>

            <div className="login-input-group">
              <label htmlFor="password" className="login-label">
                <Lock size={18} className="login-input-icon" />
                Password
              </label>
              <div className="login-password-container">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={handlePasswordChange}
                  required
                  className="login-input"
                />
                <button
                  type="button"
                  className="login-password-toggle"
                  onClick={togglePasswordVisibility}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              className="login-submit-btn"
              disabled={isLoading}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>

            <div className="login-links">
              <Link to="/auth/forgot-password" className="login-link">
                Forgot password?
              </Link>
            </div>
          </form>

          <div className="login-divider">
            <span>Don't have an account?</span>
          </div>

          <div className="login-register-options">
            <Link to="/auth/register" className="login-register-btn">
              <UserPlus size={18} />
              <span>Register as Patient</span>
            </Link>
            
            <Link to="/doctor/register" className="login-register-btn login-register-btn--doctor">
              <Stethoscope size={18} />
              <span>Register as Doctor</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginAuth;