const express = require("express")
const router = express.Router()
const crypto = require("crypto")

const Device = require("../models/Device")
const authUser = require("../middleware/authUser")

/* ===============================
   ADMIN DEVICE REGISTRATION
================================ */

router.post("/register", authUser, async (req, res) => {

  const { device_id, token } = req.body

  if (!device_id || !token) {
    return res.status(400).send("Missing device_id or token")
  }

  try {
    const device = new Device({
      device_id,
      token
    })

    await device.save()

    res.send("Device registered")

  } catch (err) {
    console.error(err)
    res.status(500).send("Error registering device")
  }
})

/* ===============================
   AUTO PROVISION (FOR ESP8266)
================================ */

router.get("/provision", async (req, res) => {

  try {

    const device_id = "esp8266_" + Date.now()
    const token = crypto.randomBytes(16).toString("hex")

    const device = new Device({
      device_id,
      token
    })

    await device.save()

    res.json({
      device_id,
      token
    })

  } catch (err) {
    console.error(err)
    res.status(500).send("Provisioning failed")
  }
})

module.exports = router