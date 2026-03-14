const express = require("express")
const router = express.Router()
const jwt = require("jsonwebtoken")
const User = require("../models/User")
const sendAlert = require("../utils/telegram")

// store failed login attempts
const loginAttempts = {}

router.post("/login", async (req,res)=>{

try{

const {username,password} = req.body || {}

if(!username || !password){
 return res.status(400).send("Missing credentials")
}

// check if account locked
if(loginAttempts[username] && loginAttempts[username].count >= 5){

 const lockTime = loginAttempts[username].time

 if(Date.now() - lockTime < 60000){   // 1 minute lock
  return res.status(429).send("Account locked. Try again later.")
 }else{
  delete loginAttempts[username]
 }

}

const user = await User.findOne({username})

if(!user || user.password !== password){

 // increase failed attempts
 if(!loginAttempts[username]){
  loginAttempts[username] = {count:1,time:Date.now()}
 }else{
  loginAttempts[username].count++
  loginAttempts[username].time = Date.now()
 }

 console.log("Failed login attempt:", username)

 await sendAlert(`🚨 Failed login attempt
User: ${username}
IP: ${req.ip}
Attempts: ${loginAttempts[username].count}
Time: ${new Date().toLocaleString()}`)

 return res.status(403).send("Invalid credentials")
}

// successful login → reset attempts
delete loginAttempts[username]

const token = jwt.sign(
 {id:user._id, role:user.role},
 "SECRET_KEY",
 {expiresIn:"1h"}
)

res.json({token})

}catch(err){

console.error(err)
res.status(500).send("Server error")

}

})

module.exports = router