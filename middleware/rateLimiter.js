const rateLimit = require('express-rate-limit')
const sendAlert = require('../utils/telegram')

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,

  handler: (req, res) => {
    sendAlert(`Whoa! Our system is getting too many requests from one place (${req.ip}). I've slowed things down to keep everything running smoothly.`, 'system')

    res.status(429).send('Too many requests')
  },
})

module.exports = limiter
