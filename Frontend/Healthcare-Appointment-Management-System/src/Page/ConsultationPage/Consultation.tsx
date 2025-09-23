import styles from "./ConsultationMain.module.css";

import Left from "../../Components/ConsultationPage/Left.tsx";
import Right from "../../Components/ConsultationPage/Right.tsx";

type ConsultationProps = {
  patientId: string;
};

const Consultation: React.FC<ConsultationProps> = ({ patientId }) => {
  return (
    <div className={styles.dashboardMain}>
      <Left patientId={patientId} />

      <Right patientId={patientId} />
    </div>
  );
};

export default Consultation;
