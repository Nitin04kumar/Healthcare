import React, { useEffect, useState } from "react";
import { Star, Calendar, Linkedin, Twitter, Instagram } from "lucide-react";
import { getPublicDoctors } from "../../api/doctorService";
import "./list.css";

interface Doctor {
  id: number;
  name: string;
  specialization: string;
  rating: number;
  exp: number;
  // Optional fields for future expansion
  demo_image?: string;
  social_media?: {
    linkedin?: string;
    twitter?: string;
    instagram?: string;
  };
}

const List: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const data = await getPublicDoctors();
        setDoctors(data);
      } catch (err) {
        setError("Failed to fetch doctors");
        console.error("Error fetching doctors:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  // Generate placeholder image based on doctor's name
  const generateAvatar = (name: string) => {
    const initials = name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
    return `https://ui-avatars.com/api/?name=${initials}&background=117c6f&color=fff&size=200&bold=true`;
  };

  if (error) {
    return (
      <div className="doctors-error">
        {/* <div className="doctors-error-icon">⚠️</div> */}
        <h3>Unable to load doctors</h3>
        <p>{error}</p>
        <button
          className="doctors-error-retry"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <section className="doctors">
      <div className="doctors__header">
        <h2 className="doctors__title">Meet Our Specialists</h2>
        <p className="doctors__subtitle">
          Our doctors are committed to providing the highest quality,
          patient-centered care, leveraging advanced techniques and a
          collaborative approach to ensure the best possible outcomes for every
          individual.
        </p>
      </div>

      <div className="doctors__grid">
        {doctors.map((doctor) => (
          <div key={doctor.id} className="doctors__card">
            <div className="doctors__image-container">
              <img
                src={doctor.demo_image || generateAvatar(doctor.name)}
                alt={doctor.name}
                className="doctors__image"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = generateAvatar(doctor.name);
                }}
              />
              <div className="doctors__rating">
                <Star size={14} fill="currentColor" />
                <span>{doctor.rating}</span>
              </div>
            </div>

            <div className="doctors__info">
              <h3 className="doctors__name">{doctor.name}</h3>
              <p className="doctors__specialization">{doctor.specialization}</p>
              <p className="doctors__experience">
                <Calendar size={14} />
                <span>{doctor.exp} years experience</span>
              </p>
            </div>

            {doctor.social_media && (
              <div className="doctors__social-links">
                {doctor.social_media.linkedin && (
                  <a href={doctor.social_media.linkedin} aria-label="LinkedIn">
                    <Linkedin size={16} />
                  </a>
                )}
                {doctor.social_media.twitter && (
                  <a href={doctor.social_media.twitter} aria-label="Twitter">
                    <Twitter size={16} />
                  </a>
                )}
                {doctor.social_media.instagram && (
                  <a
                    href={doctor.social_media.instagram}
                    aria-label="Instagram"
                  >
                    <Instagram size={16} />
                  </a>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="doctors__btn">
        <button className="doctors__btn-more">View More Doctors</button>
      </div>
    </section>
  );
};

export default List;
