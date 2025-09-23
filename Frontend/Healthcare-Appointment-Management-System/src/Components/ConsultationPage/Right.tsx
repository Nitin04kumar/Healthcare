import { useEffect, useState } from "react";
import HistoryCard from "./HistoryCard";
import styles from "./Right.module.css";

type ConsultationProps = {
  patientId: string | number;
};

interface Consultation {
  id: string;
  patientId: string | number;
  date: string;
  symptoms: string;
  prescription: { medicine: string }[];
}

const Right: React.FC<ConsultationProps> = ({ patientId }) => {
  const [consultations, setConsultations] = useState<Consultation[]>([]);

  useEffect(() => {
    const fetchConsultations = async () => {
      try {
        const res = await fetch("/api/consultations");
        const data = await res.json();
        setConsultations(data);
      } catch (error) {
        console.error("Error fetching consultations:", error);
      }
    };
    fetchConsultations();
  }, []);

  const patientConsultations = consultations.filter(
    (c) => String(c.patientId) === String(patientId)
  );

  return (
    <span className={styles.left}>
      <h3 className={styles.heading}>
        <u>
          <center>History</center>{" "}
        </u>
      </h3>

      {patientConsultations.length > 0 ? (
        patientConsultations.map((c) => (
          <HistoryCard
            key={c.id}
            Symtoms={c.symptoms}
            Date={c.date}
            Prescription={c.prescription.map((p) => p.medicine)}
          />
        ))
      ) : (
        <p>No history available for this patient.</p>
      )}
    </span>
  );
};

export default Right;
