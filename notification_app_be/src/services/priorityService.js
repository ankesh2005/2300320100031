const weights = require("../utils/weights");

const getTopNotifications = (
  notifications,
  topN = 10
) => {
  const ranked = notifications.map((n) => {
    const score =
      weights[n.Type] * 1000000000000 +
      new Date(n.Timestamp).getTime();

    return {
      ...n,
      score,
    };
  });

  ranked.sort((a, b) => b.score - a.score);

  return ranked.slice(0, topN);
};

module.exports = { getTopNotifications };