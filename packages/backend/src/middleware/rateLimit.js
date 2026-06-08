const rateLimit = require('express-rate-limit');

const publicSubmitLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many submissions. Please wait a few minutes and try again.' },
});

module.exports = { publicSubmitLimiter };
