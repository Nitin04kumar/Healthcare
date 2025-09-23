import React, { useState, useEffect, useCallback, useMemo } from 'react';
import toast from 'react-hot-toast';
import { Search, Check, X, Clock, Calendar, User, ChevronUp, ChevronDown, Filter } from 'lucide-react';
import { useAuth } from '../../../../Context/AuthContext';
import type { Appointment } from '../../../../api/types';
import { getDoctorAppointments, updateAppointmentStatus } from '../../../../api/appointmentService';
import './Appointment.css';

const AppointmentDoc: React.FC = () => {
  const { user } = useAuth();
  const [allAppointments, setAllAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Appointment; direction: 'ascending' | 'descending' } | null>(null);

  // --- Data Fetching ---
  const fetchAppointments = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const appointments = await getDoctorAppointments();
      setAllAppointments(appointments);
      setFilteredAppointments(appointments);
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
  
  // --- Filtering Logic ---
  useEffect(() => {
    let filtered = allAppointments.filter(appointment => {
      const lowerSearchTerm = searchTerm.toLowerCase();
      const matchesSearch =
        appointment.patientName.toLowerCase().includes(lowerSearchTerm) ||
        appointment.reason.toLowerCase().includes(lowerSearchTerm);
      
      const matchesStatus =
        statusFilter === 'ALL' || appointment.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
    setFilteredAppointments(filtered);
  }, [searchTerm, statusFilter, allAppointments]);

  // --- Action Handler ---
  const handleUpdateStatus = async (appointmentId: number, newStatus: Appointment['status']) => {
    try {
      const updatedAppointment = await updateAppointmentStatus(appointmentId, { status: newStatus });
      
      // Update the state locally for an instant UI update
      setAllAppointments(prev => 
        prev.map(app => app.appointmentId === appointmentId ? updatedAppointment : app)
      );
      
      toast.success(`Appointment status updated to ${newStatus}!`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update status.');
    }
  };

  // --- UI Helpers ---
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusBadge = (status: Appointment['status']) => {
    const statusClass = `status-badge ${status.toLowerCase()}`;
    return <span className={statusClass}>{status}</span>;
  };
  
  // --- Sorting Logic (Memoized for performance) ---
  const sortedAppointments = useMemo(() => {
    if (!sortConfig) return filteredAppointments;
    
    return [...filteredAppointments].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredAppointments, sortConfig]);

  const requestSort = (key: keyof Appointment) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig?.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  const getSortIcon = (key: keyof Appointment) => {
    if (!sortConfig || sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' ? <ChevronUp size={16} /> : <ChevronDown size={16} />;
  };

  if (isLoading) {
    return (
      <div className="doctor-appointments__loading">
        <div className="loading-spinner"></div>
        <p>Loading appointments...</p>
      </div>
    );
  }

  return (
    <div className="doctor-appointments">
      <div className="doctor-appointments__header">
        <h1 className="doctor-appointments__title">Manage Appointments</h1>
        
        <div className="doctor-appointments__controls">
          <div className="search-container">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search by patient or reason..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="filter-container">
            <Filter size={16} />
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)} 
              className="filter-select"
            >
              <option value="ALL">All Statuses</option>
              <option value="Waiting">Waiting</option>
              <option value="Booked">Booked</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="appointments-table-container">
        <table className="appointments-table">
          <thead>
            <tr>
              <th onClick={() => requestSort('patientName')} className="sortable-header">
                <div className="header-content">
                  <User size={16} />
                  <span>Patient</span>
                  {getSortIcon('patientName')}
                </div>
              </th>
              <th onClick={() => requestSort('date')} className="sortable-header">
                <div className="header-content">
                  <Calendar size={16} />
                  <span>Date</span>
                  {getSortIcon('date')}
                </div>
              </th>
              <th onClick={() => requestSort('timeSlot')} className="sortable-header">
                <div className="header-content">
                  <Clock size={16} />
                  <span>Time</span>
                  {getSortIcon('timeSlot')}
                </div>
              </th>
              <th onClick={() => requestSort('status')} className="sortable-header">
                <div className="header-content">
                  <span>Status</span>
                  {getSortIcon('status')}
                </div>
              </th>
              <th>Reason</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedAppointments.length > 0 ? (
              sortedAppointments.map((appointment) => (
                <tr key={appointment.appointmentId} className="appointment-row">
                  <td className="patient-cell">
                    <div className="patient-info">
                      <User size={16} className="patient-icon" />
                      <span>{appointment.patientName}</span>
                    </div>
                  </td>
                  <td className="date-cell">
                    <div className="date-info">
                      <Calendar size={16} className="date-icon" />
                      <span>{formatDate(appointment.date)}</span>
                    </div>
                  </td>
                  <td className="time-cell">
                    <div className="time-info">
                      <Clock size={16} className="time-icon" />
                      <span>{appointment.timeSlot}</span>
                    </div>
                  </td>
                  <td className="status-cell">
                    {getStatusBadge(appointment.status)}
                  </td>
                  <td className="reason-cell">
                    <span className="reason-text">{appointment.reason}</span>
                  </td>
                  <td className="actions-cell">
                    <div className="action-buttons">
                      {appointment.status === 'Waiting' && (
                        <>
                          <button 
                            className="action-btn accept-btn"
                            title="Accept Appointment"
                            onClick={() => handleUpdateStatus(appointment.appointmentId, 'Booked')}
                          >
                            <Check size={16} />
                            Accept
                          </button>
                          <button 
                            className="action-btn reject-btn"
                            title="Decline Appointment"
                            onClick={() => handleUpdateStatus(appointment.appointmentId, 'Cancelled')}
                          >
                            <X size={16} />
                            Decline
                          </button>
                        </>
                      )}
                      {appointment.status === 'Booked' && (
                        <button 
                          className="action-btn complete-btn"
                          title="Mark as Completed"
                          onClick={() => handleUpdateStatus(appointment.appointmentId, 'Completed')}
                        >
                          <Check size={16} />
                          Complete
                        </button>
                      )}
                      {(appointment.status === 'Completed' || appointment.status === 'Cancelled') && (
                        <span className="no-actions">No actions available</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="no-appointments">
                  <div className="empty-state">
                    <Calendar size={48} className="empty-icon" />
                    <p>No appointments found</p>
                    <p className="empty-subtext">
                      {searchTerm || statusFilter !== 'ALL' 
                        ? 'Try adjusting your search or filter criteria' 
                        : 'You don\'t have any appointments scheduled yet'
                      }
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AppointmentDoc;