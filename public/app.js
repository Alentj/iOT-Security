let chart

/* LOGIN */

async function login(){
const username = document.getElementById("username").value
const password = document.getElementById("password").value

const res = await fetch("/auth/login",{
 method:"POST",
 headers:{ "Content-Type":"application/json" },
 body:JSON.stringify({username,password})
})

if(!res.ok){
 alert("Invalid username or password")
 return
}

const data = await res.json()
localStorage.setItem("token", data.token)
window.location="dashboard.html"
}

/* REGISTER */

async function registerUser(){
const username = prompt("Enter username")
const password = prompt("Enter password")

const res = await fetch("/auth/register",{
 method:"POST",
 headers:{ "Content-Type":"application/json" },
 body:JSON.stringify({username,password})
})

alert(await res.text())
}

/* RESET PASSWORD */

async function resetPassword(){
const username = prompt("Enter username")
const newPassword = prompt("Enter new password")

const res = await fetch("/auth/reset-password",{
 method:"POST",
 headers:{ "Content-Type":"application/json" },
 body:JSON.stringify({username,newPassword})
})

alert(await res.text())
}

/* DASHBOARD */

async function loadDashboard(){

const token = localStorage.getItem("token")
if(!token){
 window.location="login.html"
 return
}

/* SENSOR DATA */

const res = await fetch("/admin/sensor-data",{
 headers:{ "Authorization":"Bearer "+token }
})

if(!res.ok) return

const data = await res.json()

updateTable(data)
updateActivity(data)
updateLatest(data)

/* GRAPH */

const graphRes = await fetch("/admin/graph-data",{
 headers:{ "Authorization":"Bearer "+token }
})

if(graphRes.ok){

const graphData = await graphRes.json()

const labels = graphData.map(d=>new Date(d.time).toLocaleTimeString())
const values = graphData.map(d=>d.moisture)

chart = new Chart(document.getElementById("moistureChart"),{
 type:"line",
 data:{
  labels,
  datasets:[{
   label:"Soil Moisture",
   data:values,
   borderColor:"green",
   fill:false
  }]
 }
})

}

/* DEVICE STATUS */

const deviceRes = await fetch("/admin/device-status",{
 headers:{ "Authorization":"Bearer "+token }
})

if(deviceRes.ok){

const devices = await deviceRes.json()

const table = document.getElementById("deviceTable")

table.innerHTML = `
<tr>
<th>Device</th>
<th>Moisture</th>
<th>Status</th>
</tr>
`

let online = 0

devices.forEach(d=>{
 const row = table.insertRow()

 row.insertCell(0).innerText = d.device
 row.insertCell(1).innerText = d.moisture

 const statusCell = row.insertCell(2)
 statusCell.innerText = d.status
 statusCell.className = d.status==="Online" ? "green" : "red"

 if(d.status==="Online") online++
})

document.getElementById("totalDevices").innerText = devices.length
document.getElementById("onlineDevices").innerText = online

}

}

/* SENSOR AUTO REFRESH */

async function refreshSensorData(){

const token = localStorage.getItem("token")
if(!token) return

const res = await fetch("/admin/sensor-data",{
 headers:{ "Authorization":"Bearer "+token }
})

if(!res.ok) return

const data = await res.json()

updateTable(data)
updateActivity(data)
updateLatest(data)

}

/* DEVICES PAGE */

async function loadDevicesPage(){

const token = localStorage.getItem("token")
if(!token){
 window.location="login.html"
 return
}

const res = await fetch("/admin/device-status",{
 headers:{ "Authorization":"Bearer "+token }
})

if(!res.ok) return

const devices = await res.json()

const table = document.getElementById("deviceTable")

table.innerHTML = `
<tr>
<th>Device</th>
<th>Moisture</th>
<th>Status</th>
</tr>
`

devices.forEach(d=>{
 const row = table.insertRow()

 row.insertCell(0).innerText = d.device
 row.insertCell(1).innerText = d.moisture

 const statusCell = row.insertCell(2)
 statusCell.innerText = d.status
 statusCell.className = d.status==="Online" ? "green" : "red"
})

}

/* ALERTS PAGE */

async function loadAlertsPage(){

const token = localStorage.getItem("token")
if(!token){
 window.location="login.html"
 return
}

const res = await fetch("/admin/security-logs",{
 headers:{ "Authorization":"Bearer "+token }
})

if(!res.ok) return

const logs = await res.json()

const feed = document.getElementById("eventFeed")
feed.innerHTML=""

logs.slice(-10).reverse().forEach(l=>{
 const item=document.createElement("li")
 item.innerText =
 `${l.event} | ${l.ip} | ${new Date(l.timestamp).toLocaleTimeString()}`
 feed.appendChild(item)
})

}

/* HELPERS */

function updateTable(data){
const table = document.getElementById("dataTable")

table.innerHTML = `
<tr>
<th>Device</th>
<th>Moisture</th>
</tr>
`

data.forEach(d=>{
 const row = table.insertRow()
 row.insertCell(0).innerText = d.device_id
 row.insertCell(1).innerText = d.soil_moisture
})
}

function updateActivity(data){
const feed = document.getElementById("deviceActivity")
if(!feed) return

feed.innerHTML=""

data.slice(-5).reverse().forEach(d=>{
 const item=document.createElement("li")
 item.innerText = `${d.device_id} → ${d.soil_moisture}%`
 feed.appendChild(item)
})
}

function updateLatest(data){
if(data.length > 0){
 document.getElementById("latestMoisture").innerText =
 data[data.length-1].soil_moisture + "%"
}
}

/* INIT */

if(window.location.pathname.includes("dashboard")){
 loadDashboard()
 setInterval(refreshSensorData,10000)
}