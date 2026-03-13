// ============================================
// SERVER CONFIGURATION - CHANGE THESE TO UPDATE SERVER
// ============================================

const DEFAULT_LOCAL_SERVER = 'http://100.91.44.24:8005';
const DEFAULT_TEST_SERVER = 'http://18.142.190.113:8000';

const API_BASE_URL_KEY = 'apiBaseUrl';

const getStoredApiUrl = () => {
  if (typeof window === 'undefined') return DEFAULT_LOCAL_SERVER;
  return localStorage.getItem(API_BASE_URL_KEY) || DEFAULT_LOCAL_SERVER;
};

export const getApiUrl = () => {
  return getStoredApiUrl();
};

export const getApiBaseUrl = () => {
  return getApiUrl();
};

export const hasApiConfig = () => {
  return true;
};

export const setApiBaseUrl = (ip, port) => {
  const url = `http://${ip}:${port}`;
  localStorage.setItem(API_BASE_URL_KEY, url);
  return url;
};

export const setCustomApiUrl = (url) => {
  localStorage.setItem(API_BASE_URL_KEY, url);
  return url;
};

export const clearApiConfig = () => {
  localStorage.removeItem(API_BASE_URL_KEY);
};
