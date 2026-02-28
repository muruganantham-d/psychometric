import axios from "axios";

const httpClient = axios.create({
  baseURL: "/api",
  timeout: 15000,
});

export function unwrapResponse(response) {
  if (!response?.data?.success) {
    throw new Error(response?.data?.message || "Request failed.");
  }

  return response.data.data;
}

export default httpClient;
