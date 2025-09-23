import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../../../../Context/AuthContext';
import './Profile.css';
import type { PatientProfile, UpdatePatientProfilePayload } from '../../../../api/types';
import { getMyPatientProfile, updateMyPatientProfile } from '../../../../api/patientService';

const PatientProfileCard: React.FC = () => {
  const [patient, setPatient] = useState<PatientProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState<boolean>(false);
  // Use the specific update payload type for form data
  const [formData, setFormData] = useState<UpdatePatientProfilePayload | null>(null);
  const [updateLoading, setUpdateLoading] = useState<boolean>(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchPatient = async () => {
      if (!user) return; // Wait until user context is available
      
      setLoading(true);
      try {
        // Call the real API to get the logged-in patient's profile
        const data = await getMyPatientProfile();
        setPatient(data);
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Failed to fetch patient data');
      } finally {
        setLoading(false);
      }
    };
    fetchPatient();
  }, [user]);

  const handleEditClick = () => {
    if (patient) {
      // Populate the form with the fields required for the update payload
      setFormData({
        name: patient.name,
        age: patient.age,
        bloodGroup: patient.bloodGroup,
        phoneNumber: patient.phoneNumber,
        address: patient.address,
        gender: patient.gender,
      });
      setEditMode(true);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    // Handle number inputs correctly
    const finalValue = type === 'number' ? parseInt(value, 10) : value;
    
    setFormData(prev => prev ? { ...prev, [name]: finalValue } : null);
  };

  const handleUpdate = async () => {
    if (!formData) return;
    
    setUpdateLoading(true);
    try {
      // Call the real API to update the profile
      const updatedPatient = await updateMyPatientProfile(formData);
      setPatient(updatedPatient); // Update the local state with the response
      setEditMode(false);
      toast.success("Profile updated successfully!");
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to update profile');
      toast.error("Failed to update profile.");
    } finally {
      setUpdateLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading Profile...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!patient) {
    return <div className="error">No patient data found.</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <img
          src={`https://api.multiavatar.com/${patient.email}.svg`} // Use a dynamic avatar
          alt={`${patient.name}'s profile`}
          className="profile-image"
        />
        {editMode && formData ? (
          <div className="profile-info">
            <input
              name="name"
              value={formData.name || ''}
              onChange={handleInputChange}
              className="profile-input"
            />
            <div className="profile-meta">
              <input
                name="age"
                value={formData.age || ''}
                onChange={handleInputChange}
                className="profile-meta-input"
                type="number"
              />
              <span>•</span>
              <select
                name="gender"
                value={formData.gender || ''}
                onChange={handleInputChange}
                className="profile-meta-input"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              <span>•</span>
              <input
                name="bloodGroup"
                value={formData.bloodGroup || ''}
                onChange={handleInputChange}
                className="profile-meta-input"
              />
            </div>
          </div>
        ) : (
          <div className="profile-info">
            <h2 className="profile-name">{patient.name}</h2>
            <div className="profile-meta">
              <span>{patient.age}yrs</span>
              <span>•</span>
              <span>{patient.gender}</span>
              <span>•</span>
              <span>{patient.bloodGroup}</span>
            </div>
          </div>
        )}
      </div>

      <div className="profile-details">
        {/* Email is not editable */}
        <div className="detail-row">
          <span className="detail-label">Email:</span>
          <span className="detail-value">{patient.email}</span>
        </div>

        <div className="detail-row">
          <span className="detail-label">Phone:</span>
          {editMode && formData ? (
            <input
              name="phoneNumber"
              value={formData.phoneNumber || ''}
              onChange={handleInputChange}
              className="detail-input"
              type="number"
            />
          ) : (
            <span className="detail-value">{patient.phoneNumber}</span>
          )}
        </div>
        
        {/* DOB is not editable as per backend DTO */}
        <div className="detail-row">
          <span className="detail-label">DOB:</span>
          <span className="detail-value">{patient.dob}</span>
        </div>

        <div className="detail-row">
          <span className="detail-label">Address:</span>
          {editMode && formData ? (
            <input
              name="address"
              value={formData.address || ''}
              onChange={handleInputChange}
              className="detail-input"
            />
          ) : (
            <span className="detail-value compact-address">{patient.address}</span>
          )}
        </div>
      </div>

      {editMode ? (
        <div className="profile-actions">
          <button 
            onClick={handleUpdate} 
            className="update-button"
            disabled={updateLoading}
          >
            {updateLoading ? 'Saving...' : 'Save Changes'}
          </button>
          <button 
            onClick={() => setEditMode(false)} 
            className="cancel-button"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button onClick={handleEditClick} className="update-button">
          Update Profile
        </button>
      )}
    </div>
  );
};

export default PatientProfileCard;