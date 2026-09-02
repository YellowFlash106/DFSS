const { incrementRequests } = require("../utils/metrics");

const metricsMiddleware = (req, res, next) => {
  incrementRequests();
  next();
};

module.exports = metricsMiddleware;
