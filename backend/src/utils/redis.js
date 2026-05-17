const { Redis } = require('@upstash/redis');

const isPlaceholder = !process.env.UPSTASH_REDIS_REST_URL || process.env.UPSTASH_REDIS_REST_URL.includes('your-upstash-url');

const redis = !isPlaceholder
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null;

// Simple custom rate limiter using Redis
const rateLimiter = async (req, res, next) => {
  if (!redis) {
    return next(); // Skip if redis is not configured
  }

  try {
    const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown';
    const key = `ratelimit:${ip}`;
    
    // Allow 100 requests per window (e.g., 60 seconds)
    const limit = 100;
    const window = 60; // seconds

    const currentCount = await redis.incr(key);
    
    if (currentCount === 1) {
      await redis.expire(key, window);
    }

    if (currentCount > limit) {
      return res.status(429).json({ message: 'Too many requests, please try again later.' });
    }

    next();
  } catch (error) {
    console.error('Rate limit error:', error);
    next(); // Fail open if Redis is down
  }
};

module.exports = { rateLimiter };
