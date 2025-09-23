import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, Clock, Check, X, Edit } from 'lucide-react';
import { useAuth } from '../../../../Context/AuthContext';
import toast from 'react-hot-toast';
import './Appointments.css';
import type { Appointment } from '../../../../api/types';
import { 
  cancelPatientAppointment, 
  getPatientAppointmentHistory, 
  getUpcomingPatientAppointments, 
  updateAppointmentReason 
} from '../../../../api/appointmentService';

const Appointments: React.FC = () => {
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState<'upcoming' | 'past'>('upcoming');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for the update modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [newReason, setNewReason] = useState("");

  const fetchAppointments = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const fetcher = selectedTab === 'upcoming' 
        ? getUpcomingPatientAppointments 
        : getPatientAppointmentHistory;
      const response = await fetcher();
      // Map the API response to match the expected data structure
      const mappedAppointments = response?.map((app: any) => ({
        appointmentId: app.id || app.appointmentId,
        doctorName: app.doctor?.name || app.doctorName,
        date: app.date || app.appointmentDate,
        timeSlot: app.timeSlot || app.time,
        reason: app.reason || app.purpose,
        status: app.status || 'Booked'
      })) || [];
      
      setAppointments(mappedAppointments);
    } catch (err: any) {
      setError('Failed to fetch appointments');
      toast.error(err.response?.data?.message || 'Failed to fetch appointments.');
    } finally {
      setLoading(false);
    }
  }, [user?.id, selectedTab]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleCancel = async (appointmentId: number) => {
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      try {
        await cancelPatientAppointment(appointmentId);
        toast.success("Appointment cancelled successfully.");
        fetchAppointments(); // Re-fetch data to update the list
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Failed to cancel appointment.');
      }
    }
  };
  
  const openUpdateModal = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setNewReason(appointment.reason);
    setIsModalOpen(true);
  };
  
  const handleUpdateReason = async () => {
    if (!editingAppointment || !newReason.trim()) {
      toast.error("Please provide a reason for the appointment.");
      return;
    }
    
    if (newReason.trim().length < 5) {
      toast.error("Reason must be at least 5 characters long.");
      return;
    }
    
    try {
      await updateAppointmentReason(editingAppointment.appointmentId, { reason: newReason.trim() });
      toast.success("Appointment reason updated successfully.");
      setIsModalOpen(false);
      fetchAppointments(); // Re-fetch data
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update reason.');
    }
  };

  const getStatusDetails = (status: Appointment['status']) => {
    switch (status) {
      case 'Booked': 
        return { icon: <Check size={14} />, color: 'var(--hc-success)', text: 'Confirmed', bgColor: 'var(--hc-success-light)' };
      case 'Waiting': 
        return { icon: <Clock size={14} />, color: 'var(--hc-orange)', text: 'Pending', bgColor: 'rgba(245, 158, 11, 0.1)' };
      case 'Completed': 
        return { icon: <Check size={14} />, color: 'var(--hc-completed-bg)', text: 'Completed', bgColor: 'rgba(6, 95, 70, 0.1)' };
      case 'Cancelled': 
        return { icon: <X size={14} />, color: 'var(--hc-alert)', text: 'Cancelled', bgColor: 'rgba(220, 53, 69, 0.1)' };
      default: 
        return { icon: null, color: 'var(--hc-gray-text)', text: status, bgColor: 'var(--hc-gray-light)' };
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  return (
    <div className="appointments-card">
      <div className="appointments-header">
        <h3><Calendar size={20} /> My Appointments</h3>
        <span className="badge">{appointments.length}</span>
      </div>
      
      <div className="appointments-content">
        <div className="tabs">
          <button 
            className={`tab ${selectedTab === 'upcoming' ? 'active' : ''}`} 
            onClick={() => setSelectedTab('upcoming')}
          >
            Upcoming
          </button>
          <button 
            className={`tab ${selectedTab === 'past' ? 'active' : ''}`} 
            onClick={() => setSelectedTab('past')}
          >
            History
          </button>
        </div>
        
        <div className="table-container">
          {loading ? (
            <div className="empty-state">Loading appointments...</div>
          ) : error ? (
            <div className="empty-state error">{error}</div>
          ) : appointments.length === 0 ? (
            <div className="empty-state">
              No {selectedTab} appointments found.
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Doctor</th>
                  <th>Date & Time</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map(app => {
                  const statusDetails = getStatusDetails(app.status);
                  return (
                    <tr key={app.appointmentId} className="appointment-row">
                      <td>
                        <div className="cell-content">
                          <span className="doctor-name">Dr. {app.doctorName}</span>
                        </div>
                      </td>
                      <td>
                        <div className="time-details">
                          <Calendar size={14} />
                          <span>{formatDate(app.date)}</span>
                          <Clock size={14} />
                          <span>{app.timeSlot}</span>
                        </div>
                      </td>
                      <td>
                        <div className="reason-text">{app.reason}</div>
                      </td>
                      <td>
                        <div 
                          className="status-badge"
                          style={{ 
                            color: statusDetails.color,
                            backgroundColor: statusDetails.bgColor
                          }}
                        >
                          {statusDetails.icon}
                          <span>{statusDetails.text}</span>
                        </div>
                      </td>
                      <td>
                        {(app.status === 'Waiting' || app.status === 'Booked') && (
                          <div className="action-buttons">
                            <button 
                              className="action-button edit-button" 
                              onClick={() => openUpdateModal(app)}
                              title="Edit reason"
                            >
                              <Edit size={14} />
                            </button>
                            <button 
                              className="action-button cancel-button" 
                              onClick={() => handleCancel(app.appointmentId)}
                              title="Cancel appointment"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        )}
                        {app.status === 'Completed' && (
                          <span className="completed-text">Completed</span>
                        )}
                        {app.status === 'Cancelled' && (
                          <span className="cancelled-text">Cancelled</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
      
      {/* Update Reason Modal */}
      {isModalOpen && editingAppointment && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Update Appointment Reason</h3>
              <button className="close-button" onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            
            <div className="modal-body">
              <p className="modal-info">
                Appointment with <strong>Dr. {editingAppointment.doctorName}</strong> on{' '}
                {formatDate(editingAppointment.date)} at {editingAppointment.timeSlot}
              </p>
              
              <div className="form-group">
                <label htmlFor="reason">Reason for Visit *</label>
                <textarea 
                  id="reason"
                  value={newReason} 
                  onChange={(e) => setNewReason(e.target.value)}
                  placeholder="Please describe the reason for your visit..."
                  rows={4}
                  className="reason-textarea"
                />
                <div className="char-count">
                  {newReason.length}/5 characters minimum
                </div>
              </div>
            </div>
            
            <div className="modal-actions">
              <button 
                className="modal-button secondary" 
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button 
                className="modal-button primary" 
                onClick={handleUpdateReason}
                disabled={newReason.trim().length < 5}
              >
                Update Reason
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;