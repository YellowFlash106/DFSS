const redis = require("../utils/redis");
const asyncHandler = require("../utils/asyncHandler");



const rateLimiter = asyncHandler(async (req, res, next) => {
 
    const userId = req.user?.userId || req.ip;

    const key = `rate:${userId}`;

    const current = await redis.incr(key);

    if (current === 1) {
      await redis.expire(key, 60);  
    }

    if (current > 100) {
      return res.status(429).json({
        message: "Too many requests",
      });
    }

    next();
});

module.exports = rateLimiter;