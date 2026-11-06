import axios from 'axios';

// One shared axios instance for all API calls.
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
});

// Turns an axios error into a message we can show to the user.
export function getErrorMessage(error) {
  return (
    error.response?.data?.message ||
    'Unable to load batches. Please check that the server is running and try again.'
  );
}
