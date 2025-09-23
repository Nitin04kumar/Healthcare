import ClinicalNotes from "./ClinicalNotes";
import styles from "./Content.module.css";
import { useState } from "react";
import Prescription from "./Prescription";

type ConsultationProps = {
  patientId: string;
};

const Content: React.FC<ConsultationProps> = ({ patientId }) => {
  const [activeTab, setActiveTab] = useState("notes");
  return (
    <div className={styles.card3}>
      <div className={styles.buttonRow}>
        <span
          className={`${styles.button} ${
            activeTab === "notes" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("notes")}
        >
          Clinical Notes
        </span>
        <span
          className={`${styles.button} ${
            activeTab === "prescription" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("prescription")}
        >
          Prescription
        </span>
      </div>

      <div className={styles.content}>
        {activeTab === "prescription" ? (
          <Prescription patientId={patientId} />
        ) : (
          <ClinicalNotes patientId={patientId} />
        )}
      </div>
    </div>
  );
};

export default Content;
