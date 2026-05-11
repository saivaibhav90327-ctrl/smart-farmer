// AgroSphere Global App Utilities

// ── Shared chart defaults ─────────────────────────────────────────────────────
const CHART_DEFAULTS = {
  color: {
    primary:  '#00d4aa',
    accent:   '#3b82f6',
    warning:  '#f59e0b',
    danger:   '#ef4444',
    success:  '#22c55e',
    muted:    'rgba(255,255,255,0.06)',
    gridLine: 'rgba(255,255,255,0.05)',
    text:     '#7fa8b8',
  }
};

if (window.Chart) {
  Chart.defaults.color            = CHART_DEFAULTS.color.text;
  Chart.defaults.borderColor      = CHART_DEFAULTS.color.gridLine;
  Chart.defaults.font.family      = 'Inter, sans-serif';
  Chart.defaults.plugins.legend.labels.color = CHART_DEFAULTS.color.text;
}

// ── Sidebar toggle ────────────────────────────────────────────────────────────
function toggleSidebar() {
  document.getElementById('sidebar')?.classList.toggle('open');
}

// ── Live clock ────────────────────────────────────────────────────────────────
function startClock(el) {
  if (!el) return;
  const tick = () => {
    el.textContent = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };
  tick(); setInterval(tick, 1000);
}

// ── Simulated real-time sensor data ──────────────────────────────────────────
const SensorSim = {
  moisture:    { val: 68, min: 20, max: 95, unit: '%',   drift: 0.5 },
  temperature: { val: 32, min: 22, max: 42, unit: '°C',  drift: 0.3 },
  humidity:    { val: 74, min: 40, max: 95, unit: '%',   drift: 0.6 },
  ph:          { val: 6.8,min: 5.5,max: 8.2,unit: '',   drift: 0.02 },
  waterLevel:  { val: 76, min: 10, max: 100,unit: '%',  drift: 0.4 },
  windSpeed:   { val: 12, min: 0,  max: 40, unit: 'km/h',drift: 1.2 },
};

function tickSensors() {
  Object.values(SensorSim).forEach(s => {
    s.val += (Math.random() - 0.5) * s.drift * 2;
    s.val = Math.max(s.min, Math.min(s.max, s.val));
  });
}
setInterval(tickSensors, 3000);

function getSensor(key) {
  const s = SensorSim[key];
  return s ? +s.val.toFixed(key === 'ph' ? 1 : 0) : 0;
}

// ── Motor state manager ───────────────────────────────────────────────────────
const MotorState = {
  motors: [
    { id: 1, name: 'Main Pump',     zone: 'North Field',  on: true,  runtime: 142 },
    { id: 2, name: 'Borewell Pump', zone: 'South Field',  on: false, runtime: 0   },
    { id: 3, name: 'Drip Motor',    zone: 'East Field',   on: true,  runtime: 88  },
    { id: 4, name: 'Sprinkler',     zone: 'West Garden',  on: false, runtime: 0   },
  ],
  toggle(id) {
    const m = this.motors.find(m => m.id === id);
    if (m) { m.on = !m.on; m.runtime = m.on ? 0 : m.runtime; }
    return m;
  }
};

// ── Weather data simulation ───────────────────────────────────────────────────
const WeatherData = {
  current: { temp: 32, feels: 36, humidity: 74, wind: 12, condition: 'Partly Cloudy', icon: '⛅', uv: 8, rain: 72 },
  forecast: [
    { day: 'Today',  icon: '⛅', hi: 33, lo: 24, rain: 72, label: 'Partly Cloudy' },
    { day: 'Tue',    icon: '🌧️', hi: 28, lo: 21, rain: 90, label: 'Heavy Rain' },
    { day: 'Wed',    icon: '🌦️', hi: 30, lo: 22, rain: 60, label: 'Showers' },
    { day: 'Thu',    icon: '🌤️', hi: 34, lo: 25, rain: 15, label: 'Sunny' },
    { day: 'Fri',    icon: '☀️', hi: 37, lo: 27, rain: 5,  label: 'Hot & Sunny' },
    { day: 'Sat',    icon: '⛅', hi: 35, lo: 26, rain: 20, label: 'Mostly Cloudy' },
    { day: 'Sun',    icon: '🌧️', hi: 29, lo: 21, rain: 80, label: 'Rain' },
  ]
};

// ── Crop data ─────────────────────────────────────────────────────────────────
const CropDB = [
  { name: 'Paddy (Rice)',  emoji: '🌾', season: 'Kharif', water: 'High',   soil: 'Clay Loam',  days: 120, profit: '₹28,000/acre', ai_score: 92 },
  { name: 'Maize',         emoji: '🌽', season: 'Kharif', water: 'Medium', soil: 'Sandy Loam', days: 90,  profit: '₹18,000/acre', ai_score: 87 },
  { name: 'Groundnut',     emoji: '🥜', season: 'Kharif', water: 'Low',    soil: 'Sandy',      days: 110, profit: '₹22,000/acre', ai_score: 84 },
  { name: 'Wheat',         emoji: '🌿', season: 'Rabi',   water: 'Medium', soil: 'Clay Loam',  days: 130, profit: '₹24,000/acre', ai_score: 89 },
  { name: 'Chickpea',      emoji: '🫘', season: 'Rabi',   water: 'Low',    soil: 'Sandy Loam', days: 100, profit: '₹20,000/acre', ai_score: 81 },
  { name: 'Sunflower',     emoji: '🌻', season: 'Rabi',   water: 'Medium', soil: 'Loam',       days: 95,  profit: '₹19,000/acre', ai_score: 78 },
  { name: 'Watermelon',    emoji: '🍉', season: 'Zaid',   water: 'High',   soil: 'Sandy Loam', days: 70,  profit: '₹15,000/acre', ai_score: 75 },
  { name: 'Cucumber',      emoji: '🥒', season: 'Zaid',   water: 'Medium', soil: 'Loam',       days: 60,  profit: '₹12,000/acre', ai_score: 72 },
  { name: 'Cotton',        emoji: '🌸', season: 'Kharif', water: 'Medium', soil: 'Black Soil', days: 180, profit: '₹35,000/acre', ai_score: 91 },
  { name: 'Sugarcane',     emoji: '🎋', season: 'Kharif', water: 'High',   soil: 'Clay',       days: 365, profit: '₹45,000/acre', ai_score: 88 },
];

// ── IoT Sensor list ───────────────────────────────────────────────────────────
const SensorList = [
  { id: 'S1', name: 'Soil Moisture',   field: 'North',  key: 'moisture',    icon: '💧', unit: '%',    status: 'online' },
  { id: 'S2', name: 'Temperature',     field: 'North',  key: 'temperature', icon: '🌡️', unit: '°C',   status: 'online' },
  { id: 'S3', name: 'Humidity',        field: 'East',   key: 'humidity',    icon: '🌫️', unit: '%',    status: 'online' },
  { id: 'S4', name: 'Soil pH',         field: 'South',  key: 'ph',          icon: '🔬', unit: 'pH',   status: 'online' },
  { id: 'S5', name: 'Water Level',     field: 'Tank A', key: 'waterLevel',  icon: '🪣', unit: '%',    status: 'online' },
  { id: 'S6', name: 'Wind Speed',      field: 'Station',key: 'windSpeed',   icon: '💨', unit: 'km/h', status: 'online' },
  { id: 'S7', name: 'Soil Moisture',   field: 'East',   key: 'moisture',    icon: '💧', unit: '%',    status: 'warning'},
  { id: 'S8', name: 'Water Level',     field: 'Tank B', key: 'waterLevel',  icon: '🪣', unit: '%',    status: 'offline'},
];

// ── Notification toast ────────────────────────────────────────────────────────
function showToast(msg, type = 'info') {
  const colors = { info: '#3b82f6', success: '#22c55e', warning: '#f59e0b', error: '#ef4444' };
  const toast = document.createElement('div');
  toast.style.cssText = `
    position:fixed;bottom:24px;right:24px;z-index:9999;
    background:#0a1f30;border:1px solid ${colors[type]};border-radius:12px;
    padding:14px 20px;font-size:14px;font-weight:600;color:#e8f4f0;
    box-shadow:0 8px 32px rgba(0,0,0,0.5);
    animation:slideIn 0.3s ease;max-width:320px;
    font-family:'Inter',sans-serif;
  `;
  toast.innerHTML = `<span style="margin-right:8px">${{ info: 'ℹ️', success: '✅', warning: '⚠️', error: '❌' }[type]}</span>${msg}`;
  const style = document.createElement('style');
  style.textContent = '@keyframes slideIn{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}';
  document.head.appendChild(style);
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}

// ── Helper: format number ─────────────────────────────────────────────────────
function fmt(n, decimals = 0) { return Number(n).toLocaleString('en-IN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }); }

// ── Gradient helper for Chart.js ─────────────────────────────────────────────
function makeGradient(ctx, color1, color2) {
  const g = ctx.createLinearGradient(0, 0, 0, 300);
  g.addColorStop(0, color1);
  g.addColorStop(1, color2);
  return g;
}

window.AgroApp = { CHART_DEFAULTS, SensorSim, MotorState, WeatherData, CropDB, SensorList, getSensor, showToast, fmt, makeGradient };
