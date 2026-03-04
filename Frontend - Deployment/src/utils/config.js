const API_BASE_URL_KEY = 'apiBaseUrl';

// Get the base API URL (without /api suffix)
export const getApiBaseUrl = () => {
  return localStorage.getItem(API_BASE_URL_KEY) || '';
};

// Get the full API URL (falls back to env variable if not set in localStorage)
// Strips trailing /api to prevent double /api in URLs
export const getApiUrl = () => {
  let baseUrl = localStorage.getItem(API_BASE_URL_KEY) || import.meta.env.VITE_API_BASE_URL || '';
  // Remove trailing /api if present (to prevent double /api)
  baseUrl = baseUrl.replace(/\/api$/, '');
  return baseUrl;
};

// Set API URL for local development (IP:port)
// Automatically strips /api suffix if present
export const setApiBaseUrl = (ip, port = '8005') => {
  let cleanIp = ip.replace(/\/api$/, '');
  const url = `http://${cleanIp}:${port}`;
  localStorage.setItem(API_BASE_URL_KEY, url);
  return url;
};

// Set custom API URL (for production/test servers)
// Automatically strips /api suffix if present
export const setCustomApiUrl = (url) => {
  // Remove trailing slash and /api if present
  let cleanUrl = url.replace(/\/$/, '').replace(/\/api$/, '');
  localStorage.setItem(API_BASE_URL_KEY, cleanUrl);
  return cleanUrl;
};

export const hasApiConfig = () => {
  return !!localStorage.getItem(API_BASE_URL_KEY);
};

export const clearApiConfig = () => {
  localStorage.removeItem(API_BASE_URL_KEY);
};
