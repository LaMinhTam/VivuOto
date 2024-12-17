import axios from "axios";
import axiosRetry from "axios-retry";
import { getAccessToken } from "../utils";
import { API_BASE_URL } from "../config/apiConfig";

const RETRIES = 1;

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  validateStatus: (status) => {
    return status >= 200 && status < 500;
  },
});

axiosRetry(axiosInstance, {
  retries: RETRIES,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) => {
    return error.response ? error.response.status >= 500 : false;
  },
});

export const axiosPrivate = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  validateStatus: (status) => {
    return status >= 200 && status < 500;
  },
});

axiosPrivate.interceptors.request.use(
  async (config) => {
    try {
      const token = getAccessToken();
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Error getting tokens", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosRetry(axiosPrivate, {
  retries: RETRIES,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) => {
    return error.response ? error.response.status >= 500 : false;
  },
});
