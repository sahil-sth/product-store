import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
// check if api url is missing
if (!API_URL) {
  throw new Error("Missing API_URL configuration");
}

const axiosService = axios.create({
  baseUrl: API_URL,
  withCredentials: true,
});

export default axiosService;
