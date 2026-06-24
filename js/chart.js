/* =============================================
   CHART.JS — Simple Canvas Charts (no library)
   SiFas / Campus Fix
   ============================================= */

function drawDonut(canvasId, data, colors) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const r = 70;
  const ir = 42; // inner radius
  const total = data.reduce((s, d) => s + d.value, 0);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (total === 0) {
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = '#E2E8F0';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx, cy, ir, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();
    return;
  }

  let startAngle = -Math.PI / 2;

  data.forEach((item, i) => {
    const slice = (item.value / total) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, startAngle, startAngle + slice);
    ctx.closePath();
    ctx.fillStyle = colors[i];
    ctx.fill();
    startAngle += slice;
  });

  // Inner circle (donut hole)
  ctx.beginPath();
  ctx.arc(cx, cy, ir, 0, Math.PI * 2);
  ctx.fillStyle = '#fff';
  ctx.fill();

  // Center text
  ctx.fillStyle = '#1E293B';
  ctx.font = 'bold 22px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(total, cx, cy - 6);
  ctx.fillStyle = '#94A3B8';
  ctx.font = '10px Inter, sans-serif';
  ctx.fillText('LAPORAN', cx, cy + 10);
}

function drawBar(canvasId, labels, values) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.parentElement.clientWidth || 600;
  canvas.width = W;

  ctx.clearRect(0, 0, W, canvas.height);

  const padL = 40, padR = 20, padT = 20, padB = 30;
  const chartW = W - padL - padR;
  const chartH = canvas.height - padT - padB;
  const maxVal = Math.max(...values, 1);
  const barW = (chartW / values.length) * 0.55;
  const gap  = (chartW / values.length) * 0.45;

  // Grid lines
  const gridLines = 5;
  ctx.strokeStyle = '#E2E8F0';
  ctx.lineWidth = 1;
  for (let i = 0; i <= gridLines; i++) {
    const y = padT + (chartH / gridLines) * i;
    ctx.beginPath();
    ctx.moveTo(padL, y);
    ctx.lineTo(W - padR, y);
    ctx.stroke();

    const label = Math.round(maxVal - (maxVal / gridLines) * i);
    ctx.fillStyle = '#94A3B8';
    ctx.font = '10px Inter, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(label, padL - 6, y + 3);
  }

  // Bars
  values.forEach((val, i) => {
    const barH = (val / maxVal) * chartH;
    const x = padL + i * (barW + gap) + gap / 2;
    const y = padT + chartH - barH;

    // Gradient
    const grad = ctx.createLinearGradient(0, y, 0, y + barH);
    grad.addColorStop(0, '#2A56A4');
    grad.addColorStop(1, '#1B3A6B');
    ctx.fillStyle = grad;

    // Rounded top
    const rad = 4;
    ctx.beginPath();
    ctx.moveTo(x + rad, y);
    ctx.lineTo(x + barW - rad, y);
    ctx.quadraticCurveTo(x + barW, y, x + barW, y + rad);
    ctx.lineTo(x + barW, y + barH);
    ctx.lineTo(x, y + barH);
    ctx.lineTo(x, y + rad);
    ctx.quadraticCurveTo(x, y, x + rad, y);
    ctx.closePath();
    ctx.fill();

    // Value label
    ctx.fillStyle = '#1E293B';
    ctx.font = 'bold 11px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(val, x + barW / 2, y - 5);

    // Month label
    ctx.fillStyle = '#94A3B8';
    ctx.font = '11px Inter, sans-serif';
    ctx.fillText(labels[i], x + barW / 2, padT + chartH + 16);
  });
}

function renderCharts() {
  const counts = {
    Menunggu: LAPORAN_DATA.filter(l => l.status === 'Menunggu').length,
    Diproses: LAPORAN_DATA.filter(l => l.status === 'Diproses').length,
    Selesai:  LAPORAN_DATA.filter(l => l.status === 'Selesai').length,
    Ditolak:  LAPORAN_DATA.filter(l => l.status === 'Ditolak').length
  };

  const donutData = [
    { label: 'Menunggu', value: counts.Menunggu },
    { label: 'Diproses', value: counts.Diproses },
    { label: 'Selesai',  value: counts.Selesai  },
    { label: 'Ditolak',  value: counts.Ditolak  }
  ];
  const donutColors = ['#D97706', '#0891B2', '#16A34A', '#DC2626'];

  drawDonut('donutChart', donutData, donutColors);

  // Legend
  const legendEl = document.getElementById('donutLegend');
  if (legendEl) {
    legendEl.innerHTML = donutData.map((d, i) => `
      <div class="legend-item">
        <span class="legend-dot" style="background:${donutColors[i]}"></span>
        <span>${d.label}</span>
        <span class="legend-count" style="margin-left:auto">${d.value}</span>
      </div>
    `).join('');
  }

  // Bar chart — monthly trend
  const months  = ['Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  const monthly = [8, 12, 10, 15, 18, LAPORAN_DATA.length];
  drawBar('barChart', months, monthly);
}