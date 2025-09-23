import React, { useState, useEffect } from "react";
import { Calendar, Clock, X, Search, Star } from "lucide-react";
import toast from "react-hot-toast";
import "./DoctorsAvailability.css";
import type { Availability, DoctorPublicProfile } from "../../../../api/types";
import { bookAppointment, getAllDoctors } from "../../../../api/patientService";

const DoctorAvailability: React.FC = () => {
  const [doctors, setDoctors] = useState<DoctorPublicProfile[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<DoctorPublicProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorPublicProfile | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [reason, setReason] = useState("");
  const [isBooking, setIsBooking] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>("rating");
  const [sortOrder, setSortOrder] = useState<string>("desc");

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const data = await getAllDoctors();
        setDoctors(data);
        setFilteredDoctors(data);
      } catch (error) {
        toast.error("Failed to load doctors' data.");
      }
    };
    fetchDoctors();
  }, []);

  useEffect(() => {
    // Sort doctors based on selected criteria
    const sortedDoctors = [...filteredDoctors].sort((a, b) => {
      if (sortBy === "rating") {
        return sortOrder === "asc" ? a.rating - b.rating : b.rating - a.rating;
      } else if (sortBy === "experience") {
        return sortOrder === "asc" ? a.exp - b.exp : b.exp - a.exp;
      } else if (sortBy === "name") {
        return sortOrder === "asc" 
          ? a.name.localeCompare(b.name) 
          : b.name.localeCompare(a.name);
      }
      return 0;
    });
    setFilteredDoctors(sortedDoctors);
  }, [sortBy, sortOrder, doctors, searchQuery]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    if (!query) {
      setFilteredDoctors(doctors);
      return;
    }
    const results = doctors.filter(
      (doctor) =>
        doctor.name.toLowerCase().includes(query) ||
        doctor.specialization.toLowerCase().includes(query) ||
        doctor.qualification.toLowerCase().includes(query)
    );
    setFilteredDoctors(results);
  };

  const handleSortChange = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };
  
  const handleBookAppointment = async () => {
    if (!selectedDoctor || !selectedDate || !selectedSlot) {
      toast.error("Please select a date and time slot.");
      return;
    }
    
    if (!reason.trim()) {
      toast.error("Please provide a reason for your appointment.");
      return;
    }
    
    if (reason.trim().length < 5) {
      toast.error("Please provide a more detailed reason (at least 5 characters).");
      return;
    }
    
    setIsBooking(true);
    try {
      await bookAppointment({
        doctorId: selectedDoctor.id,
        date: selectedDate,
        timeSlot: selectedSlot,
        reason: reason.trim(),
      });
      toast.success(
        `Appointment request sent to Dr. ${selectedDoctor.name}! You will be notified upon confirmation.`,
        { duration: 5000 }
      );
      closeModal();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Could not book appointment.");
    } finally {
      setIsBooking(false);
    }
  };

  const closeModal = () => {
    setSelectedDoctor(null);
    setSelectedDate("");
    setSelectedSlot("");
    setReason("");
  };

  const getAvailableSlotsForDate = (date: string): Availability[] => {
      if (!selectedDoctor) return [];
      return selectedDoctor.availability.filter(avail => avail.date === date);
  };
  
  // Group availability by date for the modal
  const groupedAvailability = selectedDoctor?.availability.reduce((acc, avail) => {
      (acc[avail.date] = acc[avail.date] || []).push(avail);
      return acc;
  }, {} as Record<string, Availability[]>);

  const availableDates = groupedAvailability ? Object.keys(groupedAvailability).sort() : [];
  
  // Render sort indicator
  const renderSortIndicator = (field: string) => {
    if (sortBy !== field) return null;
    return sortOrder === "asc" ? "↑" : "↓";
  };

  return (
    <div className="doctor-availability-container">
      <div className="table-header">
        <h2><Calendar size={20} /> Find a Doctor & Book Appointment</h2>
        <div className="table-controls">
          <div className="search-box">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search by name, specialization..."
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
          <div className="filter-dropdown">
            <span>Sort by: </span>
            <select value={`${sortBy}-${sortOrder}`} onChange={(e) => {
              const [field, order] = e.target.value.split('-');
              setSortBy(field);
              setSortOrder(order);
            }}>
              <option value="rating-desc">Rating (High to Low)</option>
              <option value="rating-asc">Rating (Low to High)</option>
              <option value="experience-desc">Experience (High to Low)</option>
              <option value="experience-asc">Experience (Low to High)</option>
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Doctor</th>
              <th>Specialization</th>
              <th onClick={() => handleSortChange("experience")} className="sortable-header">
                Experience {renderSortIndicator("experience")}
              </th>
              <th onClick={() => handleSortChange("rating")} className="sortable-header">
                Rating {renderSortIndicator("rating")}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDoctors.length > 0 ? (
              filteredDoctors.map((doctor) => (
                <tr key={doctor.id}>
                  <td className="doctor-cell">
                    <img
                      src={`https://api.multiavatar.com/${doctor.name}.svg`}
                      alt={doctor.name}
                      className="doctor-avatar"
                    />
                    <div>
                      <div className="doctor-name">{doctor.name}</div>
                      <div className="doctor-qualification">{doctor.qualification}</div>
                    </div>
                  </td>
                  <td>{doctor.specialization}</td>
                  <td>{doctor.exp} years</td>
                  <td>
                    <span className="rating-badge">
                      <Star size={12} fill="currentColor" /> {doctor.rating.toFixed(1)}
                    </span>
                  </td>
                  <td>
                    <button
                      className="view-button"
                      onClick={() => setSelectedDoctor(doctor)}
                    >
                      Book Appointment
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="no-results">
                  <div className="no-results-content">
                    No doctors found matching your search criteria.
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedDoctor && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-modal" onClick={closeModal}><X size={20} /></button>
            <div className="modal-header">
              <img src={`https://api.multiavatar.com/${selectedDoctor.name}.svg`} alt={selectedDoctor.name} className="modal-avatar" />
              <div>
                <h3>Dr. {selectedDoctor.name}</h3>
                <p className="specialization">{selectedDoctor.specialization}</p>
                <div className="doctor-meta">
                  <span>{selectedDoctor.exp} years experience</span>
                  <span className="rating">
                    <Star size={14} fill="currentColor" /> {selectedDoctor.rating.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="availability-section">
              <h4><Calendar size={18} /> Select an Available Date</h4>
              <div className="date-options">
                {availableDates.length > 0 ? (
                  availableDates.map(date => (
                    <button 
                      key={date} 
                      className={`date-option ${selectedDate === date ? "selected" : ""}`} 
                      onClick={() => { setSelectedDate(date); setSelectedSlot(""); }}
                    >
                      {new Date(date).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric"})}
                    </button>
                  ))
                ) : (
                  <p className="no-availability">No available dates found.</p>
                )}
              </div>

              {selectedDate && (
                <>
                  <h4><Clock size={18} /> Select a Time Slot</h4>
                  <div className="slot-options">
                    {getAvailableSlotsForDate(selectedDate).map((avail) => (
                      <button 
                        key={avail.availabilityId} 
                        className={`slot-option ${selectedSlot === avail.timeSlot ? "selected" : ""}`} 
                        onClick={() => setSelectedSlot(avail.timeSlot)}
                      >
                        {avail.timeSlot}
                      </button>
                    ))}
                  </div>
                </>
              )}
              
              {selectedSlot && (
                  <>
                    <h4>Reason for Visit <span className="required">*</span></h4>
                    <textarea 
                      value={reason} 
                      onChange={(e) => setReason(e.target.value)} 
                      placeholder="Please describe the reason for your visit (minimum 5 characters)..." 
                      className="reason-textarea" 
                      rows={3}
                    />
                    <div className="char-count">{reason.length}/5 characters minimum</div>
                    <button 
                      className="book-button" 
                      onClick={handleBookAppointment} 
                      disabled={isBooking || reason.trim().length < 5}
                    >
                      {isBooking ? "Requesting..." : "Request Appointment"}
                    </button>
                  </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorAvailability;