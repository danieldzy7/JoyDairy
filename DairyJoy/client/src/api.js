import axios from 'axios';

const api = axios.create({ baseURL: '/api', timeout: 60000 });

export const getProfile = () => api.get('/profile').then((r) => r.data);

export const getEntries = (limit = 60) =>
  api.get('/entries', { params: { limit } }).then((r) => r.data);
export const getEntry = (date) => api.get(`/entries/${date}`).then((r) => r.data);
export const saveEntry = (date, payload) =>
  api.put(`/entries/${date}`, payload).then((r) => r.data);
export const deleteEntry = (date) => api.delete(`/entries/${date}`).then((r) => r.data);
export const reflectEntry = (date) =>
  api.post(`/entries/${date}/reflect`).then((r) => r.data);
export const summarizeEntry = (date) =>
  api.post(`/entries/${date}/summary`).then((r) => r.data);
export const polishJoy = (text, style = 'warm') =>
  api.post('/entries/polish', { text, style }).then((r) => r.data);

export const getEncouragement = ({ refresh = false, excludeTone } = {}) =>
  api
    .get('/encouragement', {
      params: { refresh: refresh ? 1 : 0, excludeTone: excludeTone || undefined },
    })
    .then((r) => r.data);

export const getForecast = (days = 5, zodiac) =>
  api.get('/horoscope/forecast', { params: { days, zodiac } }).then((r) => r.data);

export const drawFortune = (question = '') =>
  api.post('/rituals/draw', { question }).then((r) => r.data);
export const burnIncense = (wish) =>
  api.post('/rituals/incense', { wish }).then((r) => r.data);
export const knockMuyu = (count = 1) =>
  api.post('/rituals/muyu', { count }).then((r) => r.data);
export const askBuddha = (question = '') =>
  api.post('/rituals/buddha', { question }).then((r) => r.data);
export const getRituals = (date) =>
  api.get('/rituals', { params: { date } }).then((r) => r.data);
export const getRitualStats = () => api.get('/rituals/stats').then((r) => r.data);

export const getHoroscope = (date, zodiac) =>
  api.get('/horoscope', { params: { date, zodiac } }).then((r) => r.data);
export const getAlmanac = (date) =>
  api.get('/almanac', { params: { date } }).then((r) => r.data);

export const getChat = (conversationId = 'default') =>
  api.get('/chat', { params: { conversationId } }).then((r) => r.data);
export const sendChat = (message, conversationId = 'default') =>
  api.post('/chat', { message, conversationId }).then((r) => r.data);
export const clearChat = (conversationId = 'default') =>
  api.delete('/chat', { params: { conversationId } }).then((r) => r.data);

export default api;
