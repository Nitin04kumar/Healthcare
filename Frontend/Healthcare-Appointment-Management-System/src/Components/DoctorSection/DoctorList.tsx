import React from 'react'
import "./doctorList.css";
import { doctors } from "../../mocks(data)/data";

interface Doctor {
  id: number;
  name: string;
  specialization: string;
  years_experience: number;
  demo_image: string;
  social_media: {
    linkedin: string;
    twitter: string;
    instagram: string;
  };
}

/** data.ts doctors = [{
    id: 176897,
    name: "Dr. Asha Singh",
    email: "asha@hospital.com",
    password: "doctor123",
    specialization: "Cardiology",
    availability: [
      { date: "2025-08-11", slots: ["11:00", "13:00", "15:00"] },
      { date: "2025-08-12", slots: ["09:30", "12:00", "14:30"] },
    ],
    years_experience: 15,
    demo_image: doc1,
    social_media: {
      linkedin: "#",
      twitter: "#",
      instagram: "#",
    },
  },
]
 * 
 */
type Props = {}

function DoctorList({}: Props) {
  return (
        <div className="doctor-list-container">
      <h2 className="doctor-list-title">Meet Our Specialists</h2>
      <p className="doctor-list-subtitle">
        Our doctors are committed to providing the highest quality,
        patient-centered care, leveraging advanced techniques and a
        collaborative approach to ensure the best possible outcomes for every
        individual.
      </p>

      <div className="doctor-list-grid">
        {doctors.map((doctor: Doctor) => (
          <div key={doctor.id} className="doctor-card">
            <div className="doctor-image-container">
              <img
                src={doctor.demo_image}
                alt={doctor.name}
                className="doctor-image"
              />
            </div>
            <div className="doctor-info">
              <h3 className="doctor-name">{doctor.name}</h3>
              <p className="doctor-specialization">
                {doctor.specialization}
              </p>
              <p className="doctor-experience">
                {doctor.years_experience} years experience
              </p>
            </div>
            <div className="doctor-social-links">
              <a href={doctor.social_media.linkedin} aria-label="LinkedIn">
                <i className="fab fa-linkedin"></i>
              </a>
              <a href={doctor.social_media.twitter} aria-label="Twitter">
                <i className="fab fa-twitter"></i>
              </a>
              <a href={doctor.social_media.instagram} aria-label="Instagram">
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>
        ))}
      </div>
      <div className="doctor-list-btn">
        <button className="doctor-list-btn-more">View More Doctors</button>
      </div>
    </div>
  )
}

export default DoctorList
