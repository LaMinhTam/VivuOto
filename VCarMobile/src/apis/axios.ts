import axios from 'axios';
import axiosRetry from 'axios-retry';
import {API_BASE_URL} from '../constants';
import {getTokens} from '../utils/auth';

const RETRIES = 1;

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  validateStatus: (status) => {
    return status >= 200 && status < 500;
  },
});

// Apply axios-retry to the standard axios instance
axiosRetry(axiosInstance, {
  retries: RETRIES, // Number of retry attempts
  retryDelay: axiosRetry.exponentialDelay, // Exponential back-off delay between retries
  retryCondition: error => {
    // Retry for specific error codes or conditions
    return error.response ? error.response.status >= 500 : false;
  },
});

export const axiosPrivate = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  validateStatus: (status) => {
    return status >= 200 && status < 500;
  },
});

axiosPrivate.interceptors.request.use(
  async config => {
    try {
      const token = await getTokens();
      let accessToken = token?.accessToken ?? '';
      if (accessToken) {
        config.headers['Authorization'] = `Bearer ${accessToken}`;
      }
    } catch (error) {
      console.error('Error getting tokens', error);
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

axiosRetry(axiosPrivate, {
  retries: RETRIES,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: error => {
    return error.response ? error.response.status >= 500 : false;
  },
});
