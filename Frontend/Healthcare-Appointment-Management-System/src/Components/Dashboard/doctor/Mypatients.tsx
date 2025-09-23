import React, { useState, useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';
import { Search, User, ChevronUp, ChevronDown } from 'lucide-react';
import { useAuth } from '../../../Context/AuthContext';
import type { PatientForDoctor } from '../../../api/types';
import { getAssociatedPatients } from '../../../api/doctorService';
import './My_patients.css';

// Props to handle navigation to the detail view
interface MyPatientsListProps {
  onPatientSelect: (patientId: number) => void;
}

const MyPatientsList: React.FC<MyPatientsListProps> = ({ onPatientSelect }) => {
  const { user } = useAuth();
  const [patients, setPatients] = useState<PatientForDoctor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState<{ key: keyof PatientForDoctor; direction: 'ascending' | 'descending' } | null>(null);

  useEffect(() => {
    const fetchPatients = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const data = await getAssociatedPatients();
        setPatients(data);
      } catch (error) {
        toast.error("Failed to fetch patient list.");
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, [user]);

  // Client-side filtering and sorting
  const filteredAndSortedPatients = useMemo(() => {
    let filtered = patients.filter(p =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortConfig !== null) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return filtered;
  }, [patients, searchTerm, sortConfig]);

  const requestSort = (key: keyof PatientForDoctor) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig?.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  const getSortIcon = (key: keyof PatientForDoctor) => {
    if (!sortConfig || sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' ? <ChevronUp size={16} /> : <ChevronDown size={16} />;
  };

  if (loading) {
    return <div className="patient-list-container">Loading patients...</div>;
  }

  return (
    <div className="patient-list-container">
      <div className="list-header">
        <h2>My Patients</h2>
        <div className="search-box">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search by patient name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th onClick={() => requestSort('name')}>Patient Name {getSortIcon('name')}</th>
              <th onClick={() => requestSort('age')}>Age {getSortIcon('age')}</th>
              <th onClick={() => requestSort('gender')}>Gender {getSortIcon('gender')}</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedPatients.map(patient => (
              <tr key={patient.patientId}>
                <td><User size={16} /> {patient.name}</td>
                <td>{patient.age}</td>
                <td>{patient.gender}</td>
                <td>
                  <button
                    className="view-history-btn"
                    onClick={() => onPatientSelect(patient.patientId)}
                  >
                    View History
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyPatientsList;