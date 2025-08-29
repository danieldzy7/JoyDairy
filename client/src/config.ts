// API Configuration for different environments
export const API_CONFIG = {
  // Development
  development: {
    baseURL: 'http://localhost:5000'
  },
  
  // Production - Same domain (frontend and backend served together)
  production: {
    baseURL: '' // Empty string means same domain
  }
};

export const getApiBaseUrl = () => {
  const env = process.env.NODE_ENV || 'development';
  return API_CONFIG[env as keyof typeof API_CONFIG]?.baseURL || API_CONFIG.development.baseURL;
};
