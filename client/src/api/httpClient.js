import axios from "axios";

const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  timeout: 15000,
});

export function unwrapResponse(response) {
  if (!response?.data?.success) {
    throw new Error(response?.data?.message || "Request failed.");
  }

  return response.data.data;
}

export default httpClient;
