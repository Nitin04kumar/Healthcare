// DoctorAppointments.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Search, Check, X, Clock, Calendar, User } from 'lucide-react';
import { useAuth } from '../../../Context/AuthContext';
import type { Appointment } from '../../../api/types';
import { getDoctorAppointments, updateAppointmentStatus } from '../../../api/appointmentService';
import './Doc_Appointment.css';

const DocAppointments: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch appointments
  const fetchAppointments = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const appointmentsData = await getDoctorAppointments();
      setAppointments(appointmentsData);
      setFilteredAppointments(appointmentsData);
    } catch (error) {
      toast.error('Failed to fetch appointments.');
      console.error('Error fetching appointments:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);
  
  // Filter appointments based on search and status
  useEffect(() => {
    let filtered = appointments.filter(appointment => {
      const lowerSearchTerm = searchTerm.toLowerCase();
      const matchesSearch =
        appointment.patientName.toLowerCase().includes(lowerSearchTerm) ||
        appointment.reason.toLowerCase().includes(lowerSearchTerm);
      
      const matchesStatus =
        statusFilter === 'ALL' || appointment.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
    
    // Sort by status and time
    filtered.sort((a, b) => {
      // Status priority: Waiting > Booked > Completed > Cancelled
      const statusPriority = { 'Waiting': 0, 'Booked': 1, 'Completed': 2, 'Cancelled': 3 };
      if (statusPriority[a.status as keyof typeof statusPriority] !== statusPriority[b.status as keyof typeof statusPriority]) {
        return statusPriority[a.status as keyof typeof statusPriority] - statusPriority[b.status as keyof typeof statusPriority];
      }
      
      // Then sort by date and time
      const dateA = new Date(a.date + ' ' + a.timeSlot);
      const dateB = new Date(b.date + ' ' + b.timeSlot);
      return dateA.getTime() - dateB.getTime();
    });
    
    setFilteredAppointments(filtered);
  }, [searchTerm, statusFilter, appointments]);

  // Handle status updates
  const handleUpdateStatus = async (appointmentId: number, newStatus: Appointment['status']) => {
    try {
      const updatedAppointment = await updateAppointmentStatus(appointmentId, { status: newStatus });
      
      setAppointments(prev => 
        prev.map(app => app.appointmentId === appointmentId ? updatedAppointment : app)
      );
      
      toast.success(`Appointment status updated to ${newStatus}!`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update status.');
    }
  };

  // Handle consultation button click
  const handleConsultation = (appointmentId: number) => {
    navigate(`/consultation/${appointmentId}`);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Status badge with appropriate styling
  const getStatusBadge = (status: Appointment['status']) => {
    return <span className={`status-badge status-${status.toLowerCase()}`}>{status}</span>;
  };

  if (isLoading) {
    return <div className="appointment-loading">Loading appointments...</div>;
  }

  return (
    <div className="appointment-container">
      <div className="appointment-header">
        <h2 className="appointment-title">Manage Appointments</h2>
        <div className="appointment-controls">
          <div className="search-container">
            <Search size={16} className="search-icon" />
            <input 
              type="text" 
              className="search-input"
              placeholder="Search by patient or reason..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
          </div>
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)} 
            className="status-select"
          >
            <option value="ALL">All Statuses</option>
            <option value="Waiting">Waiting</option>
            <option value="Booked">Booked</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>
      
      <div className="table-wrapper">
        <table className="appointments-table">
          <thead>
            <tr>
              <th className="table-header">Patient</th>
              <th className="table-header">Date</th>
              <th className="table-header">Time</th>
              <th className="table-header">Status</th>
              <th className="table-header">Reason</th>
              <th className="table-header">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.length === 0 ? (
              <tr>
                <td colSpan={6} className="no-appointments">
                  No appointments found
                </td>
              </tr>
            ) : (
              filteredAppointments.map((appointment) => (
                <tr key={appointment.appointmentId} className="table-row">
                  <td className="table-cell">
                    <div className="cell-content">
                      <User size={16} />
                      {appointment.patientName}
                    </div>
                  </td>
                  <td className="table-cell">
                    <div className="cell-content">
                      <Calendar size={16} />
                      {formatDate(appointment.date)}
                    </div>
                  </td>
                  <td className="table-cell">
                    <div className="cell-content">
                      <Clock size={16} />
                      {appointment.timeSlot}
                    </div>
                  </td>
                  <td className="table-cell">
                    {getStatusBadge(appointment.status)}
                  </td>
                  <td className="table-cell reason-cell">
                    {appointment.reason}
                  </td>
                  <td className="table-cell">
                    <div className="actions-container">
                      {appointment.status === 'Waiting' && (
                        <>
                          <button 
                            className="action-btn btn-accept" 
                            title="Accept" 
                            onClick={() => handleUpdateStatus(appointment.appointmentId, 'Booked')}
                          >
                            <Check size={16} />
                          </button>
                          <button 
                            className="action-btn btn-decline" 
                            title="Decline" 
                            onClick={() => handleUpdateStatus(appointment.appointmentId, 'Cancelled')}
                          >
                            <X size={16} />
                          </button>
                        </>
                      )}
                      {appointment.status === 'Booked' && (
                        <>
                          <button 
                            className="btn-complete" 
                            title="Mark as Completed" 
                            onClick={() => handleUpdateStatus(appointment.appointmentId, 'Completed')}
                          >
                            Complete
                          </button>
                          <button 
                            className="btn-consult" 
                            onClick={() => handleConsultation(appointment.appointmentId)}
                          >
                            Consult
                          </button>
                        </>
                      )}
                      {appointment.status === 'Completed' && (
                        <span className="status-final">Consultation completed</span>
                      )}
                      {appointment.status === 'Cancelled' && (
                        <span className="status-final">Appointment cancelled</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DocAppointments;