import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { patientHistory, consultations } from "../../../../mocks(data)/data";
import { useAuth } from "../../../../Context/AuthContext";
import {
  Search,
  Calendar,
  User,
  FileText,
  ChevronDown,
  ChevronUp,
  Filter,
  Stethoscope,
  Clock,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import "./PatientList.css";

type PatientHistory = {
  id: number;
  patientId: number;
  patientName: string;
  date: string;
  doctorId: number;
  diagnosis: string;
  treatment: string;
  status: string;
  notes: string;
};

type Props = {
  setActive: (view: string) => void;
  setPatientId: (id: string) => void;
};

const PatientList: React.FC<Props> = ({ setActive, setPatientId }) => {
  const { user } = useAuth();
  const currentDoctorId = user?.id;

  const [allHistory, setAllHistory] = useState<PatientHistory[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<PatientHistory[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isLoading, setIsLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: string;
  } | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<number | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoading(true);
      try {
        setTimeout(() => {
          const enhancedHistory = patientHistory
            .filter((record) => record.doctorId === currentDoctorId)
            .map((record) => {
              const consultation = consultations.find(
                (c) => c.id === record.id
              );
              return {
                ...record,
                treatment: consultation?.prescription || record.treatment,
                notes: consultation?.notes || "",
              };
            });

          setAllHistory(enhancedHistory);
          setFilteredHistory(enhancedHistory);
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error("Error fetching patient history:", error);
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [currentDoctorId]);

  useEffect(() => {
    const filtered = allHistory.filter((record) => {
      const matchesSearch =
        record.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.diagnosis.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "ALL" || record.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
    setFilteredHistory(filtered);
  }, [searchTerm, statusFilter, allHistory]);

  const handleStatusChange = (status: string) => {
    setStatusFilter(status);
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return (
          <span className="status-badge completed">
            <CheckCircle size={14} />
            Completed
          </span>
        );
      case "FOLLOWUP_NEEDED":
        return (
          <span className="status-badge followup">
            <AlertCircle size={14} />
            Follow-up
          </span>
        );
      default:
        return <span className="status-badge">Unknown</span>;
    }
  };

  const requestSort = (key: string) => {
    let direction = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedHistory = React.useMemo(() => {
    if (!sortConfig) return filteredHistory;

    return [...filteredHistory].sort((a, b) => {
      const aValue = a[sortConfig.key as keyof PatientHistory];
      const bValue = b[sortConfig.key as keyof PatientHistory];

      if (aValue < bValue) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
      return 0;
    });
  }, [filteredHistory, sortConfig]);

  const getSortIcon = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) return null;
    return sortConfig.direction === "ascending" ? (
      <ChevronUp size={16} className="sort-icon" />
    ) : (
      <ChevronDown size={16} className="sort-icon" />
    );
  };

  const toggleRecordDetails = (id: number) => {
    setSelectedRecord(selectedRecord === id ? null : id);
  };

  const handleConsultationClick = (patientId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPatientId(patientId);
    setActive("consultation");
  };

  return (
    <div className="patient-history">
      <div className="patient-history__header">
        <h1 className="patient-history__title">
          <Stethoscope size={24} />
          Patient History
        </h1>
        
        <div className="patient-history__controls">
          <div className="search-container">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search by patient or diagnosis..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="filter-container">
            <Filter size={16} />
            <select
              value={statusFilter}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="filter-select"
            >
              <option value="ALL">All Status</option>
              <option value="COMPLETED">Completed</option>
              <option value="FOLLOWUP_NEEDED">Follow-up Needed</option>
            </select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="patient-history__loading">
          <div className="loading-spinner"></div>
          <p>Loading patient history...</p>
        </div>
      ) : filteredHistory.length === 0 ? (
        <div className="patient-history__empty">
          <Stethoscope size={48} className="empty-icon" />
          <p>No patient history found</p>
          <p className="empty-subtext">
            {searchTerm || statusFilter !== "ALL" 
              ? "Try adjusting your search or filter criteria" 
              : "No patient records available yet"
            }
          </p>
        </div>
      ) : (
        <div className="patient-history__table-container">
          <table className="patient-history__table">
            <thead>
              <tr>
                <th onClick={() => requestSort("date")} className="sortable-header">
                  <div className="header-content">
                    <Calendar size={16} />
                    <span>Date</span>
                    {getSortIcon("date")}
                  </div>
                </th>
                <th onClick={() => requestSort("patientName")} className="sortable-header">
                  <div className="header-content">
                    <User size={16} />
                    <span>Patient</span>
                    {getSortIcon("patientName")}
                  </div>
                </th>
                <th>Diagnosis</th>
                <th onClick={() => requestSort("status")} className="sortable-header">
                  <div className="header-content">
                    <span>Status</span>
                    {getSortIcon("status")}
                  </div>
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedHistory.map((record) => (
                <React.Fragment key={record.id}>
                  <tr 
                    className={`patient-history__row ${selectedRecord === record.id ? 'expanded' : ''}`}
                    onClick={() => toggleRecordDetails(record.id)}
                  >
                    <td className="date-cell">
                      <div className="cell-content">
                        <Calendar size={16} />
                        {formatDate(record.date)}
                      </div>
                    </td>
                    <td className="patient-cell">
                      <div className="cell-content">
                        <User size={16} />
                        {record.patientName}
                      </div>
                    </td>
                    <td className="diagnosis-cell">
                      <span className="diagnosis-text">{record.diagnosis}</span>
                    </td>
                    <td className="status-cell">
                      {getStatusBadge(record.status)}
                    </td>
                    <td className="actions-cell">
                      <button
                        className="view-details-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleRecordDetails(record.id);
                        }}
                      >
                        {selectedRecord === record.id ? "Hide Details" : "View Details"}
                      </button>
                    </td>
                  </tr>
                  
                  {selectedRecord === record.id && (
                    <tr className="patient-history__detail-row">
                      <td colSpan={5}>
                        <div className="record-details">
                          <div className="record-details__content">
                            <div className="detail-section">
                              <h4 className="detail-section__title">
                                <Stethoscope size={16} />
                                Treatment
                              </h4>
                              <p className="detail-section__text">{record.treatment}</p>
                            </div>
                            
                            {record.notes && (
                              <div className="detail-section">
                                <h4 className="detail-section__title">
                                  <FileText size={16} />
                                  Notes
                                </h4>
                                <p className="detail-section__text">{record.notes}</p>
                              </div>
                            )}
                            
                            <div className="detail-actions">
                              <button
                                className="consultation-btn"
                                onClick={(e) => handleConsultationClick(record.patientId.toString(), e)}
                              >
                                <FileText size={16} />
                                Consultation Notes
                              </button>
                              
                              {record.status === "FOLLOWUP_NEEDED" && (
                                <button className="followup-btn">
                                  <Clock size={16} />
                                  Schedule Follow-up
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PatientList;