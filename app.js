/* ============================================================
   HCP Segmentation Dashboard — Tab-based Interactive Engine
   ============================================================ */

Chart.defaults.color = '#64748b';
Chart.defaults.borderColor = '#e2e8f0';
Chart.defaults.font.family = "'Inter', sans-serif";
Chart.defaults.font.size = 13;
Chart.defaults.plugins.legend.labels.usePointStyle = true;
Chart.defaults.plugins.legend.labels.pointStyle = 'circle';
Chart.defaults.plugins.legend.labels.padding = 20;
Chart.defaults.plugins.tooltip.backgroundColor = '#1e293b';
Chart.defaults.plugins.tooltip.padding = 14;
Chart.defaults.plugins.tooltip.cornerRadius = 8;

/* ---- Simulated weekly data ---- */
function gen(base, trend, noise, n) {
  const d = [];
  for (let i = 0; i < n; i++) d.push(Math.max(0, Math.round((base + trend * i + (Math.random() - 0.5) * noise) * 10) / 10));
  return d;
}
const W = 20;
const wk = Array.from({ length: W }, (_, i) => `W${(i + 1) * 4}`);

const P = {
  a: { trx: gen(12, 0, 1.5, W), eng: gen(2, 0.02, 0.5, W), nrx: gen(1, 0, 0.5, W) },
  b: { trx: gen(8, 0.4, 2, W), eng: gen(5, 0.3, 1, W), nrx: gen(3, 0.25, 0.8, W) },
  c: { trx: gen(5, 0.15, 1.5, W), eng: gen(3, 0.1, 1.2, W), nrx: gen(2, 0.08, 0.6, W) }
};

/* ---- Tab System ---- */
function initTabs() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      const panel = document.getElementById(btn.dataset.tab);
      if (panel) {
        panel.classList.add('active');
        if (!panel.dataset.loaded) { loadTabCharts(btn.dataset.tab); panel.dataset.loaded = '1'; }
      }
    });
  });
  // Sub-tabs
  document.querySelectorAll('.sub-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      const group = btn.closest('.sub-tabs');
      const container = btn.closest('.tab-content') || document;
      group.querySelectorAll('.sub-tab').forEach(b => b.classList.remove('active'));
      container.querySelectorAll('.sub-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const panel = container.querySelector(`#${btn.dataset.subtab}`);
      if (panel) panel.classList.add('active');
    });
  });
}

function loadTabCharts(tabId) {
  if (tabId === 'tab-overview') { createDoughnut(); createFunnel(); }
  if (tabId === 'tab-hcp') { createPersonaFull('chart-pa-main', P.a, '#0051a5'); createPersonaFull('chart-pb-main', P.b, '#00a3e0'); createPersonaFull('chart-pc-main', P.c, '#0d009d'); }
  if (tabId === 'tab-marketing') { createRadar(); createConversion(); }
  if (tabId === 'tab-drift') { createPSI(); }
}

/* ---- Charts ---- */
function createDoughnut() {
  const ctx = document.getElementById('chart-doughnut');
  if (!ctx) return;
  new Chart(ctx, { type: 'doughnut', data: { labels: ['SEG_A (Traditional)', 'SEG_B (Relationship)', 'SEG_C (Didactic)'], datasets: [{ data: [6406, 3349, 2144], backgroundColor: ['#0051a5', '#00a3e0', '#0d009d'], borderColor: '#ffffff', borderWidth: 4, hoverOffset: 8 }] }, options: { maintainAspectRatio: false, cutout: '70%', responsive: true, plugins: { legend: { position: 'bottom' }, tooltip: { callbacks: { label: c => `${c.label}: ${c.raw.toLocaleString()} HCPs (${(c.raw / 11899 * 100).toFixed(1)}%)` } } } } });
}

function createFunnel() {
  const ctx = document.getElementById('chart-funnel');
  if (!ctx) return;
  new Chart(ctx, { type: 'bar', data: { labels: ['Total Market', 'Labeled Cohort', 'Unlabeled Pool', 'SEG_A', 'SEG_B', 'SEG_C'], datasets: [{ data: [20931, 11899, 9032, 6406, 3349, 2144], backgroundColor: ['#e2e8f0', '#cbd5e1', '#94a3b8', '#0051a5', '#00a3e0', '#0d009d'], borderRadius: 6, borderSkipped: false }] }, options: { maintainAspectRatio: false, responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, grid: { color: '#f1f5f9' } }, x: { grid: { display: false }, ticks: { font: { size: 11 } } } } } });
}

function createPersonaFull(id, data, color) {
  const ctx = document.getElementById(id);
  if (!ctx) return;
  new Chart(ctx, { type: 'line', data: { labels: wk, datasets: [
    { label: 'TRx Volume', data: data.trx, borderColor: color, backgroundColor: color + '10', fill: true, tension: 0.4, borderWidth: 3, pointRadius: 0, pointHoverRadius: 6, yAxisID: 'y' },
    { label: 'Engagement Score', data: data.eng, borderColor: '#d97706', backgroundColor: 'transparent', borderDash: [4, 4], tension: 0.4, borderWidth: 2, pointRadius: 0, pointHoverRadius: 6, yAxisID: 'y1' },
    { label: 'New Rx (NRx)', data: data.nrx, borderColor: '#059669', backgroundColor: 'transparent', tension: 0.4, borderWidth: 2, pointRadius: 0, pointHoverRadius: 6, yAxisID: 'y1' }
  ] }, options: { responsive: true, maintainAspectRatio: true, interaction: { mode: 'index', intersect: false },
    plugins: { legend: { position: 'top' }, tooltip: { mode: 'index' } },
    maintainAspectRatio: false,
    scales: { 
      y: { type: 'linear', display: true, position: 'left', beginAtZero: true, grid: { color: '#f1f5f9' }, title: { display: true, text: 'TRx / NRx Volume' } },
      y1: { type: 'linear', display: true, position: 'right', beginAtZero: true, grid: { drawOnChartArea: false }, title: { display: true, text: 'Marketing Interactions' } },
      x: { grid: { display: false }, ticks: { maxTicksLimit: 8 } } 
    }
  } });
}

function createRadar() {
  const ctx = document.getElementById('chart-radar');
  if (!ctx) return;
  new Chart(ctx, { type: 'radar', data: { labels: ['Sales Rep Visits', 'Email Campaigns', 'Rx Growth YoY', 'Oral ATx Prescribing', 'Webinar Attendance', 'Sample Utilization'],
    datasets: [
      { label: 'SEG_A', data: [85, 30, 45, 20, 25, 40], borderColor: '#0051a5', backgroundColor: 'rgba(0,81,165,0.05)', borderWidth: 2, pointBackgroundColor: '#0051a5' },
      { label: 'SEG_B', data: [75, 80, 85, 90, 70, 85], borderColor: '#00a3e0', backgroundColor: 'rgba(0,163,224,0.05)', borderWidth: 2, pointBackgroundColor: '#00a3e0' },
      { label: 'SEG_C', data: [55, 60, 65, 40, 85, 50], borderColor: '#0d009d', backgroundColor: 'rgba(13,0,157,0.05)', borderWidth: 2, pointBackgroundColor: '#0d009d' }
    ] }, options: { maintainAspectRatio: false, responsive: true, scales: { r: { beginAtZero: true, max: 100, grid: { color: '#e2e8f0' }, angleLines: { color: '#e2e8f0' }, pointLabels: { font: { size: 11 } }, ticks: { display: false } } }, plugins: { legend: { position: 'bottom' } } } });
}

function createConversion() {
  const ctx = document.getElementById('chart-conversion');
  if (!ctx) return;
  new Chart(ctx, { type: 'bar', data: { labels: ['Model Accuracy (Tabular)', 'Deep Seq Recall (SEG_C)', 'Topological Confidence'], datasets: [{ data: [61.0, 75.0, 54.8], backgroundColor: ['#cbd5e1', '#00a3e0', '#0051a5'], borderRadius: 6, borderSkipped: false }] }, options: { maintainAspectRatio: false, responsive: true, indexAxis: 'y', plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => `${c.raw}%` } } }, scales: { x: { beginAtZero: true, max: 100, grid: { color: '#f1f5f9' }, title: { display: true, text: 'Metric Performance (%)' } }, y: { grid: { display: false } } } } });
}

function createPSI() {
  const ctx = document.getElementById('chart-psi');
  if (!ctx) return;
  const items = [
    { f: 'Prescription Vol (TRx)', v: 0.38 }, { f: 'New Patient Starts', v: 0.32 },
    { f: 'Marketing Engagement', v: 0.29 }, { f: 'Rep Visit Frequency', v: 0.27 },
    { f: 'Geographic Shifts', v: 0.15 }, { f: 'Practice Type', v: 0.07 }
  ];
  const colors = items.map(d => d.v > 0.25 ? '#dc2626' : d.v > 0.10 ? '#d97706' : '#059669');
  new Chart(ctx, { type: 'bar', data: { labels: items.map(d => d.f), datasets: [{ data: items.map(d => d.v), backgroundColor: colors, borderRadius: 6, borderSkipped: false }] }, options: { maintainAspectRatio: false, responsive: true, indexAxis: 'y', plugins: { legend: { display: false } }, scales: { x: { beginAtZero: true, max: 0.5, grid: { color: '#f1f5f9' } }, y: { grid: { display: false } } } } });
}

/* ---- Counters ---- */
function animateCounters() {
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseFloat(el.dataset.count);
    const isFloat = el.dataset.count.includes('.');
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const dur = 1200, start = performance.now();
    (function update(now) {
      const p = Math.min((now - start) / dur, 1);
      const val = target * (1 - Math.pow(1 - p, 3));
      el.textContent = prefix + (isFloat ? val.toFixed(1) : Math.round(val).toLocaleString()) + suffix;
      if (p < 1) requestAnimationFrame(update);
    })(start);
  });
}

function animateMeters() {
  document.querySelectorAll('.segment-meter-fill').forEach(el => {
    setTimeout(() => { el.style.width = el.dataset.width + '%'; }, 400);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  loadTabCharts('tab-overview');
  animateCounters();
  animateMeters();
});
