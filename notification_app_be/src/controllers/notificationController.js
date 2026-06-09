const Log = require("../../../logging_middleware/src/logger");

const {
  fetchNotifications,
} = require("../services/notificationService");

const {
  getTopNotifications,
} = require("../services/priorityService");

exports.getNotifications = async (req, res) => {
  try {
    await Log(
      "backend",
      "info",
      "controller",
      "Fetching notifications"
    );

    const {
      page = 1,
      limit = 10,
      notification_type,
    } = req.query;

    await Log(
      "backend",
      "debug",
      "service",
      `page=${page}, limit=${limit}, type=${notification_type || "all"}`
    );

    const notifications = await fetchNotifications(
      page,
      limit,
      notification_type
    );

    await Log(
      "backend",
      "info",
      "service",
      `Fetched ${
        Array.isArray(notifications)
          ? notifications.length
          : 0
      } notifications`
    );

    res.status(200).json({
      success: true,
      count: notifications.length,
      notifications,
    });
  } catch (error) {

    try {
      await Log(
        "backend",
        "error",
        "controller",
        error.message
      );
    } catch {}

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getPriorityNotifications = async (req, res) => {
  try {
    await Log(
      "backend",
      "info",
      "controller",
      "Fetching priority notifications"
    );

    const {
      top = 10,
      page = 1,
      limit = 10,
    } = req.query;

    await Log(
      "backend",
      "debug",
      "service",
      `Generating top ${top} notifications`
    );

    const notifications = await fetchNotifications(
      page,
      limit
    );

    const result = getTopNotifications(
      notifications,
      Number(top)
    );

    await Log(
      "backend",
      "info",
      "service",
      `Generated ${
        Array.isArray(result)
          ? result.length
          : 0
      } priority notifications`
    );

    res.status(200).json({
      success: true,
      count: result.length,
      notifications: result,
    });

  } catch (error) {

    try {
      await Log(
        "backend",
        "error",
        "controller",
        error.message
      );
    } catch {}

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};