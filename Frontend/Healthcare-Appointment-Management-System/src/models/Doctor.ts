
export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  email: string;
  phone: string;
  experience: number;
  qualifications: string;
  availability: string[];
  image?: string;
}
