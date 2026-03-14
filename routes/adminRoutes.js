const express = require("express")
const router = express.Router()

const SensorData = require("../models/SensorData")
const SecurityLog = require("../models/SecurityLog")
const authUser = require("../middleware/authUser")

router.get("/sensor-data",authUser, async(req,res)=>{

 const data = await SensorData.find()

 res.json(data)

})

router.get("/security-logs",authUser, async(req,res)=>{

 const logs = await SecurityLog.find()

 res.json(logs)

})

module.exports = router
router.get("/graph-data",authUser, async(req,res)=>{

 const data = await SensorData.find()

 const formatted = data.map(d => ({
  moisture:d.soil_moisture,
  time:d.timestamp
 }))

 res.json(formatted)

})
router.get("/device-status", authUser, async (req,res)=>{

const devices = await SensorData.find().sort({timestamp:-1})

const latest = {}

devices.forEach(d=>{
 if(!latest[d.device_id]){
  latest[d.device_id] = d
 }
})

const status = Object.values(latest).map(d=>{

 const online = Date.now() - d.timestamp < 60000   // 1 min

 return{
  device:d.device_id,
  moisture:d.soil_moisture,
  status: online ? "Online" : "Offline"
 }

})

res.json(status)

})