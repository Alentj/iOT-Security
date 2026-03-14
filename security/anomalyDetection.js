const sendAlert = require("../utils/telegram")

module.exports = (req,res,next)=>{

 const {soil_moisture} = req.body

 if(soil_moisture < 0 || soil_moisture > 100){

  sendAlert("⚠️ Abnormal soil moisture value detected")

  return res.status(400).send("Abnormal value detected")
 }

 next()
}