import axios from 'axios';

export type MoodType = 'excellent' | 'good' | 'neutral' | 'low' | 'terrible';
export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

export interface MoodEntry {
  _id: string;
  user: string;
  date: string;
  mood: MoodType;
  moodScore: number;
  emotions: string[];
  intensity: number;
  triggers: string[];
  notes: string;
  energyLevel?: number;
  stressLevel?: number;
  sleepQuality?: number;
  timeOfDay?: TimeOfDay;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMoodData {
  mood: MoodType;
  moodScore: number;
  emotions?: string[];
  intensity: number;
  triggers?: string[];
  notes?: string;
  energyLevel?: number;
  stressLevel?: number;
  sleepQuality?: number;
  timeOfDay?: TimeOfDay;
  date?: string;
}

export interface MoodHistory {
  moods: MoodEntry[];
  totalPages: number;
  currentPage: number;
  total: number;
}

export interface MoodAnalytics {
  totalEntries: number;
  averageMood: string;
  averageEnergy: string;
  averageStress: string;
  moodDistribution: {
    excellent: number;
    good: number;
    neutral: number;
    low: number;
    terrible: number;
  };
  commonEmotions: { [key: string]: number };
  moodTrend: {
    date: string;
    moodScore: number;
    mood: MoodType;
  }[];
}

export const moodService = {
  // Create or update mood entry
  createMoodEntry: async (data: CreateMoodData): Promise<MoodEntry> => {
    const response = await axios.post('/api/moods', data);
    return response.data;
  },

  // Get mood entries
  getMoodEntries: async (page: number = 1, limit: number = 30, startDate?: string, endDate?: string): Promise<MoodHistory> => {
    let url = `/api/moods?page=${page}&limit=${limit}`;
    if (startDate && endDate) {
      url += `&startDate=${startDate}&endDate=${endDate}`;
    }
    const response = await axios.get(url);
    return response.data;
  },

  // Get mood entry by date
  getMoodByDate: async (date: string): Promise<MoodEntry> => {
    const response = await axios.get(`/api/moods/${date}`);
    return response.data;
  },

  // Get mood analytics
  getMoodAnalytics: async (period: number = 30): Promise<MoodAnalytics> => {
    const response = await axios.get(`/api/moods/analytics/trends?period=${period}`);
    return response.data;
  },

  // Delete mood entry
  deleteMoodEntry: async (date: string): Promise<void> => {
    await axios.delete(`/api/moods/${date}`);
  }
};

export default moodService;

