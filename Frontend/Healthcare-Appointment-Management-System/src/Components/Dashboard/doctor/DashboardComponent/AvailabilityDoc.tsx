import React, { useState, useEffect, useCallback } from "react";
import { 
  Calendar, 
  Clock, 
  Plus, 
  X, 
  ToggleLeft, 
  ToggleRight, 
  ChevronDown, 
  ChevronUp,
  Eye,
  List,
  Trash2
} from "lucide-react";
import { useAuth } from "../../../../Context/AuthContext";
import toast from "react-hot-toast";
import type { DoctorAvailability as Availability } from "../../../../api/types";
import './DoctorAvaliability.css'
import { 
  addDoctorAvailability, 
  deleteDoctorAvailability, 
  getDoctorAvailabilityForDate, 
  updateDoctorAvailability,
  getAllDoctorAvailability 
} from "../../../../api/doctorService";

const AvailabilityDoc: React.FC = () => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [allAvailability, setAllAvailability] = useState<Availability[]>([]);
  const [newTime, setNewTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'date' | 'all'>('date');
  const [expandedDates, setExpandedDates] = useState<Set<string>>(new Set());

  // Group availability by date
  const groupedAvailability = allAvailability.reduce((acc, slot) => {
    const date = slot.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(slot);
    return acc;
  }, {} as Record<string, Availability[]>);

  // Sort dates in descending order
  const sortedDates = Object.keys(groupedAvailability).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  // --- API Data Fetching ---
  const fetchAvailability = useCallback(async (date: string) => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const data = await getDoctorAvailabilityForDate(date);
      setAvailability(data);
    } catch (error) {
      toast.error("Failed to fetch availability.");
      console.error(error);
      setAvailability([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const fetchAllAvailability = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const data = await getAllDoctorAvailability();
      setAllAvailability(data);
    } catch (error) {
      toast.error("Failed to fetch all availability.");
      console.error(error);
      setAllAvailability([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (viewMode === 'date') {
      fetchAvailability(selectedDate);
    } else {
      fetchAllAvailability();
    }
  }, [selectedDate, viewMode, fetchAvailability, fetchAllAvailability]);

  // --- API Handlers ---
  const handleAddSlot = async () => {
    if (!newTime) {
      toast.error("Please select a time.");
      return;
    }

    // Convert 24-hour time to a time range (e.g., 10:00 -> 10:00-10:30)
    const [hours, minutes] = newTime.split(':').map(Number);
    const endDate = new Date();
    endDate.setHours(hours, minutes + 30);
    const endTime = `${String(endDate.getHours()).padStart(2, '0')}:${String(endDate.getMinutes()).padStart(2, '0')}`;
    const timeSlot = `${newTime}-${endTime}`;
    
    try {
      await addDoctorAvailability({
        date: selectedDate,
        timeSlot: timeSlot,
        isAvailable: true, // New slots are available by default
      });
      toast.success("Time slot added!");
      setNewTime("");
      
      // Refresh the appropriate view
      if (viewMode === 'date') {
        fetchAvailability(selectedDate);
      } else {
        fetchAllAvailability();
      }
    } catch (error) {
      toast.error("Failed to add time slot.");
      console.error(error);
    }
  };
  
  const handleToggleAvailability = async (slot: Availability) => {
    try {
      await updateDoctorAvailability(slot.availabilityId, {
        isAvailable: !slot.isAvailable,
      });
      toast.success(`Slot marked as ${!slot.isAvailable ? 'Available' : 'Unavailable'}`);
      
      // Refresh the appropriate view
      if (viewMode === 'date') {
        fetchAvailability(selectedDate);
      } else {
        fetchAllAvailability();
      }
    } catch (error) {
      toast.error("Failed to update status.");
      console.error(error);
    }
  };

  const handleRemoveSlot = async (availabilityId: number) => {
    if (window.confirm("Are you sure you want to delete this time slot?")) {
      try {
        await deleteDoctorAvailability(availabilityId);
        toast.success("Time slot deleted.");
        
        // Refresh the appropriate view
        if (viewMode === 'date') {
          fetchAvailability(selectedDate);
        } else {
          fetchAllAvailability();
        }
      } catch (error) {
        toast.error("Failed to delete time slot.");
        console.error(error);
      }
    }
  };
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    };
    // Add a day to the date to correct for timezone issues
    const date = new Date(dateString);
    date.setDate(date.getDate() + 1);
    return date.toLocaleDateString(undefined, options);
  };

  const toggleDateExpansion = (date: string) => {
    const newExpandedDates = new Set(expandedDates);
    if (newExpandedDates.has(date)) {
      newExpandedDates.delete(date);
    } else {
      newExpandedDates.add(date);
    }
    setExpandedDates(newExpandedDates);
  };

  const isToday = (dateString: string) => {
    const today = new Date().toISOString().split('T')[0];
    return dateString === today;
  };

  const isPastDate = (dateString: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const date = new Date(dateString);
    return date < today;
  };

  return (
    <div className="doctor-availability">
      <div className="doctor-availability__header">
        <h1 className="doctor-availability__title">
          <Calendar size={24} /> My Availability
        </h1>
        
        <div className="view-toggle">
          <button 
            className={`view-toggle-btn ${viewMode === 'date' ? 'active' : ''}`}
            onClick={() => setViewMode('date')}
          >
            <Eye size={16} />
            Daily View
          </button>
          <button 
            className={`view-toggle-btn ${viewMode === 'all' ? 'active' : ''}`}
            onClick={() => setViewMode('all')}
          >
            <List size={16} />
            All Availability
          </button>
        </div>
      </div>

      {viewMode === 'date' ? (
        <div className="daily-view">
          <div className="date-selector">
            <label className="date-selector__label">Select Date:</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="date-selector__input"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="availability-card">
            <div className="availability-card__header">
              <h3 className="availability-card__title">{formatDate(selectedDate)}</h3>
              {isToday(selectedDate) && <span className="today-badge">Today</span>}
            </div>
            
            <div className="availability-card__content">
              {loading ? (
                <div className="loading-state">
                  <div className="loading-spinner"></div>
                  <p>Loading time slots...</p>
                </div>
              ) : availability.length > 0 ? (
                <div className="time-slots-grid">
                  {availability.map((slot) => (
                    <div key={slot.availabilityId} className={`time-slot ${!slot.isAvailable ? 'unavailable' : ''}`}>
                      <div className="time-slot__info">
                        <Clock size={16} className="time-slot__icon" />
                        <span className="time-slot__time">{slot.timeSlot}</span>
                      </div>
                      <div className="time-slot__actions">
                        <button
                          onClick={() => handleToggleAvailability(slot)}
                          className="toggle-btn"
                          title={slot.isAvailable ? 'Mark as Unavailable' : 'Mark as Available'}
                        >
                          {slot.isAvailable ? (
                            <ToggleRight size={18} className="toggle-on" />
                          ) : (
                            <ToggleLeft size={18} className="toggle-off" />
                          )}
                        </button>
                        <button
                          onClick={() => handleRemoveSlot(slot.availabilityId)}
                          className="delete-btn"
                          title="Remove this slot"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <Clock size={48} className="empty-state__icon" />
                  <p className="empty-state__text">No time slots scheduled for this day.</p>
                </div>
              )}
              
              <div className="add-slot-form">
                <h4 className="add-slot-form__title">Add New Time Slot</h4>
                <div className="add-slot-form__controls">
                  <input
                    type="time"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="time-input"
                    step="1800" // 30-minute intervals
                  />
                  <button 
                    onClick={handleAddSlot}
                    className="add-slot-btn"
                    disabled={!newTime}
                  >
                    <Plus size={16} />
                    Add Slot
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="all-availability-view">
          <h3 className="all-availability-view__title">All Scheduled Availability</h3>
          
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading all availability...</p>
            </div>
          ) : sortedDates.length > 0 ? (
            <div className="availability-list">
              {sortedDates.map(date => (
                <div key={date} className={`availability-day-card ${isPastDate(date) ? 'past-date' : ''}`}>
                  <div 
                    className="availability-day-card__header"
                    onClick={() => toggleDateExpansion(date)}
                  >
                    <div className="availability-day-card__info">
                      <h3 className="availability-day-card__date">{formatDate(date)}</h3>
                      {isToday(date) && <span className="today-badge">Today</span>}
                      {isPastDate(date) && <span className="past-badge">Past Date</span>}
                      <span className="slot-count">{groupedAvailability[date].length} slots</span>
                    </div>
                    <button className="expand-btn">
                      {expandedDates.has(date) ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                  </div>
                  
                  {expandedDates.has(date) && (
                    <div className="availability-day-card__content">
                      <div className="time-slots-grid">
                        {groupedAvailability[date].map((slot) => (
                          <div key={slot.availabilityId} className={`time-slot ${!slot.isAvailable ? 'unavailable' : ''}`}>
                            <div className="time-slot__info">
                              <Clock size={16} className="time-slot__icon" />
                              <span className="time-slot__time">{slot.timeSlot}</span>
                            </div>
                            <div className="time-slot__actions">
                              <button
                                onClick={() => handleToggleAvailability(slot)}
                                className="toggle-btn"
                                title={slot.isAvailable ? 'Mark as Unavailable' : 'Mark as Available'}
                                disabled={isPastDate(date)}
                              >
                                {slot.isAvailable ? (
                                  <ToggleRight size={18} className="toggle-on" />
                                ) : (
                                  <ToggleLeft size={18} className="toggle-off" />
                                )}
                              </button>
                              <button
                                onClick={() => handleRemoveSlot(slot.availabilityId)}
                                className="delete-btn"
                                title="Remove this slot"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <Calendar size={48} className="empty-state__icon" />
              <p className="empty-state__text">No availability scheduled yet.</p>
              <p className="empty-state__subtext">Switch to Daily View to add time slots.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AvailabilityDoc;