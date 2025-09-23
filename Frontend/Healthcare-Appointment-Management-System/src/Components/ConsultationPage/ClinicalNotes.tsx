import styles from "./ClinicalNotes.module.css";
import { useEffect, useState } from "react";

interface consultations {
  id: string;
  patientId: string;
  symptoms: string;
  bloodPressure: number;
  height: number;
  weight: number;
  description: string;
}

type ConsultationProps = {
  patientId: string;
};

const ClinicalNotes: React.FC<ConsultationProps> = ({ patientId }) => {
  const [consultation, setConsultation] = useState<consultations | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/consultations")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load consultations");
        return res.json();
      })
      .then((data: consultations[]) => {
        const records = data.filter(
          (c) => String(c.patientId) === String(patientId)
        );
        if (records.length > 0) {
          setConsultation(records[0]);
        }
      })
      .catch((err) => console.error("Error:", err))
      .finally(() => setLoading(false));
  }, [patientId]);

  if (loading) return <p>Loading consultation...</p>;
  if (!consultation) return <p>No consultation found {patientId} </p>;

  return (
    <div className={styles.card}>
      <span className={styles.Symptoms}>
        <h3>Symptoms</h3>
        <div className={styles.data}>{consultation.symptoms}</div>
      </span>
      <span className={styles.AdditionalDetails}>
        <br />
        <h3>Additional Details</h3>
        <div className={styles.data}>
          <b> Height : </b>
          {consultation.height} cm
          <br />
          <b> Weight : </b>
          {consultation.weight} kg
          <br />
          <b> BP : </b>
          {consultation.bloodPressure}
          <br />
          <br />
        </div>
      </span>
      <span className={styles.Description}>
        <h3>Description</h3>
        <div className={styles.data}>{consultation.description}</div>
      </span>
    </div>
  );
};

export default ClinicalNotes;
