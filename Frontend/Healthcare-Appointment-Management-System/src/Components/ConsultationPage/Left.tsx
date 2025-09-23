import Content from "./Content";
import ProfileInfo from "./ProfileInfo";
import styles from "./Left.module.css";

type ConsultationProps = {
  patientId: string;
};

const Rightt: React.FC<ConsultationProps> = ({ patientId }) => {
  return (
    <span className={styles.right}>
      <ProfileInfo patientId={patientId} />

      <Content patientId={patientId} />
    </span>
  );
};

export default Rightt;
