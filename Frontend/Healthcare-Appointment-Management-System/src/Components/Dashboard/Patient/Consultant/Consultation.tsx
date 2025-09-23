import React, { useState, useEffect, useCallback } from "react";
import {
  ClipboardList,
  Calendar,
  Thermometer,
  Weight,
  Ruler,
  Info,
} from "lucide-react";
import { useAuth } from "../../../../Context/AuthContext";
import toast from "react-hot-toast";
// Import the real API service and types
import { getMyConsultations } from "../../../../api/consultationService";

import "./Consultations.css";
import type { Consultation } from "../../../../api/types";

const Consultations: React.FC = () => {
  const { user } = useAuth();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);

  // --- Data Fetching ---
  const fetchConsultations = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      // Call the real API to get the logged-in patient's consultation history
      const data = await getMyConsultations();
      console.log(data)
      // The backend already sorts by date, so no client-side sort is needed
      setConsultations(data);
    } catch (err) {
      console.error("Failed to fetch data", err);
      toast.error("Could not load consultation history.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchConsultations();
  }, [fetchConsultations]);

  // --- UI Helpers ---
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const calculateBMI = (weight: number, height: number) => {
    if (height === 0) return "N/A";
    const heightInMeters = height / 100;
    return (weight / (heightInMeters * heightInMeters)).toFixed(1);
  };

  if (loading) {
    return <div className="consultations-card">Loading consultation history...</div>;
  }

  return (
    <div className="consultations-card">
      <div className="consultations-header">
        <ClipboardList size={20} />
        <h3>Consultation History</h3>
      </div>

      <div className="consultations-list">
        {consultations.length === 0 ? (
          <div className="empty-state">No consultation history found.</div>
        ) : (
          consultations.map((consultation) => (
            <div key={consultation.consultationId} className="consultation-item">
              <div className="consultation-item-header">
                <div className="consultation-date">
                  <Calendar size={16} />
                  {formatDate(consultation.date)}
                </div>
                {/* Note: The doctor's name is not in the ConsultationDto.
                    This would require an additional API call or a backend DTO modification.
                    For now, we will omit it. */}
                <div
                  className={`consultation-status ${consultation.status.toLowerCase()}`}
                >
                  {consultation.status}
                </div>
              </div>

              <div className="consultation-details">
                {/* Vitals Section */}
                <div className="vitals">
                  <div className="vital-item">
                    <Thermometer size={16} />
                    <span>BP: {consultation.bloodPressure || 'N/A'}</span>
                  </div>
                  <div className="vital-item">
                    <Ruler size={16} />
                    <span>Height: {consultation.height} cm</span>
                  </div>
                  <div className="vital-item">
                    <Weight size={16} />
                    <span>Weight: {consultation.weight} kg</span>
                  </div>
                  <div className="vital-item">
                    <strong>BMI:</strong>
                    <span>
                      {calculateBMI(consultation.weight, consultation.height)}
                    </span>
                  </div>
                </div>

                {/* Symptoms & Diagnosis Section */}
                <div className="detail-section">
                  <h4>Symptoms Reported</h4>
                  <p>{consultation.symptoms}</p>
                </div>
                
                <div className="detail-section">
                  <h4>Doctor's Diagnosis</h4>
                  <p>{consultation.description}</p>
                </div>

                {/* Notes Section */}
                {consultation.notes && (
                  <div className="detail-section">
                    <h4>Additional Notes</h4>
                    <p>{consultation.notes}</p>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Consultations;