/* ============================================================
   HCP Segmentation Dashboard — Tab-based Interactive Engine
   ============================================================ */

Chart.defaults.color = '#5a6a7e';
Chart.defaults.borderColor = '#e4e9f0';
Chart.defaults.font.family = "'Inter', sans-serif";
Chart.defaults.font.size = 12;
Chart.defaults.plugins.legend.labels.usePointStyle = true;
Chart.defaults.plugins.legend.labels.pointStyle = 'circle';
Chart.defaults.plugins.legend.labels.padding = 16;
Chart.defaults.plugins.tooltip.backgroundColor = '#1a2332';
Chart.defaults.plugins.tooltip.padding = 12;
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
  a: { trx: gen(12, 0, 3, W), eng: gen(2, 0.02, 1.5, W), nrx: gen(1, 0, 1, W), mail: gen(3, 0, 2, W) },
  b: { trx: gen(8, 0.4, 4, W), eng: gen(5, 0.3, 2, W), nrx: gen(3, 0.25, 1.5, W), mail: gen(6, 0.2, 2.5, W) },
  c: { trx: gen(5, 0.15, 3, W), eng: gen(3, 0.1, 2.5, W), nrx: gen(2, 0.08, 1.2, W), mail: gen(4, 0.05, 2, W) }
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
  new Chart(ctx, { type: 'doughnut', data: { labels: ['SEG_A - Traditional', 'SEG_B - Relationship', 'SEG_C - Didactic'], datasets: [{ data: [6406, 3349, 2144], backgroundColor: ['#0051a5', '#00a3e0', '#0d009d'], borderColor: '#fff', borderWidth: 3, hoverOffset: 8 }] }, options: { cutout: '65%', responsive: true, plugins: { legend: { position: 'bottom' }, tooltip: { callbacks: { label: c => `${c.label}: ${c.raw.toLocaleString()} (${(c.raw / 11899 * 100).toFixed(1)}%)` } } } } });
}

function createFunnel() {
  const ctx = document.getElementById('chart-funnel');
  if (!ctx) return;
  new Chart(ctx, { type: 'bar', data: { labels: ['Total Market', 'Labeled', 'SEG_B (High-Value)', 'Convertible (C to B)', 'Elite Targets'], datasets: [{ data: [20931, 11899, 3349, 1500, 650], backgroundColor: ['#c4def0', '#8ac3e0', '#00a3e0', '#0051a5', '#0d009d'], borderRadius: 6, borderSkipped: false }] }, options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, grid: { color: '#f0f2f5' } }, x: { grid: { display: false }, ticks: { font: { size: 10 } } } } } });
}

function createPersonaFull(id, data, color) {
  const ctx = document.getElementById(id);
  if (!ctx) return;
  new Chart(ctx, { type: 'line', data: { labels: wk, datasets: [
    { label: 'UC TRx Volume', data: data.trx, borderColor: color, backgroundColor: color + '12', fill: true, tension: 0.4, borderWidth: 2.5, pointRadius: 3, pointHoverRadius: 6 },
    { label: 'Marketing Engagement', data: data.eng, borderColor: '#d97706', backgroundColor: 'transparent', borderDash: [5, 3], tension: 0.4, borderWidth: 2, pointRadius: 2, pointHoverRadius: 5 },
    { label: 'New Rx (NRx)', data: data.nrx, borderColor: '#0fa672', backgroundColor: 'transparent', tension: 0.4, borderWidth: 1.5, pointRadius: 2, pointHoverRadius: 5 },
    { label: 'Direct Mail Response', data: data.mail, borderColor: '#8c9bb0', backgroundColor: 'transparent', borderDash: [2, 2], tension: 0.4, borderWidth: 1.5, pointRadius: 1 }
  ] }, options: { responsive: true, maintainAspectRatio: true, interaction: { mode: 'index', intersect: false },
    plugins: { legend: { position: 'top', labels: { font: { size: 11 } } }, tooltip: { mode: 'index' } },
    scales: { y: { beginAtZero: true, grid: { color: '#f0f2f5' } }, x: { grid: { display: false }, ticks: { font: { size: 9 }, maxTicksLimit: 10 } } }
  } });
}

function createRadar() {
  const ctx = document.getElementById('chart-radar');
  if (!ctx) return;
  new Chart(ctx, { type: 'radar', data: { labels: ['Detail Response', 'Mail Response', 'Rx Growth', 'New Rx Adoption', 'Visit Frequency', 'Oral ATx Interest'],
    datasets: [
      { label: 'SEG_A', data: [20, 15, 10, 8, 25, 12], borderColor: '#0051a5', backgroundColor: 'rgba(0,81,165,0.05)', borderWidth: 2, pointBackgroundColor: '#0051a5' },
      { label: 'SEG_B', data: [85, 78, 72, 80, 90, 88], borderColor: '#00a3e0', backgroundColor: 'rgba(0,163,224,0.05)', borderWidth: 2, pointBackgroundColor: '#00a3e0' },
      { label: 'SEG_C', data: [45, 50, 35, 40, 55, 42], borderColor: '#0d009d', backgroundColor: 'rgba(13,0,157,0.05)', borderWidth: 2, pointBackgroundColor: '#0d009d' }
    ] }, options: { responsive: true, scales: { r: { beginAtZero: true, max: 100, grid: { color: '#e4e9f0' }, angleLines: { color: '#e4e9f0' }, pointLabels: { font: { size: 11 } }, ticks: { display: false } } }, plugins: { legend: { position: 'bottom' } } } });
}

function createConversion() {
  const ctx = document.getElementById('chart-conversion');
  if (!ctx) return;
  new Chart(ctx, { type: 'bar', data: { labels: ['SEG_A to B Potential', 'SEG_C to B Potential', 'Already SEG_B'], datasets: [{ data: [640, 1500, 3349], backgroundColor: ['#c4def0', '#54c8e8', '#00a3e0'], borderRadius: 6, borderSkipped: false }] }, options: { responsive: true, indexAxis: 'y', plugins: { legend: { display: false } }, scales: { x: { beginAtZero: true, grid: { color: '#f0f2f5' } }, y: { grid: { display: false } } } } });
}

function createPSI() {
  const ctx = document.getElementById('chart-psi');
  if (!ctx) return;
  const items = [
    { f: 'UC_TRX (Prescriptions)', v: 0.38 }, { f: 'UC_NRX (New Rx)', v: 0.32 },
    { f: 'DIRECTMAIL', v: 0.29 }, { f: 'DETAILS (Rep Visits)', v: 0.27 },
    { f: 'Demographics', v: 0.15 }, { f: 'Temporal Aggregates', v: 0.07 }
  ];
  const colors = items.map(d => d.v > 0.25 ? '#dc2626' : d.v > 0.10 ? '#d97706' : '#0fa672');
  new Chart(ctx, { type: 'bar', data: { labels: items.map(d => d.f), datasets: [{ data: items.map(d => d.v), backgroundColor: colors.map(c => c + '33'), borderColor: colors, borderWidth: 2, borderRadius: 6, borderSkipped: false }] }, options: { responsive: true, indexAxis: 'y', plugins: { legend: { display: false } }, scales: { x: { beginAtZero: true, max: 0.5, grid: { color: '#f0f2f5' } }, y: { grid: { display: false }, ticks: { font: { size: 11 } } } } } });
}

/* ---- Counters ---- */
function animateCounters() {
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count);
    const dur = 1200, start = performance.now();
    (function update(now) {
      const p = Math.min((now - start) / dur, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))).toLocaleString();
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
