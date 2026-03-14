const express = require("express")
const router = express.Router()

const Device = require("../models/Device")
const authUser = require("../middleware/authUser")

router.post("/register",authUser, async(req,res)=>{

 const {device_id,token} = req.body

 const device = new Device({
  device_id,
  token
 })

 await device.save()

 res.send("Device registered")

})

module.exports = router