import styles from "./HistoryCard.module.css";

type HistoryCardProps = {
  Symtoms: string;
  Date: string;
  Prescription: string[];
};

export default function HistoryCard({
  Symtoms,
  Date,
  Prescription,
}: HistoryCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.date}>{Date}</div>
      <div className={styles.symtoms}>
        <b>{Symtoms}</b>
      </div>
      <ul className={styles.prescriptionList}>
        {Prescription.map((item, index) => (
          <li key={index}>- {item}</li>
        ))}
      </ul>
    </div>
  );
}
