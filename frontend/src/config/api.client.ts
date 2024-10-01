import axios from "axios";
import queryClient from "./queryClient";
import { UNAUTHORIZED } from "../constants/http.mjs";
import { navigate } from "../lib/navigation";

const options = {
  baseURL: import.meta.env.VITE_BACKEND_BASE_URL,
  withCredentials: true, // to ensure cookies like refreshToken are sent
};

// create a separate client for refreshing the access token
// to avoid infinite loops with the error interceptor
const TokenRefreshClient = axios.create(options);
TokenRefreshClient.interceptors.response.use((response) => response.data);

const API = axios.create(options);

API.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const { config, response } = error;
    const { status, data } = response || {};
    
    console.log("Interceptor error response:", response);
    console.log("Error status:", status);
    console.log("Error data:", data);

    // Sprawdź, czy access token wygasł
    if (status === UNAUTHORIZED && data?.errorCode === "InvalidAccesToken") {
      console.log("Access token expired, trying to refresh the token...");

      try {
        // Spróbuj odświeżyć access token za pomocą refresh tokena
        await TokenRefreshClient.get("/auth/refresh");

        // Powtórz oryginalne żądanie z nowym tokenem
        return API(config);
      } catch (refreshError) {
        console.error("Error during token refresh:", refreshError);

        // Jeżeli refresh token również zwróci 401 (Unauthorized)
        if (refreshError.response?.status === UNAUTHORIZED) {
          console.log("Refresh token invalid, logging out user...");

     
        }

        // W przypadku innych błędów rzucaj je dalej
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject({ status, ...data });
  }
);


export default API;
