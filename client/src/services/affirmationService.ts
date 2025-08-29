import axios from 'axios';

export interface Affirmation {
  _id: string;
  text: string;
  category: string;
  tags: string[];
  isActive: boolean;
  createdAt: string;
}

export interface UserAffirmation {
  _id: string;
  user: string;
  affirmation: Affirmation;
  date: string;
  isCompleted: boolean;
  completedAt?: string;
  personalizedText?: string;
  rating?: number;
  createdAt: string;
}

export interface AffirmationHistory {
  affirmations: UserAffirmation[];
  totalPages: number;
  currentPage: number;
  total: number;
}

export const affirmationService = {
  // Get daily affirmation
  getDailyAffirmation: async (): Promise<UserAffirmation> => {
    const response = await axios.get('/api/affirmations/daily');
    return response.data;
  },

  // Complete daily affirmation
  completeAffirmation: async (data: { rating?: number; personalizedText?: string }): Promise<UserAffirmation> => {
    const response = await axios.post('/api/affirmations/complete', data);
    return response.data;
  },

  // Get affirmation history
  getHistory: async (page: number = 1, limit: number = 10): Promise<AffirmationHistory> => {
    const response = await axios.get(`/api/affirmations/history?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Get categories
  getCategories: async (): Promise<string[]> => {
    const response = await axios.get('/api/affirmations/categories');
    return response.data;
  }
};

export default affirmationService;

