let chart

async function loadDashboard(){

const token = localStorage.getItem("token")

/* SENSOR DATA */

const sensorRes = await fetch("/admin/sensor-data",{
headers:{ "Authorization":"Bearer "+token }
})

const sensorData = await sensorRes.json()

const table = document.getElementById("dataTable")

table.innerHTML = `
<tr>
<th>Device</th>
<th>Moisture</th>
</tr>
`

sensorData.forEach(d=>{

const row = table.insertRow()

row.insertCell(0).innerText = d.device_id
row.insertCell(1).innerText = d.soil_moisture

})


/* DEVICE ACTIVITY FEED */

const activityFeed = document.getElementById("deviceActivity")

if(activityFeed){

activityFeed.innerHTML=""

sensorData.slice(-5).reverse().forEach(d=>{

const item=document.createElement("li")

item.innerText = `${d.device_id} → ${d.soil_moisture}%`

activityFeed.appendChild(item)

})

}


/* CHART */

const graphRes = await fetch("/admin/graph-data",{
headers:{ "Authorization":"Bearer "+token }
})

const graphData = await graphRes.json()

const labels = graphData.map(d=>new Date(d.time).toLocaleTimeString())
const values = graphData.map(d=>d.moisture)

if(chart) chart.destroy()

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


/* DEVICE STATUS */

const deviceRes = await fetch("/admin/device-status",{
headers:{ "Authorization":"Bearer "+token }
})

const devices = await deviceRes.json()

const deviceTable = document.getElementById("deviceTable")

deviceTable.innerHTML = `
<tr>
<th>Device</th>
<th>Moisture</th>
<th>Status</th>
</tr>
`

let online = 0

devices.forEach(d=>{

const row = deviceTable.insertRow()

row.insertCell(0).innerText = d.device
row.insertCell(1).innerText = d.moisture

const statusCell = row.insertCell(2)

statusCell.innerText = d.status
statusCell.style.color = d.status==="Online" ? "green" : "red"

if(d.status==="Online") online++

})


/* DASHBOARD CARDS */

document.getElementById("totalDevices").innerText = devices.length
document.getElementById("onlineDevices").innerText = online

if(sensorData.length > 0){
document.getElementById("latestMoisture").innerText =
sensorData[sensorData.length-1].soil_moisture + "%"
}


/* SECURITY EVENTS */

const eventFeed = document.getElementById("eventFeed")

if(eventFeed){

const logRes = await fetch("/admin/security-logs",{
headers:{ "Authorization":"Bearer "+token }
})

const logs = await logRes.json()

eventFeed.innerHTML=""

logs.slice(-10).reverse().forEach(l=>{

const item=document.createElement("li")

item.innerText =
`${l.event} | ${l.ip} | ${new Date(l.timestamp).toLocaleTimeString()}`

eventFeed.appendChild(item)

})

document.getElementById("alertCount").innerText = logs.length

}

}


/* AUTO REFRESH EVERY 10 SECONDS */

loadDashboard()

setInterval(loadDashboard,10000)