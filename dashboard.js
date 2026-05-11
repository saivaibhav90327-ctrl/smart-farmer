// AgroSphere Dashboard Script
document.addEventListener('DOMContentLoaded', () => {
  const { MotorState, WeatherData, getSensor, makeGradient, CHART_DEFAULTS: CD, showToast } = window.AgroApp;
  const C = CD.color;

  // ── Water Usage Chart ────────────────────────────────────────────────────────
  const waterCtx = document.getElementById('waterChart');
  if (waterCtx) {
    const wCtx = waterCtx.getContext('2d');
    new Chart(waterCtx, {
      type: 'bar',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
          {
            label: 'Water Used (L)',
            data: [6200, 5800, 7100, 4800, 5200, 4820, 3900],
            backgroundColor: makeGradient(wCtx, 'rgba(0,212,170,0.8)', 'rgba(59,130,246,0.4)'),
            borderRadius: 6, borderSkipped: false,
          },
          {
            label: 'Target (L)',
            data: [6000, 6000, 6000, 6000, 6000, 6000, 6000],
            type: 'line',
            borderColor: 'rgba(245,158,11,0.7)',
            borderDash: [5, 5],
            borderWidth: 2,
            pointRadius: 0,
            fill: false,
          }
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: true, position: 'top' } },
        scales: {
          x: { grid: { color: C.gridLine } },
          y: { grid: { color: C.gridLine }, ticks: { callback: v => v.toLocaleString() + 'L' } }
        }
      }
    });
  }

  // ── NDVI Trend Chart ─────────────────────────────────────────────────────────
  const ndviCtx = document.getElementById('ndviChart');
  if (ndviCtx) {
    const nCtx = ndviCtx.getContext('2d');
    new Chart(ndviCtx, {
      type: 'line',
      data: {
        labels: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
        datasets: [
          {
            label: 'North Field',
            data: [0.48, 0.55, 0.63, 0.71, 0.74, 0.70, 0.66],
            borderColor: C.primary, borderWidth: 2,
            backgroundColor: 'rgba(0,212,170,0.1)', fill: true,
            tension: 0.4, pointBackgroundColor: C.primary, pointRadius: 4,
          },
          {
            label: 'East Field',
            data: [0.42, 0.50, 0.58, 0.62, 0.60, 0.55, 0.52],
            borderColor: C.accent, borderWidth: 2,
            backgroundColor: 'rgba(59,130,246,0.08)', fill: true,
            tension: 0.4, pointBackgroundColor: C.accent, pointRadius: 4,
          }
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: true, position: 'top' } },
        scales: {
          x: { grid: { color: C.gridLine } },
          y: { grid: { color: C.gridLine }, min: 0.3, max: 0.9 }
        }
      }
    });
  }

  // ── Yield Prediction Chart ───────────────────────────────────────────────────
  const yieldCtx = document.getElementById('yieldChart');
  if (yieldCtx) {
    new Chart(yieldCtx, {
      type: 'radar',
      data: {
        labels: ['Water', 'Soil', 'Weather', 'Pest\nControl', 'Fertilizer', 'Growth'],
        datasets: [{
          label: 'Current Season',
          data: [82, 74, 68, 90, 60, 78],
          borderColor: C.primary, borderWidth: 2,
          backgroundColor: 'rgba(0,212,170,0.15)',
          pointBackgroundColor: C.primary, pointRadius: 4,
        }, {
          label: 'Target',
          data: [90, 85, 80, 90, 85, 88],
          borderColor: 'rgba(255,255,255,0.15)', borderWidth: 1, borderDash: [4, 4],
          backgroundColor: 'rgba(255,255,255,0.03)',
          pointRadius: 0,
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: true, position: 'top' } },
        scales: { r: { grid: { color: C.gridLine }, ticks: { display: false }, pointLabels: { color: C.text, font: { size: 11 } }, min: 0, max: 100 } }
      }
    });
  }

  // ── Motor Cards ──────────────────────────────────────────────────────────────
  function renderMotors() {
    const el = document.getElementById('motor-cards');
    if (!el) return;
    el.innerHTML = MotorState.motors.map(m => `
      <div style="display:flex;align-items:center;gap:12px;padding:12px;background:var(--bg-glass-light);border-radius:var(--radius-md);border:1px solid ${m.on ? 'rgba(0,212,170,0.3)' : 'var(--border-card)'};margin-bottom:8px;transition:all 0.3s">
        <div style="font-size:20px">${m.on ? '⚡' : '🔌'}</div>
        <div style="flex:1">
          <div style="font-size:13px;font-weight:700;color:var(--text-primary)">${m.name}</div>
          <div style="font-size:11px;color:var(--text-secondary)">${m.zone}</div>
        </div>
        <label class="toggle">
          <input type="checkbox" ${m.on ? 'checked' : ''} onchange="toggleMotor(${m.id})">
          <span class="toggle-slider"></span>
        </label>
      </div>
    `).join('');
  }

  window.toggleMotor = (id) => {
    const m = MotorState.toggle(id);
    showToast(`${m.name} turned ${m.on ? 'ON' : 'OFF'}`, m.on ? 'success' : 'info');
    renderMotors();
  };

  renderMotors();

  // ── Live Sensor Grid ─────────────────────────────────────────────────────────
  const sensorDefs = [
    { key: 'moisture',    label: 'Soil Moisture', icon: '💧', unit: '%',    thresh: { warn: 35, ok: 50 } },
    { key: 'temperature', label: 'Temperature',   icon: '🌡️', unit: '°C',   thresh: { warn: 38, ok: 0  } },
    { key: 'humidity',    label: 'Humidity',      icon: '🌫️', unit: '%',    thresh: { warn: 90, ok: 40 } },
    { key: 'ph',          label: 'Soil pH',       icon: '🔬', unit: '',     thresh: { warn: 0,  ok: 0  } },
    { key: 'waterLevel',  label: 'Tank Level',    icon: '🪣', unit: '%',    thresh: { warn: 25, ok: 40 } },
    { key: 'windSpeed',   label: 'Wind Speed',    icon: '💨', unit: ' km/h',thresh: { warn: 0,  ok: 0  } },
  ];

  function renderSensors() {
    const el = document.getElementById('sensor-grid');
    if (!el) return;
    el.innerHTML = sensorDefs.map(s => {
      const val = getSensor(s.key);
      const pct = Math.min(100, (val / (s.key === 'ph' ? 14 : 100)) * 100);
      const isWarn = s.thresh.warn > 0 && val < s.thresh.warn;
      const color = isWarn ? 'var(--clr-warning)' : 'var(--clr-primary)';
      return `
        <div style="background:var(--bg-glass-light);border:1px solid ${isWarn ? 'rgba(245,158,11,0.3)' : 'var(--border-card)'};border-radius:var(--radius-md);padding:12px;text-align:center">
          <div style="font-size:20px;margin-bottom:4px">${s.icon}</div>
          <div style="font-size:18px;font-weight:800;color:${color}">${val}${s.unit}</div>
          <div style="font-size:10px;color:var(--text-muted);margin-top:2px">${s.label}</div>
        </div>
      `;
    }).join('');
  }

  renderSensors();
  setInterval(renderSensors, 3000);

  // ── Weather Strip ────────────────────────────────────────────────────────────
  function renderWeather() {
    const el = document.getElementById('weather-strip');
    if (!el) return;
    el.innerHTML = WeatherData.forecast.map((d, i) => `
      <div style="flex-shrink:0;text-align:center;padding:14px 16px;background:${i === 0 ? 'rgba(0,212,170,0.1)' : 'var(--bg-glass-light)'};border:1px solid ${i === 0 ? 'rgba(0,212,170,0.3)' : 'var(--border-card)'};border-radius:var(--radius-md);min-width:80px">
        <div style="font-size:11px;font-weight:600;color:${i === 0 ? 'var(--clr-primary)' : 'var(--text-muted)'};">${d.day}</div>
        <div style="font-size:28px;margin:8px 0">${d.icon}</div>
        <div style="font-size:14px;font-weight:800;color:var(--text-primary)">${d.hi}°</div>
        <div style="font-size:11px;color:var(--text-muted)">${d.lo}°</div>
        <div style="font-size:11px;color:#60a5fa;margin-top:4px">💧${d.rain}%</div>
      </div>
    `).join('');
  }

  renderWeather();

  // ── Activity Table ───────────────────────────────────────────────────────────
  const activities = [
    { time: '17:42', event: 'Motor ON — Main Pump', location: 'North Field', user: 'Auto-AI', status: 'success' },
    { time: '17:15', event: 'Soil Alert — Low Moisture', location: 'East Field', user: 'Sensor S7', status: 'warning' },
    { time: '16:50', event: 'Satellite Scan Complete', location: 'All Fields', user: 'AgroSphere AI', status: 'success' },
    { time: '16:30', event: 'Water Level Critical', location: 'Tank B', user: 'Sensor S8', status: 'danger' },
    { time: '15:55', event: 'Fertilizer Reminder Sent', location: 'South Field', user: 'AI Advisor', status: 'info' },
    { time: '14:10', event: 'Motor OFF — Drip Motor', location: 'West Garden', user: 'Ramaiah Goud', status: 'info' },
  ];

  const tbody = document.getElementById('activity-table');
  if (tbody) {
    tbody.innerHTML = activities.map(a => {
      const colors = { success: 'green', warning: 'amber', danger: 'red', info: 'blue' };
      return `
        <tr>
          <td style="color:var(--text-muted)">${a.time}</td>
          <td style="font-weight:600">${a.event}</td>
          <td>${a.location}</td>
          <td>${a.user}</td>
          <td><span class="badge ${colors[a.status]}">${a.status}</span></td>
        </tr>
      `;
    }).join('');
  }

  // ── Live KPI pulse ───────────────────────────────────────────────────────────
  function updateKPIs() {
    const m = getSensor('moisture');
    document.getElementById('kpi-moisture').textContent = m + '%';
    document.getElementById('kpi-ndvi').textContent = (0.68 + Math.random() * 0.08).toFixed(2);
  }
  setInterval(updateKPIs, 4000);
});

window.refreshDashboard = () => {
  window.AgroApp.showToast('Dashboard refreshed with latest data', 'success');
};
