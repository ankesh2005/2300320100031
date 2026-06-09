const getNotificationId = (notification, index = 0) => {
  return (
    notification.id ||
    notification.ID ||
    notification.notification_id ||
    notification.NotificationID ||
    `${getNotificationType(notification)}-${getNotificationTimestamp(notification)}-${index}`
  );
};

const getNotificationType = (notification) => {
  return notification.notification_type || notification.Type || notification.type || 'General';
};

const getNotificationTimestamp = (notification) => {
  return notification.timestamp || notification.Timestamp || notification.created_at || '';
};

const getNotificationMessage = (notification) => {
  return notification.message || notification.Message || notification.description || 'No message available';
};

const formatNotificationDate = (timestamp) => {
  if (!timestamp) {
    return 'Time unavailable';
  }

  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) {
    return timestamp;
  }

  return date.toLocaleString();
};

const getTypeColor = (type) => {
  switch (type) {
    case 'Placement':
      return 'primary';
    case 'Result':
      return 'success';
    case 'Event':
      return 'warning';
    default:
      return 'default';
  }
};

export {
  getNotificationId,
  getNotificationType,
  getNotificationTimestamp,
  getNotificationMessage,
  formatNotificationDate,
  getTypeColor,
};
