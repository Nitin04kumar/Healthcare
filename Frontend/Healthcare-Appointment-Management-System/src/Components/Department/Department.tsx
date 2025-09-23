import React from "react";
import "./department.css";
import assetsData from "../../assets/assetsData";

const Department: React.FC = () => {
  const departmentsData = [
    {
      icon: assetsData.s1,
      title: "Cardiology",
      description:
        "Expert care for heart conditions with advanced diagnostic and treatment options.",
    },
    {
      icon: assetsData.s2,
      title: "Neurology",
      description:
        "Comprehensive care for neurological disorders with a team of specialists.",
    },
    {
      icon: assetsData.s3,
      title: "Pediatrics",
      description:
        "Compassionate care for children from infancy through adolescence.",
    },
    {
      icon: assetsData.s4,
      title: "Diagnosis",
      description:
        "Accurate and timely diagnosis using state-of-the-art imaging and lab services.",
    },
  ];

  return (
    <div className="department-container">
      <h2 className="department-title">Our Departments</h2>
      <p className="department-subtitle">
        Explore our specialized departments dedicated to providing comprehensive
        healthcare services.
      </p>

      <div className="department-grid">
        {departmentsData.map((dept, index) => (
          <div key={index} className="department-card">
            <img src={dept.icon} alt={dept.title} className="department-icon" />
            <h3 className="department-card-title">{dept.title}</h3>
            <p className="department-card-text">{dept.description}</p>
          </div>
        ))}
      </div>

      <div className="department__btn">
        <button className="department__btn--more">View More Departments</button>
      </div>
    </div>
  );
};

export default Department;
