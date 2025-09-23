// ConsultationForm.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';
import './Consultation_form.css';
import type { Consultation, CreateConsultationPayload } from '../../api/types';
import { createConsultation, getConsultationForAppointment } from '../../api/consultationService';

const ConsultationForm: React.FC = () => {
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const navigate = useNavigate();
  const [consultation, setConsultation] = useState<Consultation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    symptoms: '',
    bloodPressure: '',
    height: '',
    weight: '',
    description: '',
    notes: ''
  });

  // Fetch existing consultation if available
  useEffect(() => {
    const fetchConsultation = async () => {
      if (!appointmentId) return;
      
      try {
        const consultationData = await getConsultationForAppointment(parseInt(appointmentId));
        setConsultation(consultationData);
        setFormData({
          symptoms: consultationData.symptoms || '',
          bloodPressure: consultationData.bloodPressure || '',
          height: consultationData.height?.toString() || '',
          weight: consultationData.weight?.toString() || '',
          description: consultationData.description || '',
          notes: consultationData.notes || ''
        });
      } catch (error) {
        console.log('No existing consultation found, creating new one');
      } finally {
        setIsLoading(false);
      }
    };

    fetchConsultation();
  }, [appointmentId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appointmentId) return;
    
    setIsSubmitting(true);
    try {
      const payload: CreateConsultationPayload = {
        symptoms: formData.symptoms,
        bloodPressure: formData.bloodPressure,
        height: formData.height ? parseInt(formData.height) : undefined,
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        description: formData.description,
        notes: formData.notes,
        status: 'Completed'
      };
      
      await createConsultation(parseInt(appointmentId), payload);
      toast.success('Consultation saved successfully!');
      navigate('/dashboard/doctor');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save consultation.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="consultation-loading">Loading consultation form...</div>;
  }

  return (
    <div className="consultation-container">
      <div className="consultation-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </button>
        <h2>Patient Consultation</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="consultation-form">
        <div className="form-section">
          <h3>Patient Symptoms</h3>
          <textarea
            name="symptoms"
            value={formData.symptoms}
            onChange={handleInputChange}
            placeholder="Describe patient symptoms..."
            rows={3}
            required
          />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label>Blood Pressure</label>
            <input
              type="text"
              name="bloodPressure"
              value={formData.bloodPressure}
              onChange={handleInputChange}
              placeholder="e.g., 120/80"
            />
          </div>
          
          <div className="form-group">
            <label>Height (cm)</label>
            <input
              type="number"
              name="height"
              value={formData.height}
              onChange={handleInputChange}
              placeholder="Height in cm"
            />
          </div>
          
          <div className="form-group">
            <label>Weight (kg)</label>
            <input
              type="number"
              step="0.1"
              name="weight"
              value={formData.weight}
              onChange={handleInputChange}
              placeholder="Weight in kg"
            />
          </div>
        </div>
        
        <div className="form-section">
          <h3>Diagnosis Description</h3>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Provide diagnosis details..."
            rows={4}
            required
          />
        </div>
        
        <div className="form-section">
          <h3>Notes & Recommendations</h3>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            placeholder="Add any additional notes or recommendations..."
            rows={3}
          />
        </div>
        
        <div className="form-actions">
          <button 
            type="button" 
            className="btn-cancel"
            onClick={() => navigate('/appointments')}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn-submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save Consultation'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ConsultationForm;