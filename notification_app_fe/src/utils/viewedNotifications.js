const STORAGE_KEY = 'viewed_notifications';

const getViewedNotifications = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return [];
  }
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
};

const markNotificationViewed = (notificationId) => {
  const viewed = getViewedNotifications();
  if (!viewed.includes(notificationId)) {
    viewed.push(notificationId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(viewed));
  }
};

const isNotificationViewed = (notificationId) => {
  const viewed = getViewedNotifications();
  return viewed.includes(notificationId);
};

const clearViewedNotifications = () => {
  localStorage.removeItem(STORAGE_KEY);
};

export { 
  getViewedNotifications, 
  markNotificationViewed, 
  isNotificationViewed,
  clearViewedNotifications 
};
