const logger = require("../utils/logger");

const errorHandler = (err, req, res, next) => {
    logger.error("Login failed", {
        message: err.message,
        stack: err.stack,
        route: req.originalUrl,
    });

    res.status(500).json({
        message: "Internal server error",
    });
};

module.exports = errorHandler;