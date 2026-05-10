/* HCP Segmentation Dashboard V2 — Merged Engine (Chart.js + Plotly) */
Chart.defaults.color='#64748b';Chart.defaults.borderColor='#e2e8f0';Chart.defaults.font.family="'Inter',sans-serif";Chart.defaults.font.size=13;Chart.defaults.plugins.legend.labels.usePointStyle=true;Chart.defaults.plugins.legend.labels.pointStyle='circle';Chart.defaults.plugins.legend.labels.padding=20;Chart.defaults.plugins.tooltip.backgroundColor='#1e293b';Chart.defaults.plugins.tooltip.padding=14;Chart.defaults.plugins.tooltip.cornerRadius=8;

const C={A:'#6B7280',B:'#1A6FD4',C:'#D4720A',U:'#7C3AED',pos:'#0D9E6E',neg:'#DC3545'};
const SEGS=['SEG_A','SEG_B','SEG_C'];
const PB='#0051a5',PL='#00a3e0',PD='#0d009d',PS='#54c8e8';
const LY={font:{family:'Inter,sans-serif',size:12},paper_bgcolor:'transparent',plot_bgcolor:'transparent',margin:{l:50,r:20,t:10,b:50},legend:{orientation:'h',y:-0.2,x:0.5,xanchor:'center'}};
function L(o){return Object.assign({},LY,o);}

/* Simulated weekly persona data */
function gen(base,trend,noise,n){const d=[];for(let i=0;i<n;i++)d.push(Math.max(0,Math.round((base+trend*i+(Math.random()-0.5)*noise)*10)/10));return d;}
const W=20,wk=Array.from({length:W},(_,i)=>`W${(i+1)*4}`);
const P={a:{trx:gen(12,0,1.5,W),eng:gen(2,0.02,0.5,W),nrx:gen(1,0,0.5,W)},b:{trx:gen(8,0.4,2,W),eng:gen(5,0.3,1,W),nrx:gen(3,0.25,0.8,W)},c:{trx:gen(5,0.15,1.5,W),eng:gen(3,0.1,1.2,W),nrx:gen(2,0.08,0.6,W)}};

/* Tab System */
function initTabs(){
  document.querySelectorAll('.tab-btn').forEach(btn=>{btn.addEventListener('click',()=>{document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));document.querySelectorAll('.tab-content').forEach(c=>c.classList.remove('active'));btn.classList.add('active');const p=document.getElementById(btn.dataset.tab);if(p){p.classList.add('active');if(!p.dataset.loaded){loadTab(btn.dataset.tab);p.dataset.loaded='1';}}});});
  document.querySelectorAll('.sub-tab').forEach(btn=>{btn.addEventListener('click',()=>{const g=btn.closest('.sub-tabs'),ct=btn.closest('.tab-content')||document;g.querySelectorAll('.sub-tab').forEach(b=>b.classList.remove('active'));ct.querySelectorAll('.sub-panel').forEach(p=>p.classList.remove('active'));btn.classList.add('active');const p=ct.querySelector(`#${btn.dataset.subtab}`);if(p)p.classList.add('active');});});
}
function loadTab(id){
  if(id==='tab-overview'){createDoughnut();createFunnel();buildHeatmap();}
  if(id==='tab-segments'){buildSegments();buildMedMix();createPersonaFull('chart-pb-main',P.b,PL);createPersonaFull('chart-pc-main',P.c,PD);createPersonaFull('chart-pa-main',P.a,PB);}
  if(id==='tab-adoption')buildAdoption();
  if(id==='tab-competitive')buildCompetitive();
  if(id==='tab-engagement')buildEngagement();
  if(id==='tab-opportunity')buildOpportunity();
  if(id==='tab-specialty')buildSpecialty();
  if(id==='tab-drift')buildDrift();
}

/* Counters */
function animateCounters(){document.querySelectorAll('[data-count]').forEach(el=>{const t=parseFloat(el.dataset.count),sf=el.dataset.suffix||'',dur=1200,st=performance.now();(function u(now){const p=Math.min((now-st)/dur,1),v=t*(1-Math.pow(1-p,3));el.textContent=(el.dataset.count.includes('.')?v.toFixed(1):Math.round(v).toLocaleString())+sf;if(p<1)requestAnimationFrame(u);})(st);});}

/* ---- CHART.JS: Original V1 Charts ---- */
function createDoughnut(){const ctx=document.getElementById('chart-doughnut');if(!ctx)return;new Chart(ctx,{type:'doughnut',data:{labels:['SEG_A (Traditional)','SEG_B (Relationship)','SEG_C (Didactic)'],datasets:[{data:[6406,3349,2144],backgroundColor:[PB,PL,PD],borderColor:'#ffffff',borderWidth:4,hoverOffset:8}]},options:{maintainAspectRatio:false,cutout:'70%',responsive:true,plugins:{legend:{position:'bottom'},tooltip:{callbacks:{label:c=>`${c.label}: ${c.raw.toLocaleString()} HCPs (${(c.raw/11899*100).toFixed(1)}%)`}}}}});}

function createFunnel(){const ctx=document.getElementById('chart-funnel');if(!ctx)return;new Chart(ctx,{type:'bar',data:{labels:['Total Market','Labeled','Unlabeled','SEG_A','SEG_B','SEG_C'],datasets:[{data:[20931,11899,9032,6406,3349,2144],backgroundColor:['#e2e8f0','#cbd5e1','#94a3b8',PB,PL,PD],borderRadius:6,borderSkipped:false}]},options:{maintainAspectRatio:false,responsive:true,plugins:{legend:{display:false}},scales:{y:{beginAtZero:true,grid:{color:'#f1f5f9'}},x:{grid:{display:false},ticks:{font:{size:11}}}}}});}

function createPersonaFull(id,data,color){const ctx=document.getElementById(id);if(!ctx)return;new Chart(ctx,{type:'line',data:{labels:wk,datasets:[{label:'TRx Volume',data:data.trx,borderColor:color,backgroundColor:color+'10',fill:true,tension:0.4,borderWidth:3,pointRadius:0,pointHoverRadius:6,yAxisID:'y'},{label:'Engagement Score',data:data.eng,borderColor:'#d97706',backgroundColor:'transparent',borderDash:[4,4],tension:0.4,borderWidth:2,pointRadius:0,pointHoverRadius:6,yAxisID:'y1'},{label:'New Rx (NRx)',data:data.nrx,borderColor:'#059669',backgroundColor:'transparent',tension:0.4,borderWidth:2,pointRadius:0,pointHoverRadius:6,yAxisID:'y1'}]},options:{responsive:true,maintainAspectRatio:false,interaction:{mode:'index',intersect:false},plugins:{legend:{position:'top'},tooltip:{mode:'index'}},scales:{y:{type:'linear',display:true,position:'left',beginAtZero:true,grid:{color:'#f1f5f9'},title:{display:true,text:'TRx / NRx Volume'}},y1:{type:'linear',display:true,position:'right',beginAtZero:true,grid:{drawOnChartArea:false},title:{display:true,text:'Marketing Interactions'}},x:{grid:{display:false},ticks:{maxTicksLimit:8}}}}});}

/* ---- PLOTLY: New V2 Charts ---- */
function buildHeatmap(){
  const feats=['UC TRx/wk','Pfizer TRx/wk','Pfizer Share','Trend Ratio','% Growing','Details/Rx','Biologic Loyalty','New Patient Orient.'];
  const raw=[[0.1713,0.0005,0.0036,0.0769,0.0379,0.9443,0.0705,0.4367],[0.5174,0.0018,0.0048,0.2058,0.0964,0.4359,0.0984,0.4296],[0.7111,0.0017,0.0031,0.1957,0.0924,0.3843,0.1129,0.4294]];
  const z=[];for(let f=0;f<8;f++){const v=[raw[0][f],raw[1][f],raw[2][f]],mn=Math.min(...v),rng=Math.max(...v)-mn||1;z.push(v.map(x=>(x-mn)/rng));}
  const text=raw[0].map((_,f)=>[raw[0][f].toFixed(4),raw[1][f].toFixed(4),raw[2][f].toFixed(4)]);
  Plotly.newPlot('plot-heatmap',[{type:'heatmap',z,x:SEGS,y:feats,colorscale:[[0,'#F4F3EE'],[0.5,'#F5C97A'],[1,'#1A6FD4']],zmin:0,zmax:1,text,texttemplate:'%{text}',textfont:{size:10},colorbar:{title:'Normalized',thickness:12}}],L({yaxis:{autorange:'reversed'},margin:{l:130,r:20,t:10,b:50}}),{responsive:true});
}

function buildSegments(){
  Plotly.newPlot('plot-segment-bars',[
    {type:'bar',name:'UC TRx/wk',x:SEGS,y:[0.1713,0.5174,0.7111],marker:{color:[C.A,C.B,C.C]},text:['0.171','0.517','0.711'],textposition:'outside',showlegend:false}
  ],L({yaxis:{title:'UC TRx / week'},showlegend:false}),{responsive:true});
}

function buildMedMix(){
  Plotly.newPlot('plot-med-mix',[
    {type:'bar',name:'Total UC TRx',x:SEGS,y:[0.1713,0.5174,0.7111],marker:{color:'#6B7A96'}},
    {type:'bar',name:'IL-23 Biologic',x:SEGS,y:[0.0127,0.0597,0.0941],marker:{color:C.C}},
    {type:'bar',name:'Oral TRx',x:SEGS,y:[0.0234,0.1257,0.1400],marker:{color:C.B}}
  ],L({barmode:'group',yaxis:{title:'Mean TRx / HCP / week'}}),{responsive:true});
}

function buildAdoption(){
  Plotly.newPlot('plot-adoption-pct',[
    {type:'bar',name:'Never Tried',x:SEGS,y:[95.6,88.6,88.8],marker:{color:C.neg},text:['95.6%','88.6%','88.8%'],textposition:'inside',insidetextfont:{color:'white'}},
    {type:'bar',name:'Active',x:SEGS,y:[2.8,7.7,7.4],marker:{color:C.pos},text:['2.8%','7.7%','7.4%'],textposition:'inside',insidetextfont:{color:'white'}},
    {type:'bar',name:'Lapsed',x:SEGS,y:[1.6,3.7,3.8],marker:{color:C.C},text:['1.6%','3.7%','3.8%'],textposition:'inside',insidetextfont:{color:'white'}}
  ],L({barmode:'stack',yaxis:{title:'% of Segment',range:[0,105]}}),{responsive:true});
  Plotly.newPlot('plot-adoption-abs',[
    {type:'bar',name:'Never Tried',x:SEGS,y:[6124,2967,1903],marker:{color:C.neg},text:['6,124','2,967','1,903'],textposition:'outside',textfont:{size:9}},
    {type:'bar',name:'Active',x:SEGS,y:[181,257,159],marker:{color:C.pos},text:['181','257','159'],textposition:'outside',textfont:{size:9}},
    {type:'bar',name:'Lapsed',x:SEGS,y:[101,125,82],marker:{color:C.C},text:['101','125','82'],textposition:'outside',textfont:{size:9}}
  ],L({barmode:'group',yaxis:{title:'HCP Count'}}),{responsive:true});
  Plotly.newPlot('plot-growth-signals',[
    {type:'bar',name:'SEG_A',x:['B1 Growing','New Adopter','Active 8wk'],y:[3.79,3.72,2.83],marker:{color:C.A},text:['3.79%','3.72%','2.83%'],textposition:'outside',textfont:{size:9}},
    {type:'bar',name:'SEG_B',x:['B1 Growing','New Adopter','Active 8wk'],y:[9.64,8.81,7.67],marker:{color:C.B},text:['9.64%','8.81%','7.67%'],textposition:'outside',textfont:{size:9}},
    {type:'bar',name:'SEG_C',x:['B1 Growing','New Adopter','Active 8wk'],y:[9.24,8.44,7.42],marker:{color:C.C},text:['9.24%','8.44%','7.42%'],textposition:'outside',textfont:{size:9}}
  ],L({barmode:'group',yaxis:{title:'% of Segment'}}),{responsive:true});
  Plotly.newPlot('plot-trend-bars',[
    {type:'bar',name:'86-Wk Avg',x:SEGS,y:[0.000504,0.001835,0.001720],marker:{color:[C.A,C.B,C.C],opacity:0.5}},
    {type:'bar',name:'Recent 8 Wks',x:SEGS,y:[0.001325,0.004195,0.004224],marker:{color:[C.A,C.B,C.C]}}
  ],L({barmode:'group',yaxis:{title:'Brand1 TRx / HCP / week'}}),{responsive:true});
}

function buildCompetitive(){
  Plotly.newPlot('plot-competitive-share',[
    {type:'bar',name:'Pfizer Share (%)',x:SEGS,y:[0.363,0.480,0.311],marker:{color:C.B},text:['0.363%','0.480%','0.311%'],textposition:'outside',textfont:{size:9}},
    {type:'bar',name:'Brand2 Share (%)',x:SEGS,y:[1.429,2.153,1.250],marker:{color:C.C},text:['1.429%','2.153%','1.250%'],textposition:'outside',textfont:{size:9}}
  ],L({barmode:'group',yaxis:{title:'% of UC TRx'}}),{responsive:true});
  Plotly.newPlot('plot-competitive-ratio',[{type:'bar',x:SEGS,y:[3.90,4.43,4.29],marker:{color:[C.A,C.B,C.C]},text:['3.90×','4.43×','4.29×'],textposition:'outside',textfont:{size:13}}],L({yaxis:{title:'Brand2/Pfizer'},showlegend:false}),{responsive:true});
  const mk=(n,seg,col,ub,sb)=>{const x=[],y=[];for(let i=0;i<n;i++){x.push(Math.max(0,ub+Math.random()*ub*3));y.push(Math.max(0,Math.min(0.15,sb+Math.random()*sb*4-sb*1.5)));}return{type:'scatter',mode:'markers',name:seg,x,y,marker:{color:col,size:4,opacity:0.4}};};
  Plotly.newPlot('plot-scatter-uc',[mk(600,'SEG_A',C.A,0.17,0.004),mk(400,'SEG_B',C.B,0.52,0.005),mk(300,'SEG_C',C.C,0.71,0.003)],L({xaxis:{title:'UC TRx Mean (weekly)'},yaxis:{title:'Pfizer Share of UC'},margin:{l:60,r:20,t:10,b:60}}),{responsive:true});
}

function buildEngagement(){
  Plotly.newPlot('plot-engagement',[
    {type:'bar',name:'Details/Rx',x:SEGS,y:[0.944,0.436,0.384],marker:{color:[C.A,C.B,C.C]},text:['0.94','0.44','0.38'],textposition:'outside',showlegend:false}
  ],L({yaxis:{title:'Details per Rx'},showlegend:false}),{responsive:true});
  const mk=(n,seg,col,db,bb)=>{const x=[],y=[];for(let i=0;i<n;i++){x.push(Math.max(0,db+Math.random()*db*3));y.push(Math.max(0,bb+Math.random()*bb*4-bb));}return{type:'scatter',mode:'markers',name:seg,x,y,marker:{color:col,size:4,opacity:0.4}};};
  Plotly.newPlot('plot-scatter-engagement',[mk(500,'SEG_A',C.A,5.28,0.0005),mk(350,'SEG_B',C.B,8.94,0.0018),mk(250,'SEG_C',C.C,8.71,0.0017)],L({xaxis:{title:'Total Rep Visits'},yaxis:{title:'Pfizer TRx/week'},margin:{l:60,r:20,t:10,b:60}}),{responsive:true});
}

function buildOpportunity(){
  const bins=[1750,20,31,30,27,47,295,308,514,1108,890,790,752,754,650,466,258,105,51,8,14,10,18,13,17,27,33,20,16,10];
  const edges=[];for(let i=0;i<=30;i++)edges.push(0.295+i*(0.941-0.295)/30);
  const mids=edges.slice(0,-1).map((e,i)=>(e+edges[i+1])/2);
  Plotly.newPlot('plot-opportunity-hist',[{type:'bar',x:mids,y:bins,marker:{color:C.U,opacity:0.8},width:mids.map(()=>(0.941-0.295)/30*0.9)}],L({xaxis:{title:'Opportunity Score'},yaxis:{title:'HCP Count'},showlegend:false}),{responsive:true});

  /* Load real data from JSON and build interactive scatter */
  fetch('opportunity_data.json').then(r=>r.json()).then(data=>{
    const nv=data.noVisits, cv=data.covered;
    Plotly.newPlot('plot-opportunity-scatter',[
      {type:'scatter',mode:'markers',name:'No Rep Visits',
       x:nv.map(h=>h.uc),y:nv.map(h=>h.sc),
       text:nv.map(h=>'ID: '+h.id),customdata:nv,
       marker:{color:C.neg,size:6,opacity:0.6,symbol:'circle',line:{width:0}},
       hovertemplate:'<b>%{text}</b><br>UC TRx: %{x:.3f}/wk<br>Score: %{y:.3f}<extra></extra>'},
      {type:'scatter',mode:'markers',name:'Covered',
       x:cv.map(h=>h.uc),y:cv.map(h=>h.sc),
       text:cv.map(h=>'ID: '+h.id),customdata:cv,
       marker:{color:C.B,size:6,opacity:0.5,symbol:'square',line:{width:0}},
       hovertemplate:'<b>%{text}</b><br>UC TRx: %{x:.3f}/wk<br>Score: %{y:.3f}<extra></extra>'}
    ],L({xaxis:{title:'UC TRx Mean (weekly)'},yaxis:{title:'Opportunity Score'},margin:{l:60,r:20,t:10,b:60}}),{responsive:true});

    /* Click handler — only red dots (curveNumber 0) reveal HCP detail */
    document.getElementById('plot-opportunity-scatter').on('plotly_click',function(ev){
      const pt=ev.points[0];
      if(pt.curveNumber!==0)return;
      const hcp=pt.customdata;
      if(!hcp)return;
      const panel=document.getElementById('hcp-detail-panel');
      document.getElementById('hcp-detail-title').textContent='NUEVO_ID: '+hcp.id;
      document.getElementById('hcp-detail-grid').innerHTML=`
        <div class="card kpi-card"><div class="kpi-label">HCP ID</div><div class="kpi-value" style="font-size:22px;color:var(--accent-coral)">${hcp.id}</div></div>
        <div class="card kpi-card"><div class="kpi-label">Specialty</div><div class="kpi-value" style="font-size:16px">${hcp.sp}</div></div>
        <div class="card kpi-card"><div class="kpi-label">UC TRx / Week</div><div class="kpi-value" style="font-size:22px">${hcp.uc.toFixed(4)}</div></div>
        <div class="card kpi-card"><div class="kpi-label">Opportunity Score</div><div class="kpi-value" style="font-size:22px;color:var(--seg-unlabeled)">${hcp.sc.toFixed(4)}</div></div>
        <div class="card kpi-card"><div class="kpi-label">Active Weeks</div><div class="kpi-value" style="font-size:22px">${hcp.ap}%</div></div>`;
      panel.style.display='block';
      panel.scrollIntoView({behavior:'smooth',block:'nearest'});
    });
  });
}

function buildSpecialty(){
  const sp=['GP/Family Med','Gastroenterology','Internal Medicine','Neuro/Rheum/Pulm','Other Spec','Pharmacy'];
  const sa=[25,6256,74,13,29,9],sb=[8,3297,13,5,23,3],sc=[2,2127,3,3,8,1];
  Plotly.newPlot('plot-specialty-stack',[
    {type:'bar',name:'SEG_A',y:sp,x:sa,orientation:'h',marker:{color:C.A}},
    {type:'bar',name:'SEG_B',y:sp,x:sb,orientation:'h',marker:{color:C.B}},
    {type:'bar',name:'SEG_C',y:sp,x:sc,orientation:'h',marker:{color:C.C}}
  ],L({barmode:'stack',xaxis:{title:'HCP Count'},margin:{l:130,r:20,t:10,b:50}}),{responsive:true});
  const tots=sp.map((_,i)=>sa[i]+sb[i]+sc[i]);
  const z=sp.map((_,i)=>{const t=tots[i]||1;return[sa[i]/t*100,sb[i]/t*100,sc[i]/t*100];});
  const txt=z.map(r=>r.map(v=>v.toFixed(0)+'%'));
  Plotly.newPlot('plot-specialty-heatmap',[{type:'heatmap',z,x:SEGS,y:sp,colorscale:[[0,'#F4F3EE'],[0.5,'#F5C97A'],[1,'#1A6FD4']],text:txt,texttemplate:'%{text}',textfont:{size:11},colorbar:{title:'%',thickness:12}}],L({yaxis:{autorange:'reversed'},margin:{l:130,r:20,t:10,b:50}}),{responsive:true});
}

function buildDrift(){
  const items=[{f:'Prescription Vol (TRx)',v:0.38},{f:'New Patient Starts',v:0.32},{f:'Marketing Engagement',v:0.29},{f:'Rep Visit Frequency',v:0.27},{f:'Geographic Shifts',v:0.15},{f:'Practice Type',v:0.07}];
  const colors=items.map(d=>d.v>0.25?'#DC3545':d.v>0.10?'#d97706':'#0D9E6E');
  Plotly.newPlot('plot-psi',[{type:'bar',y:items.map(d=>d.f),x:items.map(d=>d.v),orientation:'h',marker:{color:colors},text:items.map(d=>d.v.toFixed(2)),textposition:'outside'}],L({xaxis:{title:'PSI Score',range:[0,0.5]},yaxis:{autorange:'reversed'},showlegend:false,margin:{l:160,r:30,t:10,b:50}}),{responsive:true});
}

/* Init */
document.addEventListener('DOMContentLoaded',()=>{initTabs();loadTab('tab-overview');animateCounters();});
