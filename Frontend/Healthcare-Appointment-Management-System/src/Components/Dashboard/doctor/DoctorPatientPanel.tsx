import React, { useState } from 'react';
import MyPatientsList from './Mypatients';
import PatientHistoryView from './PatientHistoryView';
import './DoctorPatientPanel.css'


const DoctorPatientPanel: React.FC = () => {
  // This state will hold the ID of the patient the doctor wants to view.
  // If it's null, we show the list. If it has an ID, we show the history.
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);

  // This function is passed to the list component.
  // When a patient is clicked, it sets the patient ID in this parent's state.
  const handlePatientSelect = (patientId: number) => {
    setSelectedPatientId(patientId);
  };

  // This function is passed to the history component.
  // It allows the user to go back to the list by clearing the selected patient ID.
  const handleBackToList = () => {
    setSelectedPatientId(null);
  };

  return (
    <div>
      {selectedPatientId === null ? (
        // If no patient is selected, show the list of patients.
        <MyPatientsList onPatientSelect={handlePatientSelect} />
      ) : (
        // If a patient ID is set, show the history for that patient.
        <PatientHistoryView patientId={selectedPatientId} onBack={handleBackToList} />
      )}
    </div>
  );
};

export default DoctorPatientPanel;