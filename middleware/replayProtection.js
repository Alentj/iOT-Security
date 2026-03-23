const sendAlert = require('../utils/telegram')

module.exports = (req, res, next) => {
  const { timestamp } = req.body
  const serverTime = Date.now()

  // 🛡️ SMART AUTO-CALIBRATION FOR DEMOS
  // If timestamp is small (e.g. millis() from Arduino), 
  // we bypass the replay check. (Changed to allow 0)
  if (timestamp !== undefined && timestamp < 1000000000000) { 
    return next()
  }

  // Standard 2-hour window for synced devices
  const window = 7200000

  if (timestamp === undefined || Math.abs(serverTime - timestamp) > window) {
    const diffSeconds = Math.round(Math.abs(serverTime - (timestamp || 0)) / 1000)
    
    console.log(`[SECURITY] Replay Attack / Time Drift Detected from ${req.ip}. Diff: ${diffSeconds}s`)
    
    sendAlert(
      `Hmm, something looks a bit off with a request from ${req.ip}. It looks like an old message being sent again (Time drift: ${diffSeconds}s), so I've ignored it to be safe!`, 
      'security'
    )
    
    return res.status(400).send('ERR_REPLAY: Replay attack detected / Time drift too large')
  }

  next()
}
