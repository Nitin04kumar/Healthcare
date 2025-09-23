import styles from "./ProfileInfo.module.css";
import profile from "../../assets/profil1.png";
import AddNewRecord from "./AddNewRecord";
import { useEffect, useState } from "react";

interface Patient {
  id: string;
  name: string;
  age: string;
  address: string;
  dob: string;
  bloodType: string;
}

type ConsultationProps = {
  patientId: string;
};

const ProfileInfo: React.FC<ConsultationProps> = ({ patientId }) => {
  const [showForm, setShowForm] = useState(false);
  const [patient, setPatient] = useState<Patient | null>(null);

  useEffect(() => {
    fetch("/api/patient")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load data");
        return res.json();
      })
      .then((data) => {
        const found = data.find(
          (p: Patient) => String(p.id) === String(patientId)
        );
        setPatient(found || null);
      })
      .catch((err) => console.error("Error:", err));
  }, [patientId]);

  const handleOpen = () => setShowForm(true);
  const handleClose = () => setShowForm(false);

  return (
    <div className={styles.card1}>
      <img src={profile} alt="Profile" className={styles.profileImage} />
      <span className={styles.details}>
        <p>
          <b>{patient?.name ?? "Loading Name..."}</b>
        </p>
        <p>
          <b>DOB :</b> {patient?.dob ?? "N/A"}
        </p>
        <p>
          <b>Address :</b> {patient?.address ?? "N/A"}
        </p>
      </span>
      <span className={styles.newRecord} onClick={handleOpen}>
        New
      </span>
      {showForm && <AddNewRecord handleClose={handleClose} />}
    </div>
  );
};

export default ProfileInfo;
