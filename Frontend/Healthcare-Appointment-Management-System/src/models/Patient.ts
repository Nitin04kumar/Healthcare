export interface Patient {
  id: number | string;
  name: string;
  email: string;
  password: string;
  age: number;
  gender: string;
  dob: string;
  bloodType: string;
  phone: string;
  address: string;
  demo_image: string | null;
  dist?: string;
  state?: string;
}
