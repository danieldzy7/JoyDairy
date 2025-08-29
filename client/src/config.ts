// API Configuration for different environments
export const API_CONFIG = {
  // Development
  development: {
    baseURL: 'http://localhost:5000'
  },
  
  // Production - Update these URLs when you deploy your backend
  production: {
    // Replace with your actual backend URL (Railway, Render, Heroku, etc.)
    baseURL: 'https://your-backend-url.com'
  }
};

export const getApiBaseUrl = () => {
  const env = process.env.NODE_ENV || 'development';
  return API_CONFIG[env as keyof typeof API_CONFIG]?.baseURL || API_CONFIG.development.baseURL;
};
