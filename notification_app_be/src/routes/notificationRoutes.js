const express = require("express");

const {
  getNotifications,
  getPriorityNotifications,
} = require("../controllers/notificationController");

const router = express.Router();

router.get("/", getNotifications);

router.get(
  "/priority",
  getPriorityNotifications
);

module.exports = router;