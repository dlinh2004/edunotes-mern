import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "https://edunotes-mern.onrender.com/api";

export const api = axios.create({
  baseURL: `${API_BASE}/notes`,
  headers: { "Content-Type": "application/json" }
});