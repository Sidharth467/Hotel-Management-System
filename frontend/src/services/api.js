import axios from "axios";

const API = axios.create({
  baseURL: "https://hotel-management-system-boy7.onrender.com/api/",
});

export default API;
