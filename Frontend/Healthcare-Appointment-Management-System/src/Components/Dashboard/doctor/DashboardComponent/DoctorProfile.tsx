import React, { useEffect, useState } from 'react';
import './DoctorProfile.css';
import { Edit3, Save, X, Star, Award, Briefcase, Mail, User } from 'lucide-react';
import { getMyDoctorProfile, updateMyDoctorProfile } from '../../../../api/doctorService';
import Loader from '../../../loader/Loader';
import ErrorMessage from '../../../Error/ErrorMessage';

interface Doctor {
  id: number;
  name: string;
  email: string;
  specialization: string;
  exp: number;
  qualification: string;
  rating: number;
}

const DoctorProfile: React.FC = () => {
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [formData, setFormData] = useState<Partial<Doctor>>({});
  const [updateLoading, setUpdateLoading] = useState<boolean>(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState<boolean>(false);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const data: Doctor = await getMyDoctorProfile();
        setDoctor(data);
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Failed to fetch doctor profile');
      } finally {
        setLoading(false);
      }
    };
    fetchDoctor();
  }, []);

  const handleEditClick = () => {
    if (doctor) {
      setFormData({
        name: doctor.name,
        specialization: doctor.specialization,
        qualification: doctor.qualification,
        exp: doctor.exp,
      });
      setEditMode(true);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'exp' ? parseInt(value) || 0 : value 
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateLoading(true);
    setUpdateError(null);
    setUpdateSuccess(false);
    try {
      const updatedDoctor = await updateMyDoctorProfile(formData);
      setDoctor(updatedDoctor);
      setUpdateSuccess(true);
      setTimeout(() => {
        setEditMode(false);
        setUpdateSuccess(false);
      }, 1500);
    } catch (err: any) {
      setUpdateError(err?.response?.data?.message || 'Failed to update profile');
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    setUpdateError(null);
  };

  if (loading) {
    return (
      <div className="doctor-profile__loading">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="doctor-profile__error">
        <ErrorMessage 
          type="error" 
          message={error} 
          onDismiss={() => setError(null)}
        />
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="doctor-profile__error">
        <ErrorMessage 
          type="error" 
          message="Doctor profile not found" 
        />
      </div>
    );
  }

  return (
    <div className="doctor-profile">
      <div className="doctor-profile__header">
        <h1 className="doctor-profile__title">My Profile</h1>
        {!editMode && (
          <button
            onClick={handleEditClick}
            className="doctor-profile__edit-button"
          >
            <Edit3 size={18} />
            Edit Profile
          </button>
        )}
      </div>

      <div className="doctor-profile__card">
        {editMode ? (
          <form onSubmit={handleSubmit} className="doctor-profile__form">
            <div className="doctor-profile__form-grid">
              <div className="doctor-profile__form-group">
                <label className="doctor-profile__form-label">
                  <User size={16} />
                  Full Name
                </label>
                <input
                  className="doctor-profile__form-input"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleFormChange}
                  required
                />
              </div>
              
              <div className="doctor-profile__form-group">
                <label className="doctor-profile__form-label">
                  <Award size={16} />
                  Specialization
                </label>
                <select
                  className="doctor-profile__form-input"
                  name="specialization"
                  value={formData.specialization || ''}
                  onChange={handleFormChange}
                  required
                >
                  <option value="">Select Specialization</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Dermatology">Dermatology</option>
                  <option value="Neurology">Neurology</option>
                  <option value="Pediatrics">Pediatrics</option>
                  <option value="Orthopedics">Orthopedics</option>
                  <option value="Ophthalmology">Ophthalmology</option>
                  <option value="Psychiatry">Psychiatry</option>
                  <option value="Surgery">Surgery</option>
                  <option value="Dentistry">Dentistry</option>
                </select>
              </div>
              
              <div className="doctor-profile__form-group">
                <label className="doctor-profile__form-label">
                  <Award size={16} />
                  Qualification
                </label>
                <input
                  className="doctor-profile__form-input"
                  name="qualification"
                  value={formData.qualification || ''}
                  onChange={handleFormChange}
                  required
                />
              </div>
              
              <div className="doctor-profile__form-group">
                <label className="doctor-profile__form-label">
                  <Briefcase size={16} />
                  Experience (years)
                </label>
                <input
                  className="doctor-profile__form-input"
                  name="exp"
                  type="number"
                  min="0"
                  max="50"
                  value={formData.exp || 0}
                  onChange={handleFormChange}
                  required
                />
              </div>
            </div>
            
            <div className="doctor-profile__form-actions">
              <button
                type="submit"
                className="doctor-profile__save-button"
                disabled={updateLoading}
              >
                {updateLoading ? (
                  <>
                    <Loader />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Save Changes
                  </>
                )}
              </button>
              <button
                type="button"
                className="doctor-profile__cancel-button"
                onClick={handleCancel}
                disabled={updateLoading}
              >
                <X size={18} />
                Cancel
              </button>
            </div>
            
            {updateError && (
              <ErrorMessage 
                type="error" 
                message={updateError} 
                onDismiss={() => setUpdateError(null)}
              />
            )}
            
            {updateSuccess && (
              <ErrorMessage 
                type="success" 
                message="Profile updated successfully!" 
                onDismiss={() => setUpdateSuccess(false)}
              />
            )}
          </form>
        ) : (
          <>
            <div className="doctor-profile__info">
              <div className="doctor-profile__avatar">
                <User size={48} />
              </div>
              
              <div className="doctor-profile__main-info">
                <h2 className="doctor-profile__name">{doctor.name}</h2>
                <p className="doctor-profile__email">
                  <Mail size={16} />
                  {doctor.email}
                </p>
                <div className="doctor-profile__rating">
                  <Star size={18} fill="currentColor" />
                  <span>{doctor.rating.toFixed(1)}</span>
                </div>
              </div>
            </div>
            
            <div className="doctor-profile__details-grid">
              <div className="doctor-profile__detail-card">
                <div className="doctor-profile__detail-icon">
                  <Award size={24} />
                </div>
                <div className="doctor-profile__detail-content">
                  <h3>Specialization</h3>
                  <p>{doctor.specialization}</p>
                </div>
              </div>
              
              <div className="doctor-profile__detail-card">
                <div className="doctor-profile__detail-icon">
                  <Briefcase size={24} />
                </div>
                <div className="doctor-profile__detail-content">
                  <h3>Experience</h3>
                  <p>{doctor.exp} years</p>
                </div>
              </div>
              
              <div className="doctor-profile__detail-card">
                <div className="doctor-profile__detail-icon">
                  <Award size={24} />
                </div>
                <div className="doctor-profile__detail-content">
                  <h3>Qualification</h3>
                  <p>{doctor.qualification}</p>
                </div>
              </div>
              
              <div className="doctor-profile__detail-card">
                <div className="doctor-profile__detail-icon">
                  <Star size={24} />
                </div>
                <div className="doctor-profile__detail-content">
                  <h3>Rating</h3>
                  <p>{doctor.rating.toFixed(1)} ★</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DoctorProfile;