const rateLimit = require("express-rate-limit")
const sendAlert = require("../utils/telegram")

const limiter = rateLimit({

 windowMs: 60 * 1000,
 max: 10,

 handler: (req,res) => {

  sendAlert("⚠️ Rate limit exceeded from IP: " + req.ip)

  res.status(429).send("Too many requests")

 }

})

module.exports = limiter