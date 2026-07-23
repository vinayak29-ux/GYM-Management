// GymFlow - Chart.js wrappers.
(function () {
  const { monthlySeries, monthlyTotals } = window.GymFlow;

  const COLORS = {
    ink: '#172033',
    teal: '#0F766E',
    blue: '#2563EB',
    amber: '#D97706',
    rose: '#E11D48',
    green: '#16A34A',
    purple: '#9333EA',
    slate: '#94A3B8',
    grid: '#E8EDF3',
  };

  function baseOptions() {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            boxWidth: 10,
            boxHeight: 10,
            color: '#526071',
            font: { family: 'Inter', size: 12, weight: '600' },
            usePointStyle: true,
          },
        },
        tooltip: {
          backgroundColor: '#172033',
          borderColor: 'rgba(255,255,255,.12)',
          borderWidth: 1,
          cornerRadius: 8,
          padding: 10,
          titleFont: { family: 'Inter', size: 12, weight: '700' },
          bodyFont: { family: 'Inter', size: 12 },
        },
      },
    };
  }

  function moneyTick(value) {
    const n = Number(value || 0);
    if (Math.abs(n) >= 100000) return `Rs ${(n / 100000).toFixed(1)}L`;
    if (Math.abs(n) >= 1000) return `Rs ${(n / 1000).toFixed(0)}K`;
    return `Rs ${n}`;
  }

  function pnl(canvas, data) {
    if (!canvas || !window.Chart) return null;
    const series = monthlySeries(data, 6);
    return new Chart(canvas.getContext('2d'), {
      type: 'bar',
      data: {
        labels: series.map((row) => row.label),
        datasets: [
          { label: 'Income', data: series.map((row) => row.revenue), backgroundColor: COLORS.blue, borderRadius: 6, barThickness: 18 },
          { label: 'Expenses', data: series.map((row) => row.expensesTotal), backgroundColor: COLORS.rose, borderRadius: 6, barThickness: 18 },
          { label: 'Profit', data: series.map((row) => row.profit), type: 'line', borderColor: COLORS.green, backgroundColor: COLORS.green, tension: 0.35, pointRadius: 4, pointHoverRadius: 6 },
        ],
      },
      options: {
        ...baseOptions(),
        scales: {
          x: { grid: { display: false }, ticks: { color: '#6B7788', font: { family: 'Inter', size: 11 } } },
          y: { grid: { color: COLORS.grid }, ticks: { color: '#6B7788', callback: moneyTick, font: { family: 'Inter', size: 11 } } },
        },
      },
    });
  }

  function memberStatus(canvas, data) {
    if (!canvas || !window.Chart) return null;
    const totals = monthlyTotals(data);
    const active = Math.max(totals.active - totals.expiring, 0);
    return new Chart(canvas.getContext('2d'), {
      type: 'doughnut',
      data: {
        labels: ['Active', 'Expiring', 'Expired', 'Archived'],
        datasets: [{
          data: [active, totals.expiring, totals.expired, totals.archived],
          backgroundColor: [COLORS.teal, COLORS.amber, COLORS.rose, COLORS.slate],
          borderWidth: 3,
          borderColor: '#FFFFFF',
          hoverOffset: 6,
        }],
      },
      options: {
        ...baseOptions(),
        cutout: '68%',
      },
    });
  }

  function expensesCategory(canvas, data) {
    if (!canvas || !window.Chart) return null;
    const totals = {};
    data.expenses.forEach((expense) => {
      totals[expense.category] = (totals[expense.category] || 0) + Number(expense.amount || 0);
    });
    const labels = Object.keys(totals);
    const values = labels.map((label) => totals[label]);
    return new Chart(canvas.getContext('2d'), {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{
          data: values,
          backgroundColor: [COLORS.teal, COLORS.purple, COLORS.blue, COLORS.amber, COLORS.green, COLORS.rose],
          borderWidth: 3,
          borderColor: '#FFFFFF',
          hoverOffset: 6,
        }],
      },
      options: {
        ...baseOptions(),
        cutout: '64%',
      },
    });
  }

  window.GymCharts = {
    COLORS,
    expensesCategory,
    memberStatus,
    pnl,
  };
})();
