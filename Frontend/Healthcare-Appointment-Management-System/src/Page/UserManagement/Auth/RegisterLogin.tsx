import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import LoginAuth from '../../../Components/Auth/Login/LoginAuth';
import img from '../../../assets/undraw_doctor_aum1.svg';
import img2 from '../../../assets/undraw_medicine_hqqg.svg';
import './Registerlogin.css';
import PatientRegistration from '../../../Components/Auth/Register/Patient/PatientRegistration';

const RegisterLogin: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const signInBtnRef = useRef<HTMLButtonElement>(null);
  const signUpBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const signInBtn = signInBtnRef.current;
    const signUpBtn = signUpBtnRef.current;

    if (container && signInBtn && signUpBtn) {
      const handleSignUpClick = () => {
        container.classList.add("sign-up-mode");
      };

      const handleSignInClick = () => {
        container.classList.remove("sign-up-mode");
      };

      signUpBtn.addEventListener("click", handleSignUpClick);
      signInBtn.addEventListener("click", handleSignInClick);

      return () => {
        signUpBtn.removeEventListener("click", handleSignUpClick);
        signInBtn.removeEventListener("click", handleSignInClick);
      };
    }
  }, []);

  return (
    <div className="container" ref={containerRef}>
      
      <div className="home-button-wrapper">
          <Link to="/">
            <button className="home-button"><i className="fas fa-house"></i></button>
          </Link>
      </div>

      <div className="forms-container">
        <div className="signin-signup">
          {/* Login Form */}
          <LoginAuth/>

           {/* SignUp Form */}
          <PatientRegistration/>
        </div>
      </div>

      <div className="panels-container">
        <div className="panel left-panel">
          <div className="content">
            <h3>New here?</h3>
            <p>
              Join our platform to access a wide range of healthcare services and connect with certified professionals.
            </p>
            <button className="btn transparent" id="sign-up-btn" ref={signUpBtnRef}>
              Sign up
            </button>
            <Link to="/doctor/register">
              <button className="register-link-button">
                <span>Register as a Healthcare Provider</span>
              </button>
            </Link>
          </div>

          <img src={img2} className="image" alt="" />
        </div>
        <div className="panel right-panel">
          <div className="content">
            <h3>One of us ?</h3>
            <p>
              We Provide Best Healthcare
            </p>
            <button className="btn transparent" id="sign-in-btn" ref={signInBtnRef}>
              Sign in
            </button>
          </div>
          <img src={img} className="image" alt="" />
        </div>
      </div>
    </div>
  );
};

export default RegisterLogin;
