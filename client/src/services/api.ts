import axios from 'axios';
import { getApiBaseUrl } from '../config';

// Set base URL for API calls
const API_BASE_URL = getApiBaseUrl();
axios.defaults.baseURL = API_BASE_URL;

// Enhanced timeout configuration for mobile
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
axios.defaults.timeout = isMobile ? 15000 : 10000; // Longer timeout for mobile

// Add request interceptor for better mobile handling
axios.interceptors.request.use(
  (config) => {
    // Add mobile-specific headers
    config.headers['X-Device-Type'] = isMobile ? 'mobile' : 'desktop';
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for better error handling
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    // Enhanced error logging for debugging
    console.error('API Error:', {
      message: error.message,
      status: error.response?.status,
      url: error.config?.url,
      method: error.config?.method,
      isMobile,
      userAgent: navigator.userAgent
    });
    return Promise.reject(error);
  }
);

export interface Entry {
  _id: string;
  user: string;
  date: string;
  gratitude: string;
  manifestation: string;
  reflection: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEntryData {
  date: string;
  gratitude: string;
  manifestation: string;
  reflection: string;
}

export const entryService = {
  // Get all entries for the user
  getAllEntries: async (): Promise<Entry[]> => {
    const response = await axios.get('/api/entries');
    return response.data;
  },

  // Get entry for a specific date
  getEntryByDate: async (date: string): Promise<Entry> => {
    const response = await axios.get(`/api/entries/${date}`);
    return response.data;
  },

  // Create or update an entry
  createOrUpdateEntry: async (entryData: CreateEntryData): Promise<Entry> => {
    const response = await axios.post('/api/entries', entryData);
    return response.data;
  },

  // Delete an entry
  deleteEntry: async (date: string): Promise<void> => {
    await axios.delete(`/api/entries/${date}`);
  }
};

export default entryService;
