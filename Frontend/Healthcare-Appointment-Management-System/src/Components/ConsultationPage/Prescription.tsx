import styles from "./Prescription.module.css";
import { useEffect, useState } from "react";

interface PrescriptionItem {
  medicine: string;
  dosage: string;
  frequency: string;
  duration: string;
}

interface Consultation {
  id: string;
  patientId: string;
  prescription: PrescriptionItem[];
}

type PrescriptionProps = {
  patientId: string;
};

const Prescription: React.FC<PrescriptionProps> = ({ patientId }) => {
  const [prescriptions, setPrescriptions] = useState<PrescriptionItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/consultations")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load consultations");
        return res.json();
      })
      .then((data: Consultation[]) => {
        const record = data.find(
          (c) =>
            String(c.patientId) === String(patientId) &&
            c.prescription?.length > 0
        );
        if (record) {
          setPrescriptions(record.prescription);
        }
      })
      .catch((err) => console.error("Error:", err))
      .finally(() => setLoading(false));
  }, [patientId]);

  if (loading) return <p>Loading prescriptions...</p>;
  if (prescriptions.length === 0)
    return <p>No prescriptions found for patient </p>;

  return (
    <div className={styles.card}>
      <div className={styles.cardRow}>
        {prescriptions.map((item, index) => (
          <div key={index} className={styles.medicineCard}>
            <div className={styles.medicineName}>{item.medicine}</div>
            <div className={styles.instruction}>
              {item.dosage} | {item.frequency} | {item.duration}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Prescription;
