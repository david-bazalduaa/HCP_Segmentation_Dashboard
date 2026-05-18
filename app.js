/* ============================================================
   HCP Segmentation Dashboard — Chart.js Unified Engine
   All data from hcp_analysis_clean.parquet (191 columns)
   ============================================================ */
Chart.defaults.color = '#64748b'; Chart.defaults.borderColor = '#e2e8f0'; Chart.defaults.font.family = "'Inter',sans-serif"; Chart.defaults.font.size = 13;
Chart.defaults.plugins.legend.labels.usePointStyle = true; Chart.defaults.plugins.legend.labels.pointStyle = 'circle'; Chart.defaults.plugins.legend.labels.padding = 20;
Chart.defaults.plugins.tooltip.backgroundColor = '#1e293b'; Chart.defaults.plugins.tooltip.padding = 14; Chart.defaults.plugins.tooltip.cornerRadius = 8;

const PB = '#0051a5', PL = '#00a3e0', PD = '#0d009d', PS = '#54c8e8';
const CA = '#6B7280', CB = '#1A6FD4', CC = '#D4720A', CU = '#7C3AED';
const GREEN = '#0D9E6E', RED = '#DC3545', AMBER = '#d97706';
const SEGS = ['SEG_A', 'SEG_B', 'SEG_C'];
const SEG_COLORS = [CA, CB, CC];

/* Simulated weekly persona data (illustrative timeline shapes) */
function gen(base, trend, noise, n) { const d = []; for (let i = 0; i < n; i++)d.push(Math.max(0, Math.round((base + trend * i + (Math.random() - 0.5) * noise) * 10) / 10)); return d; }
const W = 20, wk = Array.from({ length: W }, (_, i) => `W${(i + 1) * 4}`);
const P = { a: { trx: gen(12, 0, 1.5, W), eng: gen(2, 0.02, 0.5, W), nrx: gen(1, 0, 0.5, W) }, b: { trx: gen(8, 0.4, 2, W), eng: gen(5, 0.3, 1, W), nrx: gen(3, 0.25, 0.8, W) }, c: { trx: gen(5, 0.15, 1.5, W), eng: gen(3, 0.1, 1.2, W), nrx: gen(2, 0.08, 0.6, W) } };

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
  if (id === 'tab-competitive') { buildCompShare(); buildCompRatio(); buildScatterUC(); }
  if (id === 'tab-engagement') { buildEngagement(); buildScatterEng(); }
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

function createPersonaFull(id, data, color) { const ctx = document.getElementById(id); if (!ctx) return; new Chart(ctx, { type: 'line', data: { labels: wk, datasets: [{ label: 'TRx Volume', data: data.trx, borderColor: color, backgroundColor: color + '10', fill: true, tension: 0.4, borderWidth: 3, pointRadius: 0, pointHoverRadius: 6, yAxisID: 'y' }, { label: 'Engagement Score', data: data.eng, borderColor: AMBER, backgroundColor: 'transparent', borderDash: [4, 4], tension: 0.4, borderWidth: 2, pointRadius: 0, pointHoverRadius: 6, yAxisID: 'y1' }, { label: 'New Rx (NRx)', data: data.nrx, borderColor: GREEN, backgroundColor: 'transparent', tension: 0.4, borderWidth: 2, pointRadius: 0, pointHoverRadius: 6, yAxisID: 'y1' }] }, options: { responsive: true, maintainAspectRatio: false, interaction: { mode: 'index', intersect: false }, plugins: { legend: { position: 'top' }, tooltip: { mode: 'index' } }, scales: { y: { type: 'linear', display: true, position: 'left', beginAtZero: true, grid: { color: '#f1f5f9' }, title: { display: true, text: 'TRx / NRx Volume' } }, y1: { type: 'linear', display: true, position: 'right', beginAtZero: true, grid: { drawOnChartArea: false }, title: { display: true, text: 'Marketing Interactions' } }, x: { grid: { display: false }, ticks: { maxTicksLimit: 8 } } } } }); }

/* ==================== TAB 3: ADOPTION ==================== */
function buildAdoptionPct() { mkBar('chart-adoption-pct', SEGS, [{ label: 'Never Tried', data: [95.6, 88.6, 88.8], backgroundColor: RED, borderRadius: 4 }, { label: 'Active', data: [2.8, 7.7, 7.4], backgroundColor: GREEN, borderRadius: 4 }, { label: 'Lapsed', data: [1.6, 3.7, 3.8], backgroundColor: CC, borderRadius: 4 }], { extra: { plugins: { legend: { display: true, position: 'bottom' } } }, y: { stacked: true, max: 105 }, x: { stacked: true } }); }
function buildAdoptionAbs() { mkBar('chart-adoption-abs', SEGS, [{ label: 'Never Tried', data: [6124, 2967, 1903], backgroundColor: RED, borderRadius: 4 }, { label: 'Active', data: [181, 257, 159], backgroundColor: GREEN, borderRadius: 4 }, { label: 'Lapsed', data: [101, 125, 82], backgroundColor: CC, borderRadius: 4 }]); }
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

/* ==================== TAB 6: OPPORTUNITY ==================== */
function buildOpportunityCharts() {
  fetch('opportunity_data.json').then(r => r.json()).then(data => {
    // Add a tiny random jitter to the y-axis (Score) so overlapping points are visible
    // We keep the original 'uc' and 'sc' to show in tooltips
    const jitter = () => (Math.random() - 0.5) * 0.04;
    const nv = data.noVisits.map(h => ({ x: h.uc, y: Math.max(0, h.sc + jitter()), ...h }));
    const cv = data.covered.map(h => ({ x: h.uc, y: Math.max(0, h.sc + jitter()), ...h }));

    // Histogram
    const all = [...data.noVisits, ...data.covered];
    const scores = all.map(h => h.sc);
    const minSc = Math.min(...scores);
    const maxSc = Math.max(...scores);

    const numBins = 20;
    const binWidth = (maxSc > minSc) ? (maxSc - minSc) / numBins : 1;
    let edges = [];
    for (let i = 0; i <= numBins; i++) edges.push(minSc + i * binWidth);

    let bins = Array(numBins).fill(0);
    scores.forEach(s => {
      let b = Math.floor((s - minSc) / binWidth);
      if (b >= numBins) b = numBins - 1;
      bins[b]++;
    });

    const histLabels = edges.slice(0, -1).map((e, i) => ((e + edges[i + 1]) / 2).toFixed(2));
    mkBar('chart-opp-hist', histLabels, [{ data: bins, backgroundColor: CU + 'cc', borderRadius: 2, borderSkipped: false }], { plugins: { legend: { display: false } }, x: { ticks: { maxTicksLimit: 10, font: { size: 10 } } } });

    // Scatter Plot
    const ctx = document.getElementById('chart-opp-scatter'); if (!ctx) return;
    const chart = new Chart(ctx, {
      type: 'scatter', data: {
        datasets: [
          { label: 'No Rep Visits', data: nv, backgroundColor: RED + 'aa', pointRadius: 4, pointStyle: 'circle' },
          { label: 'Covered', data: cv, backgroundColor: CB + '88', pointRadius: 4, pointStyle: 'rect' }
        ]
      }, options: {
        maintainAspectRatio: false, responsive: true,
        plugins: {
          legend: { position: 'bottom' }, tooltip: {
            callbacks: {
              title: pts => { const p = pts[0]; return p.datasetIndex === 0 ? 'ID: ' + p.raw.id : 'Covered HCP'; },
              label: p => [`UC TRx: ${p.raw.uc.toFixed(4)}/wk`, `Score: ${p.raw.sc.toFixed(4)}`, p.raw.sp ? `Specialty: ${p.raw.sp}` : '']
            }
          }
        },
        scales: { x: { title: { display: true, text: 'UC TRx Mean (weekly)' }, grid: { color: '#f1f5f9' } }, y: { title: { display: true, text: 'Opportunity Score' }, grid: { color: '#f1f5f9' } } },
        onClick: (evt, els) => {
          if (!els.length) return;
          const el = els[0], di = el.datasetIndex, idx = el.index;
          if (di !== 0) return;
          const hcp = chart.data.datasets[0].data[idx];
          const panel = document.getElementById('hcp-detail-panel');
          document.getElementById('hcp-detail-title').textContent = 'NUEVO_ID: ' + hcp.id;
          document.getElementById('hcp-detail-grid').innerHTML =
            `<div class="card kpi-card"><div class="kpi-label">HCP ID</div><div class="kpi-value" style="font-size:22px;color:${RED}">${hcp.id}</div></div>` +
            `<div class="card kpi-card"><div class="kpi-label">Specialty</div><div class="kpi-value" style="font-size:16px">${hcp.sp}</div></div>` +
            `<div class="card kpi-card"><div class="kpi-label">UC TRx / Week</div><div class="kpi-value" style="font-size:22px">${hcp.uc.toFixed(4)}</div></div>` +
            `<div class="card kpi-card"><div class="kpi-label">Opportunity Score</div><div class="kpi-value" style="font-size:22px;color:${CU}">${hcp.sc.toFixed(4)}</div></div>` +
            `<div class="card kpi-card"><div class="kpi-label">Active Weeks</div><div class="kpi-value" style="font-size:22px">${hcp.ap}%</div></div>`;
          panel.style.display = 'block';
          panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
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

    resultDiv.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Downloading model and running inference...';

    // Use Python code (executed via JavaScript) to download the model directly from this URL
    const pythonCode = `
import urllib.request
import numpy as np
import joblib

url = "https://huggingface.co/pfizer-project-team/binary-segA-vs-segBC/resolve/main/sklearn_model.joblib"
# Download the model directly from the URL
urllib.request.urlretrieve(url, "sklearn_model.joblib")

# Load the scikit-learn model
model = joblib.load("sklearn_model.joblib")

# The model expects a flattened tensor of exactly 5590 features (86 weeks * 65 features)
# Create a dummy numpy array of shape (1, 5590) of zeros for the prediction
dummy_features = np.zeros((1, 5590))

# Run the prediction using model.predict()
prediction = model.predict(dummy_features)
int(prediction[0])
`;

    // Execute python code and wait for result
    const result = await pyodideInstance.runPythonAsync(pythonCode);

    // Return the result to JS and update UI
    if (result === 1) {
      resultDiv.innerHTML = '<i class="fas fa-check-circle" style="color: var(--accent-green);"></i> SEG_B/C (High Potential)';
    } else {
      resultDiv.innerHTML = '<i class="fas fa-circle" style="color: var(--text-muted);"></i> SEG_A (Traditionalist)';
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
  
  // Bind live prediction button
  const predictBtn = document.getElementById('btn-predict');
  if (predictBtn) {
    predictBtn.addEventListener('click', runModelPrediction);
  }
});