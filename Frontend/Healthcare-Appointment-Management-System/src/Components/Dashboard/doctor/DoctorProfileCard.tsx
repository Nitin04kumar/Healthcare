import React, { useEffect, useState } from "react";
import "./DoctorProfile.css";
import {
  getMyDoctorProfile,
  updateMyDoctorProfile,
} from "../../../api/doctorService";

import ErrorMessage from "../../Error/ErrorMessage";

interface Doctor {
  id: number;
  name: string;
  email: string;
  specialization: string;
  exp: number;
  qualification: string;
  rating: number;
}

const DoctorProfileCard: React.FC = () => {
  const [doc, setDoc] = useState<Doctor | null>(null);
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
        setDoc(data);
      } catch (err: any) {
        setError(
          err?.response?.data?.message || "Failed to fetch doctor profile"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchDoctor();
  }, []);

  const handleEditClick = () => {
    if (doc) {
      setFormData({
        name: doc.name,
        specialization: doc.specialization,
        qualification: doc.qualification,
        exp: doc.exp,
      });
      setEditMode(true);
    }
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "exp" ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateLoading(true);
    setUpdateError(null);
    setUpdateSuccess(false);
    try {
      const updatedDoctor = await updateMyDoctorProfile(formData);
      setDoc(updatedDoctor);
      setUpdateSuccess(true);
      setEditMode(false);
    } catch (err: any) {
      setUpdateError(
        err?.response?.data?.message || "Failed to update profile"
      );
    } finally {
      setUpdateLoading(false);
    }
  };

  if (error) {
    return (
      <ErrorMessage
        type="error"
        message={error}
        onDismiss={() => setError(null)}
      />
    );
  }

  if (!doc) {
    return <ErrorMessage type="error" message="Doctor profile not found" />;
  }

  return (
    <div className="profile-card">
      <div className="profile-card__content">
        {editMode ? (
          <form onSubmit={handleSubmit} className="profile-card__form">
            <div className="profile-card__form-group">
              <label className="profile-card__form-label">Name:</label>
              <input
                className="profile-card__form-input"
                name="name"
                value={formData.name || ""}
                onChange={handleFormChange}
              />
            </div>
            <div className="profile-card__form-group">
              <label className="profile-card__form-label">
                Specialization:
              </label>
              <input
                className="profile-card__form-input"
                name="specialization"
                value={formData.specialization || ""}
                onChange={handleFormChange}
              />
            </div>
            <div className="profile-card__form-group">
              <label className="profile-card__form-label">Qualification:</label>
              <input
                className="profile-card__form-input"
                name="qualification"
                value={formData.qualification || ""}
                onChange={handleFormChange}
              />
            </div>
            <div className="profile-card__form-group">
              <label className="profile-card__form-label">
                Experience (years):
              </label>
              <input
                className="profile-card__form-input"
                name="exp"
                type="number"
                min="0"
                value={formData.exp || 0}
                onChange={handleFormChange}
              />
            </div>
            <div className="profile-card__form-actions">
              <button
                type="submit"
                className="profile-card__update-button"
                disabled={updateLoading}
              >
                {updateLoading ? "Updating..." : "Save"}
              </button>
              <button
                type="button"
                className="profile-card__cancel-button"
                onClick={() => setEditMode(false)}
              >
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
            <h2 className="profile-card__name">{doc.name}</h2>
            <p className="profile-card__email">{doc.email}</p>
            <div className="profile-card__details">
              <div className="profile-card__detail">
                <span className="profile-card__detail-label">
                  Specialization:
                </span>
                <span className="profile-card__detail-value">
                  {doc.specialization}
                </span>
              </div>
              <div className="profile-card__detail">
                <span className="profile-card__detail-label">Experience:</span>
                <span className="profile-card__detail-value">
                  {doc.exp} years
                </span>
              </div>
              <div className="profile-card__detail">
                <span className="profile-card__detail-label">
                  Qualification:
                </span>
                <span className="profile-card__detail-value">
                  {doc.qualification}
                </span>
              </div>
              <div className="profile-card__detail">
                <span className="profile-card__detail-label">Rating:</span>
                <span className="profile-card__detail-value">
                  {doc.rating} ★
                </span>
              </div>
            </div>
            <button
              onClick={handleEditClick}
              className="profile-card__update-button"
            >
              Update Profile
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default DoctorProfileCard;
