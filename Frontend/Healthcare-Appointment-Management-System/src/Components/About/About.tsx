import React from "react";
import "./About.css";
import assetsData from "../../assets/assetsData";

const About: React.FC = () => {
  return (
    <div className="about-container">
      <h1 className="about-heading">
        About Us
      </h1>
      <p className="about-intro-text">
        At<span className="hospital__name-text">Healthcare</span>, we are
        dedicated to revolutionizing healthcare by providing accessible,
        compassionate, and high-quality medical services to our community. Our
        mission is to empower individuals to take control of their health with
        confidence.
      </p>

      <div className="about-content-section">
        <div className="about-image-container">
          <img
            src={assetsData.newsImage3}
            className="about-image"
            alt="A team of healthcare professionals working together"
          />
        </div>
        <div className="about-text-content">
          <h2 className="about-text-heading">Our Mission</h2>
          <p className="about-text-paragraph">
            We believe that exceptional healthcare starts with trust and a deep
            understanding of our patients' needs. Our team of certified
            professionals is committed to delivering personalized care, using
            innovative technology and a patient-first approach to ensure every
            individual receives the attention and treatment they deserve. We
            strive to create a healthier future, one patient at a time.
          </p>
          <button className="about-text-button">Learn More</button>
        </div>
      </div>
    </div>
  );
};

export default About;
