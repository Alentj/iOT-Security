const sendAlert = require('../utils/telegram')

let failures = {} // { ip: { count: 0, lastSeen: Date } }
let blacklisted = {} // { ip: expiryDate }

module.exports = {
  checkBlacklist: (req, res, next) => {
    const ip = req.ip
    const now = Date.now()

    if (blacklisted[ip]) {
      if (now < blacklisted[ip]) {
        return res.status(403).send('Your IP is temporarily blacklisted due to multiple security violations.')
      } else {
        delete blacklisted[ip]
        delete failures[ip]
      }
    }
    next()
  },

  recordFailure: (ip) => {
    if (!failures[ip]) {
      failures[ip] = { count: 1, lastSeen: Date.now() }
    } else {
      failures[ip].count++
      failures[ip].lastSeen = Date.now()
    }

    if (failures[ip].count >= 5) {
      blacklisted[ip] = Date.now() + 60 * 60 * 1000 // 1 hour
      sendAlert(`🚨 *ATTACKER DETECTED!* IP address ${ip} has been automatically BLACKLISTED for 1 hour after triggering 5 security violations.`, 'critical')
    }
  },

  clearAll: () => {
    failures = {}
    blacklisted = {}
    console.log('--- SECURITY BLACKLIST RESET BY ADMIN ---')
    return true
  }
}
