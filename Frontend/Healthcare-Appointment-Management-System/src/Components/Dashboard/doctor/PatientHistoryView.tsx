import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { User, Calendar, Stethoscope, FileText, ArrowLeft } from 'lucide-react';
import './patient.history.module.css'
import type { PatientHistory, Consultation } from '../../../api/types';
import { getPatientHistory } from '../../../api/doctorService';

interface PatientHistoryViewProps {
  patientId: number;
  onBack: () => void; // Function to go back to the list
}

const PatientHistoryView: React.FC<PatientHistoryViewProps> = ({ patientId, onBack }) => {
  const [history, setHistory] = useState<PatientHistory | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!patientId) return;
      setLoading(true);
      try {
        const data = await getPatientHistory(patientId);
        setHistory(data);
      } catch (error) {
        toast.error("Failed to fetch patient history.");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [patientId]);

  if (loading) {
    return <div className="history-view-container">Loading patient history...</div>;
  }

  if (!history) {
    return <div className="history-view-container">No history found for this patient.</div>;
  }

  const { patientProfile, appointments, consultations } = history;

  // Combine and sort all events by date
  const timelineEvents = [
    ...appointments.map(a => ({ ...a, type: 'appointment' })),
    ...consultations.map(c => ({ ...c, type: 'consultation' }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="history-view-container">
      <button className="back-button" onClick={onBack}>
        <ArrowLeft size={16} /> Back to Patient List
      </button>

      <div className="patient-profile-header">
        <div className="profile-info">
          <User size={32} />
          <div>
            <h2>{patientProfile.name}</h2>
            <p>{patientProfile.age} years old • {patientProfile.gender} • Blood Group: {patientProfile.bloodGroup}</p>
          </div>
        </div>
      </div>
      
      <h3>Medical Timeline</h3>
      <div className="timeline">
        {timelineEvents.map((event, index) => (
          <div key={`${event.type}-${index}`} className="timeline-item">
            <div className="timeline-icon">
              {event.type === 'appointment' ? <Calendar /> : <Stethoscope />}
            </div>
            <div className="timeline-content">
              <span className="timeline-date">{new Date(event.date).toLocaleDateString()}</span>
              {event.type === 'appointment' && (
                <div className="appointment-event">
                  <h4>Appointment</h4>
                  <p><strong>Status:</strong> {event.status}</p>
                  <p><strong>Reason:</strong> {event.reason}</p>
                </div>
              )}
              {event.type === 'consultation' && (
                <div className="consultation-event">
                  <h4>Consultation</h4>
                  <p><strong>Diagnosis:</strong> {event.description}</p>
                  <p><strong>Symptoms:</strong> {event.symptoms}</p>
                  {event.notes && <p><strong>Notes:</strong> {event.notes}</p>}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatientHistoryView;