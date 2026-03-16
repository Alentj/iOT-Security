const express = require("express")
const router = express.Router()
const crypto = require("crypto")

const Device = require("../models/Device")
const authUser = require("../middleware/authUser")

/* ADMIN DEVICE REGISTRATION */

router.post("/register", authUser, async(req,res)=>{

const {device_id,token} = req.body

const device = new Device({
 device_id,
 token
})

await device.save()

res.send("Device registered")

})


/* ESP32 AUTOMATIC PROVISIONING */

router.post("/provision", async(req,res)=>{

try{

const device_id = "esp32_" + Date.now()

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

}catch(err){

console.error(err)
res.status(500).send("Provisioning failed")

}

})


module.exports = router