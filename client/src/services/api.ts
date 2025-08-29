import axios from 'axios';

// Set base URL for API calls
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '' 
  : 'http://localhost:5000';

axios.defaults.baseURL = API_BASE_URL;

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
