const express = require("express")
const router = express.Router()

const authDevice = require("../middleware/authDevice")
const replay = require("../middleware/replayProtection")
const validate = require("../security/validation")
const anomaly = require("../security/anomalyDetection")

const SensorData = require("../models/SensorData")

router.post("/data",
authDevice,
replay,
validate,
anomaly,
async(req,res)=>{

console.log("DATA API HIT")
console.log(req.body)
 const {device_id,soil_moisture} = req.body

const data = new SensorData({

device_id,
soil_moisture,
timestamp: Date.now()

})

 await data.save()

 res.json({

  message:"Data stored securely"

 })

})

module.exports = router