import axios from "axios";

const API_URL = "http://localhost:8000/api";

export const register = (userData) => axios.post(`${API_URL}/register`, userData);
export const login = (userData) => axios.post(`${API_URL}/login`, userData);
export const logout = () => localStorage.removeItem("token");
export const getToken = () => localStorage.getItem("token");
