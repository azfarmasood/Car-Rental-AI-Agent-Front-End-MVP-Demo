import axios from "axios";

const api = axios.create({
  baseURL: "https://79e66ea0060e.ngrok-free.app/api",
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
});

export interface Car {
  id: string;
  name: string;
  category: string;
  daily_rate: number;
  fuel_type: string;
  features: string[];
  available: boolean;
}

export default api;
