import styles from "./AddNewRecord.module.css";
import { useState } from "react";

export default function AddNewRecord({
  handleClose,
}: {
  handleClose: () => void;
}) {
  const [symptoms, setSymptoms] = useState("");
  const [bp, setBp] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [description, setDescription] = useState("");
  const [medication, setMedication] = useState("");
  const [instruction, setInstruction] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      patientId: "P001",
      doctorId: "D001",
      symptoms,
      bloodPressure: bp,
      height,
      weight,
      description,
      notes: instruction,
      prescription: [medication],
      status: "pending",
    };

    try {
      const res = await fetch("/api/consultant-record", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Failed to save record");
      }

      const data = await res.json();
      console.log("Record saved via API:", data);

      handleClose();
    } catch (err) {
      console.error("Error saving record:", err);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <u>Clinical Notes</u>

        <form onSubmit={handleSubmit}>
          <h3>Symptoms</h3>
          <textarea
            rows={4}
            cols={50}
            name="symptoms"
            placeholder="Enter symptoms"
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
          />

          <h3>Additional Details</h3>
          <div className={styles.additionalDetails}>
            <input
              type="text"
              name="bp"
              placeholder="Blood Pressure"
              value={bp}
              onChange={(e) => setBp(e.target.value)}
            />
            <input
              type="text"
              name="height"
              placeholder="Height"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
            />
            <input
              type="text"
              name="weight"
              placeholder="Weight"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
          </div>

          <h3>Description</h3>
          <textarea
            name="description"
            rows={4}
            cols={50}
            placeholder="Enter detailed description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <h3>
            <u>Prescription</u>
          </h3>
          <label htmlFor="medication" className={styles.Medication}>
            Medication:
          </label>
          <select
            name="medication"
            id="medication"
            value={medication}
            onChange={(e) => setMedication(e.target.value)}
          >
            <option value="" disabled>
              -- Select Medication --
            </option>
            <option value="paracetamol">Paracetamol</option>
            <option value="antibiotic">Antibiotic</option>
          </select>

          <h3>
            <label htmlFor="instruction">Instruction:</label>
          </h3>
          <textarea
            id="instruction"
            rows={4}
            cols={50}
            name="instruction"
            placeholder="..."
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
          />

          <div className={styles.buttonGroup}>
            <button type="submit">Submit</button>
            <button type="button" onClick={handleClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
