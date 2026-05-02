/* ============================================================
   HCP Segmentation Dashboard — Business Insights Engine
   ============================================================ */

Chart.defaults.color = '#8ba3c7';
Chart.defaults.borderColor = 'rgba(0,163,224,0.06)';
Chart.defaults.font.family = "'Inter', sans-serif";
Chart.defaults.font.size = 12;
Chart.defaults.plugins.legend.labels.usePointStyle = true;
Chart.defaults.plugins.legend.labels.pointStyle = 'circle';
Chart.defaults.plugins.legend.labels.padding = 16;
Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(4,8,26,0.95)';
Chart.defaults.plugins.tooltip.padding = 12;
Chart.defaults.plugins.tooltip.cornerRadius = 8;
Chart.defaults.plugins.tooltip.borderColor = 'rgba(0,163,224,0.15)';
Chart.defaults.plugins.tooltip.borderWidth = 1;

/* ---- Simulated weekly data for HCP personas ---- */
function generateTimeline(base, trend, noise, weeks) {
  const data = [];
  for (let i = 0; i < weeks; i++) {
    data.push(Math.max(0, base + trend * i + (Math.random() - 0.5) * noise));
  }
  return data.map(v => Math.round(v * 10) / 10);
}

const WEEKS = 20;
const weekLabels = Array.from({ length: WEEKS }, (_, i) => `W${(i + 1) * 4}`);

const PERSONAS = {
  drLopez: {
    name: 'Dr. María López',
    segment: 'SEG_A',
    trx: generateTimeline(12, 0, 3, WEEKS),
    engagement: generateTimeline(2, 0.02, 1.5, WEEKS),
    detailing: generateTimeline(1, 0, 0.8, WEEKS)
  },
  drChen: {
    name: 'Dr. James Chen',
    segment: 'SEG_B',
    trx: generateTimeline(8, 0.4, 4, WEEKS),
    engagement: generateTimeline(5, 0.3, 2, WEEKS),
    detailing: generateTimeline(3, 0.2, 1.5, WEEKS)
  },
  drWilliams: {
    name: 'Dr. Sarah Williams',
    segment: 'SEG_C',
    trx: generateTimeline(5, 0.15, 3, WEEKS),
    engagement: generateTimeline(3, 0.1, 2.5, WEEKS),
    detailing: generateTimeline(2, 0.08, 1.2, WEEKS)
  }
};

function initCharts() {
  createClassDoughnut();
  createEngagementFunnel();
  createPersonaChart('chart-persona-a', PERSONAS.drLopez, '#0051a5');
  createPersonaChart('chart-persona-b', PERSONAS.drChen, '#00a3e0');
  createPersonaChart('chart-persona-c', PERSONAS.drWilliams, '#54c8e8');
  createMarketingROI();
  createPSIChart();
  createConversionChart();
}

function createClassDoughnut() {
  const ctx = document.getElementById('chart-class-doughnut');
  if (!ctx) return;
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['SEG_A · Traditional', 'SEG_B · Relationship', 'SEG_C · Didactic'],
      datasets: [{
        data: [6406, 3349, 2144],
        backgroundColor: ['#0051a5', '#00a3e0', '#54c8e8'],
        borderColor: 'rgba(4,8,26,0.8)', borderWidth: 3, hoverOffset: 8
      }]
    },
    options: {
      cutout: '68%', responsive: true, maintainAspectRatio: true,
      plugins: {
        legend: { position: 'bottom', labels: { padding: 20, font: { size: 11 } } },
        tooltip: { callbacks: { label: c => `${c.label}: ${c.raw.toLocaleString()} HCPs (${(c.raw / 11899 * 100).toFixed(1)}%)` } }
      }
    }
  });
}

function createEngagementFunnel() {
  const ctx = document.getElementById('chart-engagement');
  if (!ctx) return;
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Total HCPs', 'Labeled', 'High Engagement\n(SEG_B)', 'Convertible\n(SEG_C→B)', 'Elite Targets'],
      datasets: [{
        label: 'HCP Count',
        data: [20931, 11899, 3349, 1500, 650],
        backgroundColor: ['rgba(0,81,165,0.5)', 'rgba(0,81,165,0.6)', 'rgba(0,163,224,0.7)', 'rgba(84,200,232,0.7)', 'rgba(16,185,129,0.7)'],
        borderColor: ['#0051a5', '#0051a5', '#00a3e0', '#54c8e8', '#10b981'],
        borderWidth: 1, borderRadius: 8, borderSkipped: false
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: true,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, grid: { color: 'rgba(0,163,224,0.04)' } },
        x: { grid: { display: false }, ticks: { font: { size: 10 } } }
      }
    }
  });
}

function createPersonaChart(canvasId, persona, color) {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return;
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: weekLabels,
      datasets: [
        {
          label: 'UC TRx',
          data: persona.trx,
          borderColor: color, backgroundColor: color + '15',
          fill: true, tension: 0.4, borderWidth: 2,
          pointRadius: 2, pointHoverRadius: 5
        },
        {
          label: 'Marketing Engagement',
          data: persona.engagement,
          borderColor: '#f59e0b', backgroundColor: 'transparent',
          borderDash: [4, 3], tension: 0.4, borderWidth: 2,
          pointRadius: 2, pointHoverRadius: 5
        }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: true,
      plugins: { legend: { position: 'top', labels: { font: { size: 10 } } } },
      scales: {
        y: { beginAtZero: true, grid: { color: 'rgba(0,163,224,0.04)' }, ticks: { font: { size: 10 } } },
        x: { grid: { display: false }, ticks: { font: { size: 9 }, maxTicksLimit: 10 } }
      }
    }
  });
}

function createMarketingROI() {
  const ctx = document.getElementById('chart-marketing-roi');
  if (!ctx) return;
  new Chart(ctx, {
    type: 'radar',
    data: {
      labels: ['Detail Response', 'Mail Response', 'Rx Growth', 'New Rx Adoption', 'Visit Frequency', 'Oral ATx Interest'],
      datasets: [
        { label: 'SEG_A', data: [20, 15, 10, 8, 25, 12], borderColor: '#0051a5', backgroundColor: 'rgba(0,81,165,0.06)', borderWidth: 2, pointBackgroundColor: '#0051a5' },
        { label: 'SEG_B', data: [85, 78, 72, 80, 90, 88], borderColor: '#00a3e0', backgroundColor: 'rgba(0,163,224,0.06)', borderWidth: 2, pointBackgroundColor: '#00a3e0' },
        { label: 'SEG_C', data: [45, 50, 35, 40, 55, 42], borderColor: '#54c8e8', backgroundColor: 'rgba(84,200,232,0.06)', borderWidth: 2, pointBackgroundColor: '#54c8e8' }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: true,
      scales: { r: { beginAtZero: true, max: 100, grid: { color: 'rgba(0,163,224,0.06)' }, angleLines: { color: 'rgba(0,163,224,0.06)' }, pointLabels: { font: { size: 10 }, color: '#8ba3c7' }, ticks: { display: false } } },
      plugins: { legend: { position: 'bottom' } }
    }
  });
}

function createPSIChart() {
  const ctx = document.getElementById('chart-psi');
  if (!ctx) return;
  const psi = [
    { f: 'UC_TRX (Prescriptions)', v: 0.38 },
    { f: 'UC_NRX (New Rx)', v: 0.32 },
    { f: 'DIRECTMAIL', v: 0.29 },
    { f: 'DETAILS (Rep Visits)', v: 0.27 },
    { f: 'Demographics', v: 0.15 },
    { f: 'Temporal Aggregates', v: 0.07 }
  ];
  const colors = psi.map(d => d.v > 0.25 ? '#f43f5e' : d.v > 0.10 ? '#f59e0b' : '#10b981');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: psi.map(d => d.f),
      datasets: [{ data: psi.map(d => d.v), backgroundColor: colors.map(c => c + 'aa'), borderColor: colors, borderWidth: 1, borderRadius: 6, borderSkipped: false }]
    },
    options: {
      responsive: true, maintainAspectRatio: true, indexAxis: 'y',
      plugins: { legend: { display: false } },
      scales: {
        x: { beginAtZero: true, max: 0.5, grid: { color: 'rgba(0,163,224,0.04)' } },
        y: { grid: { display: false }, ticks: { font: { size: 11 } } }
      }
    }
  });
}

function createConversionChart() {
  const ctx = document.getElementById('chart-conversion');
  if (!ctx) return;
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['SEG_A→B Potential', 'SEG_C→B Potential', 'Already SEG_B'],
      datasets: [{
        data: [640, 1500, 3349],
        backgroundColor: ['rgba(0,81,165,0.5)', 'rgba(84,200,232,0.7)', 'rgba(0,163,224,0.7)'],
        borderColor: ['#0051a5', '#54c8e8', '#00a3e0'],
        borderWidth: 1, borderRadius: 8, borderSkipped: false
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: true, indexAxis: 'y',
      plugins: { legend: { display: false } },
      scales: {
        x: { beginAtZero: true, grid: { color: 'rgba(0,163,224,0.04)' } },
        y: { grid: { display: false } }
      }
    }
  });
}

/* Navigation */
function initNavigation() {
  const sections = document.querySelectorAll('.dashboard-section');
  const navItems = document.querySelectorAll('.nav-item[data-section]');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navItems.forEach(n => n.classList.remove('active'));
        const t = document.querySelector(`.nav-item[data-section="${entry.target.id}"]`);
        if (t) t.classList.add('active');
      }
    });
  }, { rootMargin: '-20% 0px -70% 0px' });
  sections.forEach(s => observer.observe(s));
  navItems.forEach(item => {
    item.addEventListener('click', e => {
      e.preventDefault();
      const sec = document.getElementById(item.getAttribute('data-section'));
      if (sec) sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

function initScrollAnimations() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
  }, { threshold: 0.1 });
  document.querySelectorAll('.animate-in').forEach(el => observer.observe(el));
}

function animateCounters() {
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseInt(el.getAttribute('data-count'));
    const duration = 1500;
    const start = performance.now();
    const fmt = el.getAttribute('data-format');
    function update(now) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const current = Math.round(target * eased);
      el.textContent = fmt === 'comma' ? current.toLocaleString() : current;
      if (p < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  });
}

function animateMeters() {
  document.querySelectorAll('.segment-meter-fill').forEach(el => {
    const target = el.getAttribute('data-width');
    setTimeout(() => { el.style.width = target + '%'; }, 300);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initCharts();
  initNavigation();
  initScrollAnimations();
  animateCounters();
  animateMeters();
});
