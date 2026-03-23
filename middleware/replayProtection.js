const sendAlert = require('../utils/telegram')

module.exports = (req, res, next) => {
  const { timestamp } = req.body
  const now = Date.now()

  if (Math.abs(now - timestamp) > 30000) {
    sendAlert(`Hmm, something looks a bit off with a request from ${req.ip}. It looks like an old message being sent again, so I've ignored it to be safe!`, 'security')

    return res.status(400).send('Replay attack detected')
  }

  next()
}
