const axios = require("axios");
const { getToken } = require("./authService");

const fetchNotifications = async (
  page,
  limit,
  notificationType
) => {
  const token = await getToken();

  const response = await axios.get(
    "http://4.224.186.213/evaluation-service/notifications",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        page,
        limit,
        notification_type: notificationType,
      },
    }
  );

  return response.data.notifications;
};

module.exports = {
  fetchNotifications,
};