import axios from 'axios';
import { logInfo, logError } from '../utils/logger';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    logInfo('API Request', { method: config.method, url: config.url });
    return config;
  },
  (error) => {
    logError('API Request Error', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for logging
apiClient.interceptors.response.use(
  (response) => {
    logInfo('API Response', { status: response.status, url: response.config.url });
    return response;
  },
  (error) => {
    logError('API Response Error', error);
    return Promise.reject(error);
  }
);

const getNotifications = async (page = 1, limit = 10, notificationType = '') => {
  try {
    logInfo('Fetching notifications', { page, limit, notificationType });
    
    const params = { page, limit };
    if (notificationType && notificationType !== 'All') {
      params.notification_type = notificationType;
    }
    
    const response = await apiClient.get('/notifications', { params });
    
    logInfo('Notifications fetched successfully', { count: response.data.count });
    return response.data;
  } catch (error) {
    logError('Failed to fetch notifications', error);
    throw error;
  }
};

const getPriorityNotifications = async (top = 10) => {
  try {
    logInfo('Fetching priority notifications', { top });
    
    const response = await apiClient.get('/notifications/priority', { 
      params: { top } 
    });
    
    logInfo('Priority notifications fetched successfully', { count: response.data.count });
    return response.data;
  } catch (error) {
    logError('Failed to fetch priority notifications', error);
    throw error;
  }
};

export { getNotifications, getPriorityNotifications };