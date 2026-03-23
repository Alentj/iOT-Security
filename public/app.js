let chart
let allGraphData = [] // stores full raw graph data for filtering

/* LOGIN */

async function login() {
  const username = document.getElementById('username').value
  const password = document.getElementById('password').value
  const role = document.getElementById('role').value

  const res = await fetch('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, role }),
  })

  if (!res.ok) {
    showToast('Invalid username or password', 'fa-circle-xmark', 'var(--danger)')
    return
  }

  const data = await res.json()
  localStorage.setItem('token', data.token)
  localStorage.setItem('role', data.role)
  localStorage.setItem('username', username)
  window.location = 'dashboard.html'
}

/* DASHBOARD */

async function loadDashboard() {
  const token = localStorage.getItem('token')
  if (!token) {
    window.location = 'login.html'
    return
  }

  fetchMotorStatus()
  fetchAlertCount()
  refreshDashboardData() // Initial load
  
  // Graph Load
  const graphRes = await fetch('/admin/graph-data', {
    headers: { Authorization: 'Bearer ' + token },
  })
  if (graphRes.ok) {
    allGraphData = await graphRes.json()
    renderChart(allGraphData)
    bindFilterBtns()
  }

  initIrrigationControls()
}

async function fetchAlertCount() {
  const token = localStorage.getItem('token')
  const res = await fetch('/admin/security-logs', { headers: { Authorization: 'Bearer ' + token } })
  if (res.ok) {
    const logs = await res.json()
    const alertEl = document.getElementById('alertCount')
    if (alertEl) alertEl.innerText = logs.length
  }
}

async function resetSecurity() {
  if (!confirm('Are you sure you want to clear the security blacklist?')) return

  try {
    const res = await fetch('/admin/clear-blacklist', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })

    const data = await res.json()
    alert(data.message)
    refreshDashboardData()
  } catch (err) {
    alert('Failed to reset security blacklist.')
  }
}

async function refreshDashboardData() {
  const token = localStorage.getItem('token')
  if (!token) return

  // 1. Fetch Sensor Stats
  const sensorRes = await fetch('/admin/sensor-data', {
    headers: { Authorization: 'Bearer ' + token },
  })
  if (sensorRes.ok) {
    const data = await sensorRes.json()
    updateLatest(data)
    checkAutoIrrigate(data)
  }

  // 2. Fetch Device Status (KPIs + Grid)
  const deviceRes = await fetch('/admin/device-status', {
    headers: { Authorization: 'Bearer ' + token },
  })
  if (deviceRes.ok) {
    const devices = await deviceRes.json()
    updateDeviceGrid(devices)
    updateDeviceMetrics(devices)
  }
}

function updateDeviceGrid(devices) {
  const tableBody = document.querySelector('#deviceTable tbody')
  if (!tableBody) return
  tableBody.innerHTML = ''

  devices.forEach((d) => {
    const row = tableBody.insertRow()
    row.insertCell(0).innerText = d.device
    row.insertCell(1).innerText = d.moisture
    const statusCell = row.insertCell(2)
    const isOnline = d.status === 'Online'
    statusCell.innerHTML = `<span class="status-pill ${isOnline ? 'online' : 'offline'}">${d.status}</span>`
  })
}

function updateDeviceMetrics(devices) {
  let online = 0
  devices.forEach(d => { if(d.status === 'Online') online++ })
  
  const totalEl = document.getElementById('totalDevices')
  const onlineEl = document.getElementById('onlineDevices')
  if (totalEl) totalEl.innerText = devices.length
  if (onlineEl) onlineEl.innerText = online
}

async function loadDevicesPage() {
  const token = localStorage.getItem('token')
  if (!token) { window.location = 'login.html'; return; }

  const res = await fetch('/admin/device-status', {
    headers: { Authorization: 'Bearer ' + token },
  })

  if (res.ok) {
    const devices = await res.json()
    updateDeviceGrid(devices)
  }
}

async function registerDevice() {
  const device_id = document.getElementById('device_id').value
  const token = document.getElementById('token').value
  const authToken = localStorage.getItem('token')

  if (!device_id || !token) {
    showToast('Please fill all fields', 'fa-circle-xmark', 'var(--danger)')
    return
  }

  const res = await fetch('/admin/register-device', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + authToken },
    body: JSON.stringify({ device_id, token }),
  })

  if (res.ok) {
    showToast('Device registered successfully', 'fa-circle-check', 'var(--success)')
    loadDevicesPage()
  } else {
    showToast('Registration failed', 'fa-circle-exmark', 'var(--danger)')
  }
}

/* CHART HELPERS */

function renderChart(data) {
  const labels = data.map((d) => {
    const date = new Date(d.time)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  })
  const values = data.map((d) => d.moisture)
  const threshold = parseInt(document.getElementById('moistureThreshold')?.value || 500)

  if (chart) {
    chart.data.labels = labels
    chart.data.datasets[0].data = values
    if (chart.options.plugins.thresholdLine) {
        chart.options.plugins.thresholdLine.value = threshold
    }
    chart.update()
    return
  }

  const canvas = document.getElementById('moistureChart')
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  
  const thresholdPlugin = {
    id: 'thresholdLine',
    beforeDraw(chart, args, options) {
      const { ctx, chartArea: { left, right }, scales: { y } } = chart
      if (!y) return
      const yPos = y.getPixelForValue(options.value)
      
      ctx.save()
      ctx.strokeStyle = '#ef4444'
      ctx.setLineDash([5, 5])
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.moveTo(left, yPos)
      ctx.lineTo(right, yPos)
      ctx.stroke()
      
      ctx.fillStyle = '#ef4444'
      ctx.font = '500 11px Outfit'
      ctx.fillText(`Limit: ${options.value}`, left + 5, yPos - 5)
      ctx.restore()
    }
  }

  chart = new Chart(canvas, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Moisture',
        data: values,
        backgroundColor: (context) => context.raw < threshold ? 'rgba(239, 68, 68, 0.6)' : 'rgba(16, 185, 129, 0.6)',
        borderColor: (context) => context.raw < threshold ? '#ef4444' : '#10B981',
        borderWidth: 1,
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: { top: 20, bottom: 10, left: 10, right: 10 }
      },
      plugins: {
        legend: { display: false },
        thresholdLine: { value: threshold },
        tooltip: {
          backgroundColor: '#030712',
          titleFont: { family: 'Outfit', size: 12 },
          bodyFont: { family: 'Outfit', size: 13, weight: '700' }
        }
      },
      scales: {
        x: { 
          grid: { display: false }, 
          ticks: { color: '#94a3b8', font: { family: 'Outfit', size: 11 } } 
        },
        y: { 
          min: 0, 
          max: 1100, 
          grid: { color: 'rgba(255,255,255,0.03)' }, 
          ticks: { color: '#94a3b8', font: { family: 'Outfit', size: 11 } } 
        }
      }
    },
    plugins: [thresholdPlugin]
  })
}

function bindFilterBtns() {
  document.querySelectorAll('.filter-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('active'))
      btn.classList.add('active')
      const hours = parseInt(btn.dataset.hours) || 24
      const cutoff = Date.now() - hours * 60 * 60 * 1000
      const filtered = allGraphData.filter((d) => new Date(d.time).getTime() >= cutoff)
      renderChart(filtered.length > 0 ? filtered : allGraphData)
    })
  })
}

/* HELPERS */

function updateLatest(data) {
  if (data.length > 0) {
    const el = document.getElementById('latestMoisture')
    if (el) el.innerText = data[data.length - 1].soil_moisture
  }
}

/* IRRIGATION */

let currentMotorStatus = false

async function fetchMotorStatus() {
  const token = localStorage.getItem('token')
  const res = await fetch('/admin/motor-status', { headers: { Authorization: 'Bearer ' + token } })
  if (res.ok) {
    const data = await res.json()
    updateMotorUI(data.motorStatus)
  }
}

async function toggleMotor() {
  const token = localStorage.getItem('token')
  const action = currentMotorStatus ? 'off' : 'on'
  const res = await fetch('/admin/motor-control', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
    body: JSON.stringify({ action }),
  })
  if (res.ok) {
    const data = await res.json()
    updateMotorUI(data.motorStatus)
    showToast(`Pump ${action.toUpperCase()}`, action === 'on' ? 'fa-droplet' : 'fa-power-off', action === 'on' ? 'var(--primary)' : 'var(--danger)')
  }
}

function updateMotorUI(status) {
  currentMotorStatus = status
  const badge = document.getElementById('motorStatusBadge')
  const btn = document.getElementById('motorToggleBtn')
  if (!badge || !btn) return
  badge.innerText = status ? 'ACTIVE' : 'STANDBY'
  badge.style.color = status ? 'var(--primary)' : 'var(--text-dim)'
  btn.innerText = status ? 'Turn OFF' : 'Turn ON'
}

function checkAutoIrrigate(data) {
  if (data.length === 0) return
  const moisture = data[data.length - 1].soil_moisture
  const isAuto = document.getElementById('autoIrrigateToggle')?.checked
  const threshold = parseInt(document.getElementById('moistureThreshold')?.value || 500)

  if (isAuto && moisture < threshold && !currentMotorStatus) {
    const speech = new SpeechSynthesisUtterance("pump turn on")
    window.speechSynthesis.speak(speech)
    toggleMotor()
  }
}

function initIrrigationControls() {
  const input = document.getElementById('moistureThreshold')
  const display = document.getElementById('thresholdDisplay')
  if (input && display) {
    input.addEventListener('input', (e) => {
      display.innerText = e.target.value
      if (chart && chart.options.plugins.thresholdLine) {
        chart.options.plugins.thresholdLine.value = parseInt(e.target.value)
        chart.update()
      }
    })
  }
}

/* AUTH & SIDEBAR */

function logout() {
  localStorage.clear()
  window.location = 'login.html'
}

function toggleSidebar() {
  document.querySelector('.sidebar')?.classList.toggle('open')
}

function applyRolePermissions() {
  const role = localStorage.getItem('role') || 'farmer'
  const name = localStorage.getItem('username') || 'User'
  const avatar = document.getElementById('navAvatar')
  const usernameEl = document.getElementById('welcomeName')
  const badge = document.getElementById('navRoleBadge')

  if (avatar) avatar.innerText = name[0].toUpperCase()
  if (usernameEl) usernameEl.innerText = name
  if (badge) {
    badge.innerText = role.toUpperCase()
    badge.className = `badge ${role}`
  }

  if (role !== 'admin') {
    document.querySelector('a[href="logs.html"]')?.remove()
    document.querySelector('a[href="alerts.html"]')?.remove()
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname.includes('dashboard')) {
    loadDashboard()
    setInterval(refreshDashboardData, 10000)
  }
  applyRolePermissions()
})

function showToast(msg, icon = 'fa-circle-info', color = 'var(--primary)') {
  let toast = document.getElementById('toast')
  if (!toast) {
    toast = document.createElement('div')
    toast.id = 'toast'
    toast.className = 'toast'
    document.body.appendChild(toast)
  }
  toast.innerHTML = `<i class="fa-solid ${icon}" style="color: ${color}"></i> <span>${msg}</span>`
  toast.classList.add('show')
  setTimeout(() => toast.classList.remove('show'), 3000)
}
