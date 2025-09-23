import React, { useState, useEffect, useCallback } from "react";
import { Calendar, Clock, Plus, X, ToggleLeft, ToggleRight, ChevronDown, ChevronUp } from "lucide-react";
import { useAuth } from "../../../Context/AuthContext";
import toast from "react-hot-toast";
import type { DoctorAvailability as Availability } from "../../../api/types";
import "./DoctorAvaliability.css";
import { 
  addDoctorAvailability, 
  deleteDoctorAvailability, 
  getDoctorAvailabilityForDate, 
  updateDoctorAvailability,
  getAllDoctorAvailability 
} from "../../../api/doctorService";

const DocAvailability: React.FC = () => {
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

  return (
    <div className="doctor-availability-container">
      <h2 className="availability-title">
        <Calendar size={24} /> My Availability
      </h2>
      
      <div className="view-toggle">
        <button 
          className={`toggle-btn ${viewMode === 'date' ? 'active' : ''}`}
          onClick={() => setViewMode('date')}
        >
          Daily View
        </button>
        <button 
          className={`toggle-btn ${viewMode === 'all' ? 'active' : ''}`}
          onClick={() => setViewMode('all')}
        >
          All Availability
        </button>
      </div>

      {viewMode === 'date' ? (
        <>
          <div className="add-availability-section">
            <div className="add-date-container">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="date-input"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          <div className="availability-day">
            <div className="day-header">
              <h3 className="day-date">{formatDate(selectedDate)}</h3>
            </div>
            
            <div className="slots-container">
              {loading ? (
                <p className="loading-text">Loading slots...</p>
              ) : availability.length > 0 ? (
                <div className="time-slots">
                  {availability.map((slot) => (
                    <div key={slot.availabilityId} className={`time-slot ${!slot.isAvailable ? 'unavailable' : ''}`}>
                      <Clock size={14} /> {slot.timeSlot}
                      <button
                        onClick={() => handleToggleAvailability(slot)}
                        className="toggle-status-button"
                        title={slot.isAvailable ? 'Mark as Unavailable' : 'Mark as Available'}
                      >
                        {slot.isAvailable ? <ToggleRight color="var(--hc-green)" /> : <ToggleLeft color="var(--hc-gray-text)" />}
                      </button>
                      <button
                        onClick={() => handleRemoveSlot(slot.availabilityId)}
                        className="remove-slot-button"
                        title="Remove this slot"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-slots">No time slots scheduled for this day.</p>
              )}
              
              <div className="add-slot-container">
                <input
                  type="time"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="time-input"
                  step="1800" // 30-minute intervals
                />
                <button 
                  onClick={handleAddSlot}
                  className="add-slot-button"
                  disabled={!newTime}
                >
                  <Plus size={16} /> Add Slot
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="all-availability-view">
          <h3 className="all-availability-title">All Scheduled Availability</h3>
          
          {loading ? (
            <p className="loading-text">Loading all availability...</p>
          ) : sortedDates.length > 0 ? (
            <div className="availability-list">
              {sortedDates.map(date => (
                <div key={date} className="availability-day-card">
                  <div 
                    className="day-header-card"
                    onClick={() => toggleDateExpansion(date)}
                  >
                    <h3 className="day-date">{formatDate(date)}</h3>
                    <button className="expand-button">
                      {expandedDates.has(date) ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                  </div>
                  
                  {expandedDates.has(date) && (
                    <div className="slots-container">
                      {groupedAvailability[date].length > 0 ? (
                        <div className="time-slots">
                          {groupedAvailability[date].map((slot) => (
                            <div key={slot.availabilityId} className={`time-slot ${!slot.isAvailable ? 'unavailable' : ''}`}>
                              <Clock size={14} /> {slot.timeSlot}
                              <button
                                onClick={() => handleToggleAvailability(slot)}
                                className="toggle-status-button"
                                title={slot.isAvailable ? 'Mark as Unavailable' : 'Mark as Available'}
                              >
                                {slot.isAvailable ? <ToggleRight color="var(--hc-green)" /> : <ToggleLeft color="var(--hc-gray-text)" />}
                              </button>
                              <button
                                onClick={() => handleRemoveSlot(slot.availabilityId)}
                                className="remove-slot-button"
                                title="Remove this slot"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="no-slots">No time slots scheduled for this day.</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="no-availability">No availability scheduled yet.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default DocAvailability;