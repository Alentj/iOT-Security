const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const sendAlert = require('../utils/telegram')

// store failed login attempts
const loginAttempts = {}

/* ================= REGISTER ================= */

router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body

    const existing = await User.findOne({ username })

    if (existing) {
      return res.status(400).send('User already exists')
    }

    const user = new User({
      username,
      password,
      role: req.body.role || 'farmer',
    })

    await user.save()

    res.send('User created')
  } catch (err) {
    console.error(err)
    res.status(500).send('Error creating user')
  }
})

/* ================= RESET PASSWORD ================= */

router.post('/reset-password', async (req, res) => {
  try {
    const { username, newPassword } = req.body

    const user = await User.findOne({ username })

    if (!user) {
      return res.status(404).send('User not found')
    }

    user.password = newPassword
    await user.save()

    res.send('Password updated')
  } catch (err) {
    console.error(err)
    res.status(500).send('Error resetting password')
  }
})

/* ================= LOGIN ================= */

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body || {}

    if (!username || !password) {
      return res.status(400).send('Missing credentials')
    }

    /* LOCK CHECK */

    if (loginAttempts[username] && loginAttempts[username].count >= 5) {
      const lockTime = loginAttempts[username].time

      if (Date.now() - lockTime < 60000) {
        return res.status(429).send('Account locked. Try again later.')
      } else {
        delete loginAttempts[username]
      }
    }

    const { role } = req.body

    const user = await User.findOne({ username })

    if (!user || user.password !== password) {
      if (!loginAttempts[username]) {
        loginAttempts[username] = { count: 1, time: Date.now() }
      } else {
        loginAttempts[username].count++
        loginAttempts[username].time = Date.now()
      }

      console.log('Failed login attempt:', username)

      await sendAlert(`Oops! Someone just tried to log in with the username "${username}" but got the password wrong. If this wasn't you, please keep an eye out!\n\nLocation: ${req.ip}\nAttempts: ${loginAttempts[username].count}`, 'security')

      return res.status(403).send('Invalid credentials')
    }

    if (role && user.role !== role) {
      return res.status(403).send(`Access Denied: This account is not registered as a ${role}.`)
    }

    /* SUCCESS */

    delete loginAttempts[username]

    const token = jwt.sign({ id: user._id, role: user.role }, 'SECRET_KEY', { expiresIn: '1h' })

    res.json({ token, role: user.role || 'farmer' })
  } catch (err) {
    console.error(err)
    res.status(500).send('Server error')
  }
})

module.exports = router
