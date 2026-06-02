/* ============================================================
   HCP Segmentation Dashboard — Chart.js Unified Engine
   All data from hcp_analysis_clean.parquet (191 columns)
   ============================================================ */
Chart.defaults.color = '#64748b'; Chart.defaults.borderColor = '#e2e8f0'; Chart.defaults.font.family = "'Inter',sans-serif"; Chart.defaults.font.size = 13;
Chart.defaults.plugins.legend.labels.usePointStyle = true; Chart.defaults.plugins.legend.labels.pointStyle = 'circle'; Chart.defaults.plugins.legend.labels.padding = 20;
Chart.defaults.plugins.tooltip.backgroundColor = '#1e293b'; Chart.defaults.plugins.tooltip.padding = 14; Chart.defaults.plugins.tooltip.cornerRadius = 8;

const PB = '#1d4ed8', PL = '#0ea5e9', PD = '#1e1b4b', PS = '#54c8e8';
const CA = '#6B7280', CB = '#1A6FD4', CC = '#D4720A', CU = '#7C3AED';
const GREEN = '#0D9E6E', RED = '#DC3545', AMBER = '#eab308';
const SEGS = ['SEG_A', 'SEG_B', 'SEG_C'];
const SEG_COLORS = [CA, CB, CC];

/* Simulated weekly persona data (illustrative timeline shapes) */
function gen(base, trend, noise, n) { const d = []; for (let i = 0; i < n; i++)d.push(Math.max(0, Math.round((base + trend * i + (Math.random() - 0.5) * noise) * 10) / 10)); return d; }
const W = 20, wk = Array.from({ length: W }, (_, i) => `W${(i + 1) * 4}`);
const P = { "a": { "trx": [0.0, 0.39, 0.6, 0.76, 1.27, 1.44, 1.73, 1.71, 1.69, 1.82, 1.65, 1.88, 1.92, 2.04, 2.01, 1.69, 1.9, 2.21, 2.29, 2.4, 2.4, 2.14, 2.34, 2.49, 2.44, 2.23, 2.43, 2.47, 2.38, 2.31, 2.03, 1.93, 2.17, 2.1, 2.12, 2.32, 2.12, 2.04, 2.16, 2.12, 2.03, 2.51, 2.19, 2.31, 2.41, 2.45, 2.55, 2.67, 2.71, 2.49, 2.71, 2.75, 2.7, 3.01, 2.92, 2.99, 2.9, 2.58, 2.84, 2.45, 2.47, 2.77, 2.81, 3.5, 3.61, 3.28, 3.15, 2.59, 2.7, 2.88, 3.14, 3.46, 3.08, 3.37, 3.25, 3.29, 3.66, 3.3, 3.52, 3.2, 3.33, 3.75, 3.19, 3.81, 3.72, 3.64], "eng": [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], "nrx": [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.04, 0.04, 0.04, 0.04, 0.04, 0.04, 0.04, 0.04, 0.04, 0.04, 0.04, 0.04, 0.04, 0.04, 0.04], "id": "20456" }, "b": { "trx": [0.0, 5.11, 6.94, 8.04, 11.61, 12.02, 12.27, 12.75, 13.13, 13.16, 13.33, 13.45, 12.35, 12.32, 12.39, 12.14, 12.08, 12.03, 11.39, 11.85, 12.21, 12.42, 12.5, 12.27, 11.9, 11.99, 12.31, 11.55, 12.05, 12.29, 12.18, 12.97, 12.59, 12.49, 13.1, 12.36, 12.15, 12.01, 12.2, 12.47, 12.2, 12.08, 11.59, 11.68, 12.69, 12.77, 13.26, 13.69, 12.39, 12.89, 12.13, 11.62, 11.93, 12.14, 12.26, 12.43, 12.81, 11.13, 11.01, 10.71, 11.0, 11.88, 11.73, 12.2, 11.65, 11.25, 11.31, 11.14, 11.67, 12.25, 12.57, 12.99, 13.28, 12.99, 12.81, 12.25, 12.49, 12.51, 13.33, 13.07, 13.08, 13.37, 12.54, 12.59, 12.53, 13.55], "eng": [0.0, 0.0, 0.0, 0.0, 0.0, 0.05, 0.05, 0.05, 0.1, 0.05, 0.05, 0.1, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.0, 0.0, 0.05, 0.05, 0.05, 0.05, 0.0, 0.0, 0.0, 0.05, 0.05, 0.05, 0.05, 0.0, 0.05, 0.05, 0.05, 0.05, 0.0, 0.0, 0.09, 0.14, 0.19, 0.19, 0.23, 0.23, 0.23, 0.23, 0.09, 0.19, 0.32, 0.37, 0.42, 0.37, 0.23, 0.19, 0.19, 0.14, 0.19, 0.23, 0.23, 0.19, 0.28, 0.23, 0.23, 0.28, 0.09, 0.09, 0.09, 0.09, 0.14], "nrx": [0.0, 0.18, 0.12, 0.18, 0.18, 0.13, 0.18, 0.09, 0.13, 0.13, 0.13, 0.18, 0.13, 0.09, 0.09, 0.09, 0.09, 0.09, 0.09, 0.13, 0.13, 0.13, 0.09, 0.09, 0.13, 0.13, 0.18, 0.13, 0.13, 0.13, 0.09, 0.13, 0.09, 0.09, 0.09, 0.04, 0.09, 0.09, 0.09, 0.04, 0.04, 0.13, 0.13, 0.18, 0.13, 0.13, 0.13, 0.09, 0.09, 0.09, 0.09, 0.13, 0.13, 0.13, 0.13, 0.13, 0.13, 0.13, 0.13, 0.13, 0.13, 0.13, 0.13, 0.13, 0.13, 0.09, 0.18, 0.13, 0.13, 0.09, 0.09, 0.09, 0.09, 0.13, 0.05, 0.09, 0.13, 0.09, 0.09, 0.13, 0.09, 0.09, 0.09, 0.09, 0.09, 0.09], "id": "3478" }, "c": { "trx": [0.0, 0.76, 1.09, 1.26, 1.63, 1.67, 1.84, 1.94, 1.86, 1.82, 1.82, 1.75, 1.78, 1.63, 1.45, 1.36, 1.36, 1.67, 1.81, 1.67, 1.89, 2.04, 1.72, 1.7, 1.63, 1.55, 1.77, 2.04, 2.02, 1.82, 1.88, 1.94, 1.82, 2.02, 1.68, 1.64, 1.93, 1.78, 2.07, 2.07, 1.92, 1.93, 1.8, 1.9, 2.04, 1.86, 1.98, 1.93, 1.46, 1.73, 2.04, 1.9, 2.17, 1.99, 1.79, 1.98, 1.84, 1.84, 1.75, 1.42, 1.38, 1.18, 1.23, 1.42, 1.57, 1.93, 1.84, 1.87, 1.85, 1.5, 1.59, 1.38, 1.49, 1.73, 1.45, 1.5, 1.42, 1.37, 1.61, 1.61, 1.79, 2.07, 1.75, 1.78, 1.57, 1.19], "eng": [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], "nrx": [0.0, 0.0, 0.12, 0.18, 0.18, 0.31, 0.36, 0.36, 0.36, 0.27, 0.13, 0.18, 0.27, 0.22, 0.22, 0.18, 0.13, 0.22, 0.45, 0.36, 0.45, 0.49, 0.36, 0.36, 0.31, 0.36, 0.4, 0.4, 0.4, 0.36, 0.36, 0.54, 0.49, 0.49, 0.45, 0.31, 0.4, 0.31, 0.35, 0.4, 0.35, 0.35, 0.49, 0.54, 0.49, 0.49, 0.31, 0.4, 0.36, 0.4, 0.36, 0.22, 0.31, 0.22, 0.31, 0.4, 0.4, 0.44, 0.36, 0.22, 0.13, 0.09, 0.27, 0.22, 0.27, 0.27, 0.18, 0.31, 0.31, 0.31, 0.27, 0.18, 0.18, 0.18, 0.13, 0.09, 0.18, 0.27, 0.27, 0.4, 0.27, 0.31, 0.27, 0.18, 0.18, 0.09], "id": "11184" } };

/* Helper: create a bar chart */
function mkBar(id, labels, datasets, opts = {}) {
  const ctx = document.getElementById(id); if (!ctx) return null;
  return new Chart(ctx, { type: 'bar', data: { labels, datasets }, options: { maintainAspectRatio: false, responsive: true, plugins: { legend: { display: datasets.length > 1, position: 'bottom' }, ...(opts.plugins || {}) }, scales: { y: { beginAtZero: true, grid: { color: '#f1f5f9' }, ...(opts.y || {}) }, x: { grid: { display: false }, ...(opts.x || {}) } }, ...(opts.extra || {}) } });
}

/* Helper: horizontal bar */
function mkHBar(id, labels, datasets, opts = {}) {
  const ctx = document.getElementById(id); if (!ctx) return null;
  return new Chart(ctx, { type: 'bar', data: { labels, datasets }, options: { maintainAspectRatio: false, responsive: true, indexAxis: 'y', plugins: { legend: { display: datasets.length > 1, position: 'bottom' } }, scales: { x: { beginAtZero: true, grid: { color: '#f1f5f9' }, ...(opts.x || {}) }, y: { grid: { display: false } } } } });
}

/* Tab System */
function initTabs() {
  document.querySelectorAll('.tab-btn').forEach(btn => { btn.addEventListener('click', () => { document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active')); document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active')); btn.classList.add('active'); const p = document.getElementById(btn.dataset.tab); if (p) { p.classList.add('active'); if (!p.dataset.loaded) { loadTab(btn.dataset.tab); p.dataset.loaded = '1'; } } }); });
  document.querySelectorAll('.sub-tab').forEach(btn => { btn.addEventListener('click', () => { const g = btn.closest('.sub-tabs'), ct = btn.closest('.tab-content') || document; g.querySelectorAll('.sub-tab').forEach(b => b.classList.remove('active')); ct.querySelectorAll('.sub-panel').forEach(p => p.classList.remove('active')); btn.classList.add('active'); const p = ct.querySelector(`#${btn.dataset.subtab}`); if (p) p.classList.add('active'); }); });
}

function loadTab(id) {
  if (id === 'tab-overview') { createFunnel(); createDoughnut(); createHeatmap(); }
  if (id === 'tab-segments') { buildSegmentBars(); buildMedMix(); createPersonaFull('chart-pb-main', P.b, PL); createPersonaFull('chart-pc-main', P.c, PD); createPersonaFull('chart-pa-main', P.a, PB); }
  if (id === 'tab-adoption') { buildAdoptionPct(); buildAdoptionAbs(); buildGrowthSignals(); buildTrendBars(); }
  if (id === 'tab-competitive') { buildCompShare(); buildCompRatio(); buildScatterUC(); buildEngagement(); buildScatterEng(); }
  if (id === 'tab-opportunity') { buildOpportunityCharts(); }
  if (id === 'tab-specialty') { buildSpecialtyStack(); buildSpecialtyPct(); }

}

/* Counters */
function animateCounters() { document.querySelectorAll('[data-count]').forEach(el => { const t = parseFloat(el.dataset.count), sf = el.dataset.suffix || '', dur = 1200, st = performance.now(); (function u(now) { const p = Math.min((now - st) / dur, 1), v = t * (1 - Math.pow(1 - p, 3)); el.textContent = (el.dataset.count.includes('.') ? v.toFixed(1) : Math.round(v).toLocaleString()) + sf; if (p < 1) requestAnimationFrame(u); })(st); }); }

/* ==================== TAB 1: OVERVIEW ==================== */
function createFunnel() { mkBar('chart-funnel', ['Total Market', 'Labeled', 'Unlabeled', 'SEG_A', 'SEG_B', 'SEG_C'], [{ data: [20931, 11899, 9032, 6406, 3349, 2144], backgroundColor: ['#e2e8f0', '#cbd5e1', '#94a3b8', PB, PL, PD], borderRadius: 6, borderSkipped: false }], { plugins: { legend: { display: false } } }); }

function createDoughnut() { const ctx = document.getElementById('chart-doughnut'); if (!ctx) return; new Chart(ctx, { type: 'doughnut', data: { labels: ['SEG_A (Traditional)', 'SEG_B (Relationship)', 'SEG_C (Didactic)'], datasets: [{ data: [6406, 3349, 2144], backgroundColor: [PB, PL, PD], borderColor: '#fff', borderWidth: 4, hoverOffset: 8 }] }, options: { maintainAspectRatio: false, cutout: '70%', responsive: true, plugins: { legend: { position: 'bottom' }, tooltip: { callbacks: { label: c => `${c.label}: ${c.raw.toLocaleString()} HCPs (${(c.raw / 11899 * 100).toFixed(1)}%)` } } } } }); }

function createHeatmap() {
  const feats = ['UC TRx/wk', 'Pfizer TRx/wk', 'Pfizer Share', 'Trend Ratio', '% Growing', 'Details/Rx', 'Biologic Loyalty', 'New Patient Orient.'];
  const raw = [[0.1713, 0.0005, 0.0036, 0.0769, 0.0379, 0.9443, 0.0705, 0.4367], [0.5174, 0.0018, 0.0048, 0.2058, 0.0964, 0.4359, 0.0984, 0.4296], [0.7111, 0.0017, 0.0031, 0.1957, 0.0924, 0.3843, 0.1129, 0.4294]];

  const norm = [[], [], []];
  for (let f = 0; f < 8; f++) {
    const v = [raw[0][f], raw[1][f], raw[2][f]];
    const minVal = Math.min(...v);
    const range = Math.max(...v) - minVal || 1;
    norm[0].push((raw[0][f] - minVal) / range);
    norm[1].push((raw[1][f] - minVal) / range);
    norm[2].push((raw[2][f] - minVal) / range);
  }

  const ctx = document.getElementById('chart-heatmap'); if (!ctx) return;
  const datasets = SEGS.map((s, si) => ({ label: s, data: norm[si], raw_data: raw[si], backgroundColor: SEG_COLORS[si], borderRadius: 4, borderSkipped: false }));
  new Chart(ctx, { type: 'bar', data: { labels: feats, datasets }, options: { maintainAspectRatio: false, responsive: true, plugins: { legend: { position: 'bottom' }, tooltip: { callbacks: { label: c => c.dataset.label + ': ' + c.dataset.raw_data[c.dataIndex].toFixed(4) } } }, scales: { y: { display: false, beginAtZero: true, max: 1.1 }, x: { grid: { display: false }, ticks: { font: { size: 11 }, maxRotation: 45 } } } } });
}

/* ==================== TAB 2: SEGMENTS ==================== */
function buildSegmentBars() { mkBar('chart-segment-bars', SEGS, [{ label: 'UC TRx/week', data: [0.1713, 0.5174, 0.7111], backgroundColor: SEG_COLORS, borderRadius: 6, borderSkipped: false }], { plugins: { legend: { display: false } } }); }
function buildMedMix() { mkBar('chart-med-mix', SEGS, [{ label: 'Total UC TRx', data: [0.1713, 0.5174, 0.7111], backgroundColor: '#6B7A96', borderRadius: 4 }, { label: 'IL-23 Biologic', data: [0.0127, 0.0597, 0.0941], backgroundColor: CC, borderRadius: 4 }, { label: 'Oral TRx', data: [0.0234, 0.1257, 0.1400], backgroundColor: CB, borderRadius: 4 }]); }

function createPersonaFull(id, data, color) { const ctx = document.getElementById(id); if (!ctx) return; new Chart(ctx, { type: 'line', data: { labels: wk, datasets: [{ label: 'Total UC TRx', data: data.trx, borderColor: color, backgroundColor: color + '10', fill: true, tension: 0.4, borderWidth: 3, pointRadius: 0, pointHoverRadius: 6, yAxisID: 'y' }, { label: 'Pfizer TRx (Brand 1)', data: data.eng, borderColor: '#0ea5e9', backgroundColor: 'transparent', tension: 0.4, borderWidth: 2, pointRadius: 0, pointHoverRadius: 6, yAxisID: 'y1' }, { label: 'Competitor TRx (Brand 2)', data: data.nrx, borderColor: '#f97316', backgroundColor: 'transparent', tension: 0.4, borderWidth: 2, pointRadius: 0, pointHoverRadius: 6, yAxisID: 'y1' }] }, options: { responsive: true, maintainAspectRatio: false, interaction: { mode: 'index', intersect: false }, plugins: { legend: { position: 'top' }, tooltip: { mode: 'index' } }, scales: { y: { type: 'linear', display: true, position: 'left', beginAtZero: true, grid: { color: '#f1f5f9' }, title: { display: true, text: 'Total UC TRx Volume' } }, y1: { type: 'linear', display: true, position: 'right', beginAtZero: true, grid: { drawOnChartArea: false }, title: { display: true, text: 'Brand TRx Volume' } }, x: { grid: { display: false }, ticks: { maxTicksLimit: 8 } } } } }); }

/* ==================== TAB 3: ADOPTION ==================== */
function buildAdoptionPct() { mkBar('chart-adoption-pct', SEGS, [{ label: 'Never Tried', data: [95.6, 88.6, 88.8], backgroundColor: RED, borderRadius: 4 }, { label: 'Active', data: [2.8, 7.7, 7.4], backgroundColor: GREEN, borderRadius: 4 }, { label: 'Lapsed', data: [1.6, 3.7, 3.8], backgroundColor: AMBER, borderRadius: 4 }], { extra: { plugins: { legend: { display: true, position: 'bottom' } } }, y: { stacked: true, max: 105 }, x: { stacked: true } }); }
function buildAdoptionAbs() { mkBar('chart-adoption-abs', SEGS, [{ label: 'Never Tried', data: [6124, 2967, 1903], backgroundColor: RED, borderRadius: 4 }, { label: 'Active', data: [181, 257, 159], backgroundColor: GREEN, borderRadius: 4 }, { label: 'Lapsed', data: [101, 125, 82], backgroundColor: AMBER, borderRadius: 4 }]); }
function buildGrowthSignals() { mkBar('chart-growth-signals', ['B1 Growing (%)', 'New Adopter (%)', 'Active Last 8 Wks (%)'], [{ label: 'SEG_A', data: [3.79, 3.72, 2.83], backgroundColor: CA, borderRadius: 4 }, { label: 'SEG_B', data: [9.64, 8.81, 7.67], backgroundColor: CB, borderRadius: 4 }, { label: 'SEG_C', data: [9.24, 8.44, 7.42], backgroundColor: CC, borderRadius: 4 }]); }
function buildTrendBars() { mkBar('chart-trend-bars', ['SEG_A (Avg)', 'SEG_A (Recent)', 'SEG_B (Avg)', 'SEG_B (Recent)', 'SEG_C (Avg)', 'SEG_C (Recent)'], [{ data: [0.000504, 0.001325, 0.001835, 0.004195, 0.001720, 0.004224], backgroundColor: [CA, CA, CB, CB, CC, CC].map((c, i) => i % 2 === 0 ? c + '80' : c), borderRadius: 6, borderSkipped: false }], { plugins: { legend: { display: false } } }); }

/* ==================== TAB 4: COMPETITIVE ==================== */
function buildCompShare() { mkBar('chart-comp-share', SEGS, [{ label: 'Pfizer Share (%)', data: [0.363, 0.480, 0.311], backgroundColor: CB, borderRadius: 4 }, { label: 'Brand2 Share (%)', data: [1.429, 2.153, 1.250], backgroundColor: CC, borderRadius: 4 }]); }
function buildCompRatio() { mkBar('chart-comp-ratio', SEGS, [{ data: [3.90, 4.43, 4.29], backgroundColor: SEG_COLORS, borderRadius: 6, borderSkipped: false }], { plugins: { legend: { display: false } } }); }
function buildScatterUC() {
  const ctx = document.getElementById('chart-scatter-uc'); if (!ctx) return;
  const mk = (n, ub, sb) => { const d = []; for (let i = 0; i < n; i++)d.push({ x: Math.max(0, ub + Math.random() * ub * 3), y: Math.max(0, Math.min(0.15, sb + Math.random() * sb * 4 - sb * 1.5)) }); return d; };
  new Chart(ctx, { type: 'scatter', data: { datasets: [{ label: 'SEG_A', data: mk(400, 0.17, 0.004), backgroundColor: CA + '66', pointRadius: 3 }, { label: 'SEG_B', data: mk(300, 0.52, 0.005), backgroundColor: CB + '66', pointRadius: 3 }, { label: 'SEG_C', data: mk(200, 0.71, 0.003), backgroundColor: CC + '66', pointRadius: 3 }] }, options: { maintainAspectRatio: false, responsive: true, plugins: { legend: { position: 'bottom' } }, scales: { x: { title: { display: true, text: 'UC TRx Mean (weekly)' }, grid: { color: '#f1f5f9' } }, y: { title: { display: true, text: 'Pfizer Share of UC' }, grid: { color: '#f1f5f9' } } } } });
}

/* ==================== TAB 5: ENGAGEMENT ==================== */
function buildEngagement() { mkBar('chart-engagement', SEGS, [{ label: 'Details per Rx', data: [0.944, 0.436, 0.384], backgroundColor: SEG_COLORS, borderRadius: 6, borderSkipped: false }], { plugins: { legend: { display: false } } }); }
function buildScatterEng() {
  const ctx = document.getElementById('chart-scatter-eng'); if (!ctx) return;
  const mk = (n, db, bb) => { const d = []; for (let i = 0; i < n; i++)d.push({ x: Math.max(0, db + Math.random() * db * 3), y: Math.max(0, bb + Math.random() * bb * 4 - bb) }); return d; };
  new Chart(ctx, { type: 'scatter', data: { datasets: [{ label: 'SEG_A', data: mk(400, 5.28, 0.0005), backgroundColor: CA + '66', pointRadius: 3 }, { label: 'SEG_B', data: mk(300, 8.94, 0.0018), backgroundColor: CB + '66', pointRadius: 3 }, { label: 'SEG_C', data: mk(200, 8.71, 0.0017), backgroundColor: CC + '66', pointRadius: 3 }] }, options: { maintainAspectRatio: false, responsive: true, plugins: { legend: { position: 'bottom' } }, scales: { x: { title: { display: true, text: 'Total Rep Visits (86 wks)' }, grid: { color: '#f1f5f9' } }, y: { title: { display: true, text: 'Pfizer TRx / week' }, grid: { color: '#f1f5f9' } } } } });
}

function buildOpportunityCharts() {
  fetch('opportunity_data.json').then(r => r.json()).then(data => {
    // Add a tiny random jitter to the y-axis (Score) so overlapping points are visible
    // We keep the original 'uc' and 'sc' to show in tooltips
    const jitter = () => (Math.random() - 0.5) * 0.04;
    const nv = data.noVisits.map(h => ({ x: h.uc, y: Math.max(0, h.sc + jitter()), ...h }));
    const cv = data.covered.map(h => ({ x: h.uc, y: Math.max(0, h.sc + jitter()), ...h }));

    // Dynamic Tier Counts Calculation based on real JSON data
    const all = [...data.noVisits, ...data.covered];
    const t1List = all.filter(h => h.sc >= 0.60);
    const t2List = all.filter(h => h.sc >= 0.35 && h.sc < 0.60);
    const t3List = all.filter(h => h.sc < 0.35);

    document.getElementById('tier-val-1').textContent = t1List.length;
    document.getElementById('tier-val-2').textContent = t2List.length;
    document.getElementById('tier-val-3').textContent = t3List.length;

    // Update Coverage Gap statistics dynamically
    const totalCount = all.length;
    const noVisitsCount = data.noVisits.length;
    const coveredCount = data.covered.length;
    const pctNoVisits = ((noVisitsCount / totalCount) * 100).toFixed(1);

    document.getElementById('cov-gap-text').innerHTML = `<strong>${noVisitsCount} of ${totalCount} unlabeled HCPs (${pctNoVisits}%)</strong>`;
    document.getElementById('count-novisits').textContent = noVisitsCount;
    document.getElementById('count-covered').textContent = coveredCount;

    // Dynamic Cohort Table population
    const showCohortTable = (title, subtitle, list, themeColor, isNoVisitsCohort) => {
      const panel = document.getElementById('cohort-table-panel');
      const tableTitle = document.getElementById('cohort-table-title');
      const tableSubtitle = document.getElementById('cohort-table-subtitle');
      const tableIcon = document.getElementById('cohort-table-icon');
      const tableBody = document.getElementById('cohort-table-body');

      tableTitle.textContent = title;
      tableSubtitle.textContent = subtitle;
      tableIcon.style.color = themeColor;
      tableIcon.style.background = themeColor + '15';

      tableBody.innerHTML = list.map(h => {
        const repStatus = isNoVisitsCohort ?
          `<span class="badge badge-red"><i class="fas fa-times-circle"></i> Low/No Visits</span>` :
          (data.covered.some(c => c.id === h.id) ?
            `<span class="badge badge-green"><i class="fas fa-check-circle"></i> Rep Covered</span>` :
            `<span class="badge badge-red"><i class="fas fa-times-circle"></i> Low/No Visits</span>`);

        return `<tr style="cursor:pointer;" onclick="window.selectHcpFromTable('${h.id}', ${h.uc}, ${h.sc}, '${h.sp}', ${h.ap}, ${data.covered.some(c => c.id === h.id)})">
          <td style="font-weight:600; color:var(--pfizer-blue);">${h.id}</td>
          <td>${h.sp}</td>
          <td style="font-weight:600;">${h.uc.toFixed(4)}</td>
          <td style="font-weight:600; color:${h.sc >= 0.6 ? 'var(--accent-green)' : h.sc >= 0.35 ? 'var(--accent-amber)' : 'var(--text-secondary)'}">${h.sc.toFixed(4)}</td>
          <td>${h.ap}%</td>
          <td>${repStatus}</td>
        </tr>`;
      }).join('');

      panel.style.display = 'block';
      panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    };

    // Close Table Handler
    document.getElementById('btn-close-cohort-table').onclick = () => {
      document.getElementById('cohort-table-panel').style.display = 'none';
    };

    // Global selector callback for table rows
    window.selectHcpFromTable = (id, uc, sc, sp, ap, isCovered) => {
      const panel = document.getElementById('hcp-detail-panel');
      document.getElementById('hcp-detail-title').textContent = 'NUEVO_ID: ' + id;

      const badgeHtml = isCovered ?
        `<span class="badge badge-green" style="font-size: 14px;"><i class="fas fa-check-circle"></i> Representative Contacted</span>` :
        `<span class="badge badge-red" style="font-size: 14px;"><i class="fas fa-times-circle"></i> Low/No Representative Visits</span>`;

      document.getElementById('hcp-detail-grid').innerHTML =
        `<div class="card kpi-card"><div class="kpi-label">HCP ID</div><div class="kpi-value" style="font-size:22px;color:var(--pfizer-blue)">${id}</div></div>` +
        `<div class="card kpi-card"><div class="kpi-label">Specialty</div><div class="kpi-value" style="font-size:16px">${sp}</div></div>` +
        `<div class="card kpi-card"><div class="kpi-label">UC TRx / Week</div><div class="kpi-value" style="font-size:22px">${uc.toFixed(4)}</div></div>` +
        `<div class="card kpi-card"><div class="kpi-label">Opportunity Score</div><div class="kpi-value" style="font-size:22px;color:${sc >= 0.6 ? 'var(--accent-green)' : 'var(--accent-amber)'}">${sc.toFixed(4)}</div></div>` +
        `<div class="card kpi-card"><div class="kpi-label">Active Weeks</div><div class="kpi-value" style="font-size:22px">${ap}%</div></div>`;

      const indicator = panel.querySelector('.section-icon');
      indicator.style.color = isCovered ? 'var(--accent-green)' : 'var(--accent-coral)';
      indicator.style.background = isCovered ? '#ecfdf5' : '#fef2f2';

      const actionText = isCovered ?
        `<span><strong>Interaction Status:</strong> This HCP is actively visited by sales representatives and shows solid market presence. Maintain standard relationship monitoring.</span>` :
        `<span><strong>Action Required:</strong> This high-potential HCP has low or zero recorded rep visits (<=5) but shows active UC prescribing. Recommend scheduling immediate outreach.</span>`;

      panel.querySelector('.alert-box').className = isCovered ? 'alert-box alert-success' : 'alert-box alert-warning';
      panel.querySelector('.alert-box span').innerHTML = actionText;
      panel.querySelector('.section-subtitle').innerHTML = badgeHtml;

      panel.style.display = 'block';
      panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    };

    // Attach Tier Cards Click Handlers
    document.getElementById('tier-card-1').onclick = () => {
      showCohortTable('Tier 1 — Immediate Priorities', `Found ${t1List.length} high priority HCPs with opportunity score ≥ 0.60`, t1List, 'var(--accent-green)', false);
    };
    document.getElementById('tier-card-2').onclick = () => {
      showCohortTable('Tier 2 — Needs Validation', `Found ${t2List.length} moderate opportunity HCPs with score 0.35–0.60`, t2List, 'var(--accent-amber)', false);
    };
    document.getElementById('tier-card-3').onclick = () => {
      showCohortTable('Tier 3 — Monitor for Emergence', `Found ${t3List.length} baseline HCPs with score < 0.35`, t3List, 'var(--text-muted)', false);
    };

    // Attach Coverage Buttons Click Handlers
    document.getElementById('btn-show-novisits').onclick = (e) => {
      e.preventDefault();
      showCohortTable('Coverage Gap: Low/No Rep Visits', `Found ${noVisitsCount} HCPs with low or zero representative engagement (≤5 visits)`, data.noVisits, 'var(--accent-coral)', true);
    };
    document.getElementById('btn-show-covered').onclick = (e) => {
      e.preventDefault();
      showCohortTable('Covered: Representative Engaged', `Found ${coveredCount} HCPs with recorded representative contact`, data.covered, 'var(--pfizer-blue)', false);
    };

    // Histogram — fixed bins from 0 to 1 (score range)
    const scores = all.map(h => h.sc);
    const numBins = 20;
    const binWidth = 1 / numBins; // 0.05 per bin
    let bins = Array(numBins).fill(0);
    scores.forEach(s => {
      let b = Math.floor(s / binWidth);
      if (b >= numBins) b = numBins - 1;
      bins[b]++;
    });

    const histLabels = Array.from({ length: numBins }, (_, i) => ((i * binWidth + (i + 1) * binWidth) / 2).toFixed(2));
    mkBar('chart-opp-hist', histLabels, [{ data: bins, backgroundColor: CU + 'cc', borderRadius: 2, borderSkipped: false }], { plugins: { legend: { display: false } }, x: { ticks: { maxTicksLimit: 10, font: { size: 10 } }, title: { display: true, text: 'Opportunity Score' } }, y: { title: { display: true, text: 'HCP Count' } } });

    // Scatter Plot
    const ctx = document.getElementById('chart-opp-scatter'); if (!ctx) return;
    const chart = new Chart(ctx, {
      type: 'scatter', data: {
        datasets: [
          {
            label: 'Low/No Visits',
            data: nv,
            backgroundColor: RED + 'b5',
            pointRadius: 6,
            pointHoverRadius: 12,
            pointStyle: 'circle'
          },
          {
            label: 'Covered',
            data: cv,
            backgroundColor: CB + '95',
            pointRadius: 6,
            pointHoverRadius: 12,
            pointStyle: 'rect'
          }
        ]
      }, options: {
        maintainAspectRatio: false, responsive: true,
        plugins: {
          legend: { position: 'bottom' }, tooltip: {
            callbacks: {
              title: pts => { const p = pts[0]; return p.dataset.label + ' ID: ' + p.raw.id; },
              label: p => [`UC TRx: ${p.raw.uc.toFixed(4)}/wk`, `Score: ${p.raw.sc.toFixed(4)}`, p.raw.sp ? `Specialty: ${p.raw.sp}` : '']
            }
          }
        },
        scales: { x: { title: { display: true, text: 'UC TRx Mean (weekly)' }, grid: { color: '#f1f5f9' } }, y: { max: 1, title: { display: true, text: 'Opportunity Score' }, grid: { color: '#f1f5f9' } } },
        onClick: (evt, els) => {
          if (!els.length) return;
          const el = els[0], di = el.datasetIndex, idx = el.index;
          const hcp = chart.data.datasets[di].data[idx];
          const isCovered = (di === 1);
          window.selectHcpFromTable(hcp.id, hcp.uc, hcp.sc, hcp.sp, hcp.ap, isCovered);
        }
      }
    });
  });
}

/* ==================== TAB 7: SPECIALTY ==================== */
function buildSpecialtyStack() {
  const sp = ['GP/Family Med', 'Gastroenterology', 'Internal Med', 'Neuro/Rheum', 'Other Spec', 'Pharmacy'];
  mkHBar('chart-spec-stack', sp, [{ label: 'SEG_A', data: [25, 6256, 74, 13, 29, 9], backgroundColor: CA }, { label: 'SEG_B', data: [8, 3297, 13, 5, 23, 3], backgroundColor: CB }, { label: 'SEG_C', data: [2, 2127, 3, 3, 8, 1], backgroundColor: CC }], { x: { stacked: true } });
}
function buildSpecialtyPct() {
  const sp = ['GP/Family Med', 'Gastroenterology', 'Internal Med', 'Neuro/Rheum', 'Other Spec', 'Pharmacy'];
  const sa = [25, 6256, 74, 13, 29, 9], sb = [8, 3297, 13, 5, 23, 3], sc = [2, 2127, 3, 3, 8, 1];
  const pctA = sa.map((_, i) => { const t = sa[i] + sb[i] + sc[i]; return t ? +(sa[i] / t * 100).toFixed(1) : 0; });
  const pctB = sb.map((_, i) => { const t = sa[i] + sb[i] + sc[i]; return t ? +(sb[i] / t * 100).toFixed(1) : 0; });
  const pctC = sc.map((_, i) => { const t = sa[i] + sb[i] + sc[i]; return t ? +(sc[i] / t * 100).toFixed(1) : 0; });
  mkHBar('chart-spec-pct', sp, [{ label: 'SEG_A %', data: pctA, backgroundColor: CA }, { label: 'SEG_B %', data: pctB, backgroundColor: CB }, { label: 'SEG_C %', data: pctC, backgroundColor: CC }], { x: { stacked: true, max: 100 } });
}

/* ============================================================
   CLIENT-SIDE INFERENCE ENGINE (PYODIDE)
   Model: scikit-learn model loaded directly in browser
   ============================================================ */

let pyodideInstance = null;

async function runModelPrediction() {
  const resultDiv = document.getElementById('prediction-result');
  const predictBtn = document.getElementById('btn-predict');

  // Handle UI state for loading (disable button and show spinner)
  predictBtn.disabled = true;
  resultDiv.style.display = 'block';
  resultDiv.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Initializing Pyodide & loading model (may take a moment)...';

  try {
    // Initialize Pyodide
    if (!pyodideInstance) {
      pyodideInstance = await loadPyodide();
      // Load the scikit-learn and numpy packages into the browser memory
      await pyodideInstance.loadPackage(['scikit-learn', 'numpy']);
    }

    resultDiv.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading model and running inference...';

    const pythonCode = `
import pyodide.http
import numpy as np
import joblib
import sklearn

print(f"[diag] sklearn={sklearn.__version__}  numpy={np.__version__}  joblib={joblib.__version__}")

# Load the model from the same origin (no HF auth, no CORS, no gated-repo issues).
# This is the same artifact as best_binary_segA_vs_segBC.joblib on Hugging Face.
response = await pyodide.http.pyfetch("sklearn_model.joblib")
with open("sklearn_model.joblib", "wb") as f:
    f.write(await response.bytes())

model = joblib.load("sklearn_model.joblib")

# Tensor shape: (1, 5590) = 86 weeks * 65 features, flattened.
# Use small random values to simulate a real HCP rather than an all-zero edge case.
rng = np.random.default_rng(42)
sample = rng.normal(loc=0.0, scale=0.1, size=(1, 5590))

# model_metadata.json on HF specifies threshold = 0.45 for the SEG_B/C class.
proba_bc = float(model.predict_proba(sample)[0, 1])
threshold = 0.45
label = 1 if proba_bc >= threshold else 0

(label, proba_bc)
`;

    const result = await pyodideInstance.runPythonAsync(pythonCode);
    const [label, probaBc] = result.toJs();
    const pct = (probaBc * 100).toFixed(1);

    if (label === 1) {
      resultDiv.innerHTML = `<i class="fas fa-check-circle" style="color: var(--accent-green);"></i> SEG_B/C (High Potential) — p=${pct}%`;
    } else {
      resultDiv.innerHTML = `<i class="fas fa-circle" style="color: var(--text-muted);"></i> SEG_A (Traditionalist) — p(BC)=${pct}%`;
    }

  } catch (error) {
    console.error("Pyodide Client-Side ML Error:", error);
    resultDiv.innerHTML = `<i class="fas fa-exclamation-triangle" style="color: var(--accent-coral);"></i> Inference Error: ${error.message}`;
  } finally {
    // Re-enable the button
    predictBtn.disabled = false;
  }
}

/* Init */
document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  loadTab('tab-overview');
  animateCounters();

  // Pre-load opportunity counts to avoid showing 0 on UI load
  fetch('opportunity_data.json').then(r => r.json()).then(data => {
    const all = [...data.noVisits, ...data.covered];
    const t1List = all.filter(h => h.sc >= 0.60);
    const t2List = all.filter(h => h.sc >= 0.35 && h.sc < 0.60);
    const t3List = all.filter(h => h.sc < 0.35);

    const val1 = document.getElementById('tier-val-1');
    const val2 = document.getElementById('tier-val-2');
    const val3 = document.getElementById('tier-val-3');
    if (val1) val1.textContent = t1List.length;
    if (val2) val2.textContent = t2List.length;
    if (val3) val3.textContent = t3List.length;

    const noVisitsCount = data.noVisits.length;
    const coveredCount = data.covered.length;
    const totalCount = all.length;
    const pctNoVisits = ((noVisitsCount / totalCount) * 100).toFixed(1);

    const covGapText = document.getElementById('cov-gap-text');
    if (covGapText) {
      covGapText.innerHTML = `<strong>${noVisitsCount} of ${totalCount} unlabeled HCPs (${pctNoVisits}%)</strong>`;
    }
    const countNoVisits = document.getElementById('count-novisits');
    const countCovered = document.getElementById('count-covered');
    if (countNoVisits) countNoVisits.textContent = noVisitsCount;
    if (countCovered) countCovered.textContent = coveredCount;
  }).catch(err => console.error("Error loading initial opportunity statistics:", err));

  // Bind live prediction button
  const predictBtn = document.getElementById('btn-predict');
  if (predictBtn) {
    predictBtn.addEventListener('click', runModelPrediction);
  }
});