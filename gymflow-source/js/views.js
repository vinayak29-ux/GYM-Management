// GymFlow - HTML views.
(function () {
  const {
    addDays,
    addMonths,
    daysUntil,
    fmtDate,
    fmtINR,
    getMember,
    getPlan,
    isActiveMember,
    isExpiringMember,
    memberState,
    monthKey,
    monthLabel,
    monthlySeries,
    monthlyTotals,
    todayISO,
  } = window.GymFlow;

  const ICONS = {
    dashboard: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="8" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="15" width="7" height="6" rx="1"/></svg>',
    members: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.8"/><path d="M16 3.2a4 4 0 0 1 0 7.6"/></svg>',
    plans: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 7h16"/><path d="M4 12h16"/><path d="M4 17h10"/><rect x="3" y="4" width="18" height="16" rx="3"/></svg>',
    payments: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/><path d="M7 15h3"/></svg>',
    expenses: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19V5a2 2 0 0 1 2-2h11l3 3v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z"/><path d="M9 9h6M9 13h6M9 17h3"/></svg>',
    analytics: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3v18h18"/><path d="m7 15 4-4 3 3 5-7"/></svg>',
    reports: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/><path d="M8 13h8M8 17h5"/></svg>',
    plus: '<svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg>',
    edit: '<svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>',
    renew: '<svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 0 1-15.3 6.4L3 16"/><path d="M3 21v-5h5"/><path d="M3 12A9 9 0 0 1 18.3 5.6L21 8"/><path d="M21 3v5h-5"/></svg>',
    archive: '<svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="4" rx="1"/><path d="M5 8v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8"/><path d="M10 12h4"/></svg>',
    whatsapp: '<svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.5 11.8a8.5 8.5 0 0 1-12.7 7.4L3 20.5l1.3-4.6A8.5 8.5 0 1 1 20.5 11.8Z"/><path d="M8.8 8.5c.2-.4.4-.4.7-.4h.5c.2 0 .4.1.5.4l.7 1.6c.1.3.1.5-.1.7l-.4.5c.6 1 1.3 1.7 2.4 2.2l.6-.4c.2-.2.5-.2.7-.1l1.5.7c.3.1.4.3.4.6v.4c0 .4-.2.7-.5.9-.6.3-1.6.3-3.1-.4-1.8-.8-3.5-2.4-4.4-4.2-.7-1.3-.7-2.2-.5-2.7Z"/></svg>',
    download: '<svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/></svg>',
    search: '<svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>',
    calendar: '<svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>',
    close: '<svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  };

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, (char) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    }[char]));
  }

  function initials(name) {
    return String(name || 'M').split(' ').filter(Boolean).map((part) => part[0]).slice(0, 2).join('').toUpperCase();
  }

  function memberBadge(member) {
    const state = memberState(member);
    const labels = {
      active: 'Active',
      expiring: 'Expiring',
      expired: 'Expired',
      archived: 'Archived',
    };
    return `<span class="badge status-${state}">${labels[state]}</span>`;
  }

  function paymentBadge(status) {
    const label = { paid: 'Paid', partial: 'Partial', pending: 'Pending' }[status] || status;
    return `<span class="badge pay-${status}">${label}</span>`;
  }

  function statCard(title, value, note, icon, tone = 'teal') {
    return `
      <article class="metric-card tone-${tone}">
        <div class="metric-icon">${icon}</div>
        <div>
          <p class="metric-label">${escapeHtml(title)}</p>
          <strong class="metric-value">${escapeHtml(value)}</strong>
          <span class="metric-note">${escapeHtml(note)}</span>
        </div>
      </article>
    `;
  }

  function planOptions(data, selectedId) {
    return data.plans.map((plan) => `
      <option value="${plan.id}" ${selectedId === plan.id ? 'selected' : ''}>
        ${escapeHtml(plan.name)} - ${fmtINR(plan.price)}
      </option>
    `).join('');
  }

  function memberOptions(data, selectedId) {
    return data.members
      .filter((member) => member.status !== 'archived')
      .map((member) => {
        const plan = getPlan(data, member.planId);
        const search = `${member.name} ${member.phone} ${member.email} ${plan.name}`.toLowerCase();
        return `<option value="${member.id}" data-search="${escapeHtml(search)}" ${selectedId === member.id ? 'selected' : ''}>${escapeHtml(member.name)} (${escapeHtml(member.phone)})</option>`;
      })
      .join('');
  }

  function actionButton(action, member, icon, title, label = '') {
    return `
      <button class="icon-button" type="button" data-action="${action}" data-member-id="${member.id}" title="${escapeHtml(title)}" aria-label="${escapeHtml(title)}">
        ${icon}${label ? `<span>${escapeHtml(label)}</span>` : ''}
      </button>
    `;
  }

  function navItems() {
    return [
      { hash: '#/dashboard', label: 'Dashboard', icon: ICONS.dashboard },
      { hash: '#/members', label: 'Members', icon: ICONS.members },
      { hash: '#/plans', label: 'Plans', icon: ICONS.plans },
      { hash: '#/payments', label: 'Payments', icon: ICONS.payments },
      { hash: '#/expenses', label: 'Expenses', icon: ICONS.expenses },
      { hash: '#/analytics', label: 'Analytics', icon: ICONS.analytics },
      { hash: '#/reports', label: 'Reports', icon: ICONS.reports },
    ];
  }

  function appShell(activeRoute, content, data) {
    const totals = monthlyTotals(data);
    return `
      <div class="app-shell">
        <aside class="sidebar">
          <div class="brand">
            <img src="assets/gymm.png" alt="GymFlow" class="brand-logo" />
            <div>
              <strong>GymFlow</strong>
              <span>${escapeHtml(data.gym.name)}</span>
            </div>
          </div>

          <nav class="nav-list">
            ${navItems().map((item) => `
              <button class="nav-item ${activeRoute === item.hash ? 'active' : ''}" data-nav="${item.hash}" type="button">
                ${item.icon}<span>${item.label}</span>
              </button>
            `).join('')}
          </nav>

          <div class="sidebar-summary">
            <span>This month</span>
            <strong>${fmtINR(totals.profit)}</strong>
            <small>${totals.profit >= 0 ? 'Profit' : 'Loss'} after ${fmtINR(totals.expensesTotal)} expenses</small>
          </div>
        </aside>

        <main class="main-panel">
          <header class="topbar">
            <div>
              <p class="eyebrow">${escapeHtml(monthLabel(monthKey()))}</p>
              <h1>${escapeHtml(data.gym.name)}</h1>
            </div>
            <div class="topbar-actions">
              <button class="btn btn-secondary" type="button" data-action="new-payment">${ICONS.payments} Record payment</button>
              <button class="btn btn-primary" type="button" data-action="new-member">${ICONS.plus} Add member</button>
            </div>
          </header>
          <section class="content-area">${content}</section>
        </main>
      </div>
    `;
  }

  function dashboardView(data) {
    const totals = monthlyTotals(data);
    const activeCount = data.members.filter(isActiveMember).length;
    const expiring = data.members.filter(isExpiringMember).sort((a, b) => daysUntil(a.endDate) - daysUntil(b.endDate));
    const dues = data.members
      .filter((member) => member.status !== 'archived' && Number(member.due || 0) > 0)
      .sort((a, b) => Number(b.due || 0) - Number(a.due || 0));

    return `
      <div class="page-heading">
        <div>
          <h2>Dashboard</h2>
          <p>Active members, renewals, revenue, expenses, and profit.</p>
        </div>
        <button class="btn btn-secondary" type="button" data-action="download-report">${ICONS.download} Download report</button>
      </div>

      <section class="metrics-grid">
        ${statCard('Active members', activeCount, `${totals.totalMembers} total records`, ICONS.members, 'teal')}
        ${statCard('Expiring soon', totals.expiring, 'Next 7 days', ICONS.calendar, 'amber')}
        ${statCard('Monthly revenue', fmtINR(totals.revenue), 'Payments received', ICONS.payments, 'blue')}
        ${statCard('Expenses', fmtINR(totals.expensesTotal), 'This month', ICONS.expenses, 'rose')}
        ${statCard(totals.profit >= 0 ? 'Profit' : 'Loss', fmtINR(totals.profit), totals.label, ICONS.analytics, totals.profit >= 0 ? 'green' : 'rose')}
      </section>

      <section class="dashboard-grid">
        <div class="panel span-8">
          <div class="panel-header">
            <div>
              <h3>Profit and loss</h3>
              <p>Automatic monthly calculation</p>
            </div>
          </div>
          <div class="chart-box"><canvas id="chart-dashboard-pnl"></canvas></div>
        </div>

        <div class="panel span-4">
          <div class="panel-header">
            <div>
              <h3>Expiring memberships</h3>
              <p>${expiring.length ? 'Send renewal reminders' : 'No renewals due soon'}</p>
            </div>
          </div>
          <div class="list-stack">
            ${expiring.length ? expiring.slice(0, 6).map((member) => `
              <div class="mini-row">
                <div>
                  <strong>${escapeHtml(member.name)}</strong>
                  <span>${fmtDate(member.endDate)} (${daysUntil(member.endDate)} days)</span>
                </div>
                ${actionButton('whatsapp-member', member, ICONS.whatsapp, 'Open WhatsApp reminder')}
              </div>
            `).join('') : '<div class="empty-state">No memberships expire in the next 7 days.</div>'}
          </div>
        </div>

        <div class="panel span-6">
          <div class="panel-header">
            <div>
              <h3>Pending dues</h3>
              <p>${fmtINR(totals.dues)} outstanding</p>
            </div>
            <button class="btn btn-secondary" type="button" data-action="new-payment">${ICONS.plus} Add payment</button>
          </div>
          <div class="table-wrap compact">
            <table class="tbl">
              <thead><tr><th>Member</th><th>Due</th><th>Renewal</th><th></th></tr></thead>
              <tbody>
                ${dues.length ? dues.slice(0, 6).map((member) => `
                  <tr>
                    <td>${escapeHtml(member.name)}</td>
                    <td class="font-semibold">${fmtINR(member.due)}</td>
                    <td>${fmtDate(member.endDate)}</td>
                    <td class="text-right">${actionButton('renew-member', member, ICONS.renew, 'Renew membership')}</td>
                  </tr>
                `).join('') : '<tr><td colspan="4" class="empty-cell">No pending dues.</td></tr>'}
              </tbody>
            </table>
          </div>
        </div>

        <div class="panel span-6">
          <div class="panel-header">
            <div>
              <h3>Recent payments</h3>
              <p>Latest member transactions</p>
            </div>
          </div>
          <div class="list-stack">
            ${data.payments.slice().sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5).map((payment) => {
      const member = getMember(data, payment.memberId);
      const plan = getPlan(data, payment.planId);
      return `
                <div class="mini-row">
                  <div>
                    <strong>${escapeHtml(member ? member.name : 'Unknown member')}</strong>
                    <span>${escapeHtml(plan.name)} - ${fmtDate(payment.date)}</span>
                  </div>
                  <strong>${fmtINR(payment.amount)}</strong>
                </div>
              `;
    }).join('')}
          </div>
        </div>
      </section>
    `;
  }

  function memberRows(data, members = data.members) {
    return members.map((member) => {
      const plan = getPlan(data, member.planId);
      const state = memberState(member);
      const search = `${member.name} ${member.phone} ${member.email} ${plan.name}`.toLowerCase();
      return `
        <tr data-member-row data-search="${escapeHtml(search)}" data-state="${state}" data-due="${Number(member.due || 0)}">
          <td>
            <div class="member-cell">
              <span class="avatar">${escapeHtml(initials(member.name))}</span>
              <div>
                <strong>${escapeHtml(member.name)}</strong>
                <span class="member-phone">${escapeHtml(member.phone)}</span>
              </div>
            </div>
          </td>
          <td>${escapeHtml(plan.name)}</td>
          <td>${fmtDate(member.endDate)}</td>
          <td>${fmtINR(member.due)}</td>
          <td>${memberBadge(member)}</td>
          <td class="actions-cell">
            ${actionButton('edit-member', member, ICONS.edit, 'Edit member')}
            ${actionButton('renew-member', member, ICONS.renew, 'Renew membership')}
            ${actionButton('whatsapp-member', member, ICONS.whatsapp, 'Open WhatsApp reminder')}
            ${actionButton('archive-member', member, ICONS.archive, member.status === 'archived' ? 'Restore member' : 'Archive member')}
          </td>
        </tr>
      `;
    }).join('');
  }

  function membersView(data) {
    return `
      <div class="page-heading">
        <div>
          <h2>Member Management</h2>
          <p>Add, edit, renew, search, and archive members.</p>
        </div>
        <button class="btn btn-primary" type="button" data-action="new-member">${ICONS.plus} Add member</button>
      </div>

      <div class="toolbar">
        <label class="search-box">
          ${ICONS.search}
          <input id="member-search" type="search" placeholder="Search members, phone, email, plan" />
        </label>
        <div class="filter-group" id="member-filters">
          <button class="filter-pill active" type="button" data-filter="all">All</button>
          <button class="filter-pill" type="button" data-filter="active">Active</button>
          <button class="filter-pill" type="button" data-filter="expiring">Expiring</button>
          <button class="filter-pill" type="button" data-filter="expired">Expired</button>
          <button class="filter-pill" type="button" data-filter="dues">Dues</button>
          <button class="filter-pill" type="button" data-filter="archived">Archived</button>
        </div>
      </div>

      <div class="panel">
        <div class="table-wrap">
          <table class="tbl">
            <thead>
              <tr><th>Member</th><th>Plan</th><th>Renewal date</th><th>Due</th><th>Status</th><th class="text-right">Actions</th></tr>
            </thead>
            <tbody id="members-tbody">${memberRows(data)}</tbody>
          </table>
          <div id="members-empty" class="empty-state hidden">No members match this search.</div>
        </div>
      </div>
    `;
  }

  function plansView(data) {
    return `
      <div class="page-heading">
        <div>
          <h2>Membership Plans</h2>
          <p>Monthly, quarterly, half-yearly, and yearly plans.</p>
        </div>
      </div>

      <section class="plan-grid">
        ${data.plans.map((plan) => {
      const members = data.members.filter((member) => member.planId === plan.id && member.status !== 'archived');
      const revenue = data.payments.filter((payment) => payment.planId === plan.id).reduce((total, payment) => total + Number(payment.amount || 0), 0);
      return `
            <article class="plan-card" style="--plan-color:${plan.color}">
              <div class="plan-band"></div>
              <div class="plan-card-body">
                <span>${plan.months} ${plan.months === 1 ? 'month' : 'months'}</span>
                <h3>${escapeHtml(plan.name)}</h3>
                <strong>${fmtINR(plan.price)}</strong>
                <div class="plan-stats">
                  <div><b>${members.length}</b><small>Active members</small></div>
                  <div><b>${fmtINR(revenue)}</b><small>Total revenue</small></div>
                </div>
              </div>
            </article>
          `;
    }).join('')}
      </section>
    `;
  }

  function paymentsView(data) {
    const totals = monthlyTotals(data);
    const pendingDues = data.members.filter((member) => member.status !== 'archived' && Number(member.due || 0) > 0);
    const payments = data.payments.slice().sort((a, b) => b.date.localeCompare(a.date));

    return `
      <div class="page-heading">
        <div>
          <h2>Payment Tracking</h2>
          <p>Record payments, renewal dates, and pending dues.</p>
        </div>
        <button class="btn btn-primary" type="button" data-action="new-payment">${ICONS.plus} Record payment</button>
      </div>

      <section class="metrics-grid three">
        ${statCard('Payments this month', fmtINR(totals.revenue), `${totals.payments.length} entries`, ICONS.payments, 'blue')}
        ${statCard('Pending dues', fmtINR(totals.dues), `${pendingDues.length} members`, ICONS.reports, 'amber')}
        ${statCard('Expiring soon', totals.expiring, 'Next 7 days', ICONS.calendar, 'teal')}
      </section>

      <div class="panel">
        <div class="table-wrap">
          <table class="tbl">
            <thead><tr><th>Date</th><th>Member</th><th>Plan</th><th>Renewal</th><th>Amount</th><th>Method</th><th>Status</th></tr></thead>
            <tbody>
              ${payments.map((payment) => {
      const member = getMember(data, payment.memberId);
      const plan = getPlan(data, payment.planId);
      return `
                  <tr>
                    <td>${fmtDate(payment.date)}</td>
                    <td>${escapeHtml(member ? member.name : 'Unknown member')}</td>
                    <td>${escapeHtml(plan.name)}</td>
                    <td>${fmtDate(payment.renewalFrom)} to ${fmtDate(payment.renewalTo)}</td>
                    <td class="font-semibold">${fmtINR(payment.amount)}</td>
                    <td>${escapeHtml(payment.method)}</td>
                    <td>${paymentBadge(payment.status)}</td>
                  </tr>
                `;
    }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  function expensesView(data) {
    const totals = monthlyTotals(data);
    const categories = ['Equipment', 'Maintenance', 'Rent', 'Electricity', 'Water', 'Miscellaneous'];
    const expenses = data.expenses.slice().sort((a, b) => b.date.localeCompare(a.date));

    return `
      <div class="page-heading">
        <div>
          <h2>Expense Management</h2>
          <p>Equipment, maintenance, rent, electricity, water, and miscellaneous expenses.</p>
        </div>
        <button class="btn btn-primary" type="button" data-action="new-expense">${ICONS.plus} Add expense</button>
      </div>

      <section class="metrics-grid three">
        ${statCard('This month', fmtINR(totals.expensesTotal), `${totals.expenses.length} expenses`, ICONS.expenses, 'rose')}
        ${statCard('Categories', categories.length, 'Standard expense heads', ICONS.plans, 'teal')}
        ${statCard('Profit impact', fmtINR(totals.profit), totals.profit >= 0 ? 'Current profit' : 'Current loss', ICONS.analytics, totals.profit >= 0 ? 'green' : 'rose')}
      </section>

      <section class="dashboard-grid">
        <div class="panel span-5">
          <div class="panel-header"><div><h3>Expense categories</h3><p>Current data split</p></div></div>
          <div class="chart-box small"><canvas id="chart-expenses-category"></canvas></div>
        </div>
        <div class="panel span-7">
          <div class="table-wrap compact">
            <table class="tbl">
              <thead><tr><th>Date</th><th>Category</th><th>Vendor</th><th>Note</th><th>Amount</th></tr></thead>
              <tbody>
                ${expenses.map((expense) => `
                  <tr>
                    <td>${fmtDate(expense.date)}</td>
                    <td><span class="badge neutral">${escapeHtml(expense.category)}</span></td>
                    <td>${escapeHtml(expense.vendor)}</td>
                    <td>${escapeHtml(expense.note)}</td>
                    <td class="font-semibold">${fmtINR(expense.amount)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    `;
  }

  function analyticsView(data) {
    const series = monthlySeries(data, 6);
    const current = monthlyTotals(data);

    return `
      <div class="page-heading">
        <div>
          <h2>Profit & Loss Analytics</h2>
          <p>Automatic monthly profit/loss calculation with charts.</p>
        </div>
      </div>

      <section class="metrics-grid three">
        ${statCard('Revenue', fmtINR(current.revenue), current.label, ICONS.payments, 'blue')}
        ${statCard('Expenses', fmtINR(current.expensesTotal), current.label, ICONS.expenses, 'rose')}
        ${statCard(current.profit >= 0 ? 'Net profit' : 'Net loss', fmtINR(current.profit), current.label, ICONS.analytics, current.profit >= 0 ? 'green' : 'rose')}
      </section>

      <section class="dashboard-grid">
        <div class="panel span-8">
          <div class="panel-header"><div><h3>Monthly trend</h3><p>Revenue, expenses, and profit</p></div></div>
          <div class="chart-box"><canvas id="chart-analytics-pnl"></canvas></div>
        </div>
        <div class="panel span-4">
          <div class="panel-header"><div><h3>Members</h3><p>Active, expiring, archived</p></div></div>
          <div class="chart-box small"><canvas id="chart-member-status"></canvas></div>
        </div>
      </section>

      <div class="panel">
        <div class="table-wrap compact">
          <table class="tbl">
            <thead><tr><th>Month</th><th>Income</th><th>Expenses</th><th>Profit / Loss</th><th>Active members</th><th>Dues</th></tr></thead>
            <tbody>
              ${series.map((row) => `
                <tr>
                  <td>${escapeHtml(row.label)}</td>
                  <td>${fmtINR(row.revenue)}</td>
                  <td>${fmtINR(row.expensesTotal)}</td>
                  <td class="${row.profit >= 0 ? 'text-green-700' : 'text-rose-700'} font-semibold">${fmtINR(row.profit)}</td>
                  <td>${row.active}</td>
                  <td>${fmtINR(row.dues)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  function reportMonthOptions() {
    const date = new Date(`${monthKey()}-01T00:00:00`);
    const options = [];
    for (let i = 0; i < 12; i += 1) {
      const d = new Date(date);
      d.setMonth(date.getMonth() - i);
      const key = d.toISOString().slice(0, 7);
      options.push(`<option value="${key}">${monthLabel(key)}</option>`);
    }
    return options.join('');
  }

  function reportsView(data) {
    const totals = monthlyTotals(data);
    return `
      <div class="page-heading">
        <div>
          <h2>Reports</h2>
          <p>Monthly income, expenses, profit, and member statistics.</p>
        </div>
        <div class="report-actions">
          <select class="input compact-input" id="report-month">${reportMonthOptions()}</select>
          <button class="btn btn-primary" type="button" data-action="download-report">${ICONS.download} Download report</button>
        </div>
      </div>

      <section class="metrics-grid">
        ${statCard('Income', fmtINR(totals.revenue), totals.label, ICONS.payments, 'blue')}
        ${statCard('Expenses', fmtINR(totals.expensesTotal), totals.label, ICONS.expenses, 'rose')}
        ${statCard('Profit', fmtINR(totals.profit), totals.label, ICONS.analytics, totals.profit >= 0 ? 'green' : 'rose')}
        ${statCard('Active members', totals.active, `${totals.expiring} expiring soon`, ICONS.members, 'teal')}
      </section>

      <div class="panel report-panel">
        <div class="report-tile">
          <h3>Download data</h3>
          <div class="download-grid">
            <button class="btn btn-secondary" type="button" data-action="download-members">${ICONS.download} Members CSV</button>
            <button class="btn btn-secondary" type="button" data-action="download-payments">${ICONS.download} Payments CSV</button>
            <button class="btn btn-secondary" type="button" data-action="download-expenses">${ICONS.download} Expenses CSV</button>
          </div>
        </div>
        <div class="report-tile">
          <h3>Member statistics</h3>
          <dl class="stats-list">
            <div><dt>Total members</dt><dd>${totals.totalMembers}</dd></div>
            <div><dt>Active</dt><dd>${totals.active}</dd></div>
            <div><dt>Expiring soon</dt><dd>${totals.expiring}</dd></div>
            <div><dt>Expired</dt><dd>${totals.expired}</dd></div>
            <div><dt>Archived</dt><dd>${totals.archived}</dd></div>
          </dl>
        </div>
      </div>
    `;
  }

  function memberFormModal(data, member = null) {
    const isEdit = Boolean(member);
    const current = member || {};
    const plan = getPlan(data, current.planId);
    const startDate = current.startDate || todayISO();
    const endDate = current.endDate || addMonths(startDate, plan.months);

    return `
      <div class="modal-backdrop" data-modal-close>
        <div class="modal" onclick="event.stopPropagation()">
          <form id="member-form">
            <div class="modal-header">
              <h2>${isEdit ? 'Edit member' : 'Add member'}</h2>
              <button type="button" class="icon-button" data-modal-close>${ICONS.close}</button>
            </div>
            <div class="form-grid">
              <label class="field full"><span>Name</span><input class="input" name="name" required value="${escapeHtml(current.name || '')}" /></label>
              <label class="field"><span>Phone</span><input class="input" name="phone" required value="${escapeHtml(current.phone || '')}" /></label>
              <label class="field"><span>Email</span><input class="input" type="email" name="email" value="${escapeHtml(current.email || '')}" /></label>
              <label class="field"><span>Plan</span><select class="input" name="planId">${planOptions(data, current.planId || plan.id)}</select></label>
              <label class="field"><span>Status</span><select class="input" name="status">
                <option value="active" ${current.status !== 'archived' ? 'selected' : ''}>Active</option>
                <option value="archived" ${current.status === 'archived' ? 'selected' : ''}>Archived</option>
              </select></label>
              <label class="field"><span>Start date</span><input class="input" type="date" name="startDate" value="${startDate}" /></label>
              <label class="field"><span>Renewal date</span><input class="input" type="date" name="endDate" value="${endDate}" /></label>
              ${isEdit ? `
                <label class="field"><span>Pending due</span><input class="input" type="number" name="due" min="0" value="${Number(current.due || 0)}" /></label>
              ` : `
                <label class="field"><span>Payment received</span><input class="input" type="number" name="amountPaid" min="0" value="${plan.price}" /></label>
                <label class="field"><span>Method</span><select class="input" name="method">
                  <option>UPI</option><option>Cash</option><option>Card</option><option>Bank Transfer</option><option>Pending</option>
                </select></label>
              `}
              <label class="field full"><span>Notes</span><textarea class="input" name="notes" rows="3">${escapeHtml(current.notes || '')}</textarea></label>
            </div>
            <div class="modal-actions">
              <button type="button" class="btn btn-secondary" data-modal-close>Cancel</button>
              <button type="submit" class="btn btn-primary">${isEdit ? 'Save member' : 'Add member'}</button>
            </div>
          </form>
        </div>
      </div>
    `;
  }

  function renewFormModal(data, member) {
    const plan = getPlan(data, member.planId);
    const startDate = member.endDate && daysUntil(member.endDate) >= 0 ? addDays(member.endDate, 1) : todayISO();
    const endDate = addMonths(startDate, plan.months);

    return `
      <div class="modal-backdrop" data-modal-close>
        <div class="modal" onclick="event.stopPropagation()">
          <form id="renew-form" data-member-id="${member.id}">
            <div class="modal-header">
              <h2>Renew membership</h2>
              <button type="button" class="icon-button" data-modal-close>${ICONS.close}</button>
            </div>
            <div class="member-renew-card">
              <span class="avatar">${escapeHtml(initials(member.name))}</span>
              <div><strong>${escapeHtml(member.name)}</strong><span>Current renewal date: ${fmtDate(member.endDate)}</span></div>
            </div>
            <div class="form-grid">
              <label class="field"><span>Plan</span><select class="input" name="planId">${planOptions(data, member.planId)}</select></label>
              <label class="field"><span>Amount received</span><input class="input" type="number" name="amount" min="0" value="${plan.price}" /></label>
              <label class="field"><span>Renewal start</span><input class="input" type="date" name="renewalFrom" value="${startDate}" /></label>
              <label class="field"><span>Renewal date</span><input class="input" type="date" name="renewalTo" value="${endDate}" /></label>
              <label class="field"><span>Payment date</span><input class="input" type="date" name="date" value="${todayISO()}" /></label>
              <label class="field"><span>Method</span><select class="input" name="method">
                <option>UPI</option><option>Cash</option><option>Card</option><option>Bank Transfer</option><option>Pending</option>
              </select></label>
              <label class="field full"><span>Note</span><input class="input" name="note" value="Membership renewal" /></label>
            </div>
            <div class="modal-actions">
              <button type="button" class="btn btn-secondary" data-modal-close>Cancel</button>
              <button type="submit" class="btn btn-primary">Renew member</button>
            </div>
          </form>
        </div>
      </div>
    `;
  }

  function paymentFormModal(data) {
    const firstMember = data.members.find((member) => member.status !== 'archived') || data.members[0];
    const plan = getPlan(data, firstMember ? firstMember.planId : data.plans[0].id);
    const startDate = firstMember && firstMember.endDate && daysUntil(firstMember.endDate) >= 0 ? addDays(firstMember.endDate, 1) : todayISO();

    return `
      <div class="modal-backdrop" data-modal-close>
        <div class="modal" onclick="event.stopPropagation()">
          <form id="payment-form">
            <div class="modal-header">
              <h2>Record payment</h2>
              <button type="button" class="icon-button" data-modal-close>${ICONS.close}</button>
            </div>
            <div class="form-grid">
              <label class="field full payment-member-search">
                <span>Search member</span>
                <div class="search-box search-box-fluid">
                  ${ICONS.search}
                  <input id="payment-member-search" type="search" placeholder="Search by member name or phone number" autocomplete="off" />
                </div>
              </label>
              <label class="field full"><span>Member</span><select class="input" name="memberId">${memberOptions(data, firstMember ? firstMember.id : '')}</select></label>
              <label class="field"><span>Plan</span><select class="input" name="planId">${planOptions(data, plan.id)}</select></label>
              <label class="field"><span>Amount received</span><input class="input" type="number" name="amount" min="0" value="${plan.price}" /></label>
              <label class="field"><span>Payment date</span><input class="input" type="date" name="date" value="${todayISO()}" /></label>
              <label class="field"><span>Method</span><select class="input" name="method">
                <option>UPI</option><option>Cash</option><option>Card</option><option>Bank Transfer</option><option>Pending</option>
              </select></label>
              <label class="field"><span>Renewal start</span><input class="input" type="date" name="renewalFrom" value="${startDate}" /></label>
              <label class="field"><span>Renewal date</span><input class="input" type="date" name="renewalTo" value="${addMonths(startDate, plan.months)}" /></label>
              <label class="check-field full"><input type="checkbox" name="updateRenewal" checked /> <span>Update member renewal date</span></label>
              <label class="field full"><span>Note</span><input class="input" name="note" value="Membership payment" /></label>
            </div>
            <div class="modal-actions">
              <button type="button" class="btn btn-secondary" data-modal-close>Cancel</button>
              <button type="submit" class="btn btn-primary">Record payment</button>
            </div>
          </form>
        </div>
      </div>
    `;
  }

  function expenseFormModal() {
    return `
      <div class="modal-backdrop" data-modal-close>
        <div class="modal" onclick="event.stopPropagation()">
          <form id="expense-form">
            <div class="modal-header">
              <h2>Add expense</h2>
              <button type="button" class="icon-button" data-modal-close>${ICONS.close}</button>
            </div>
            <div class="form-grid">
              <label class="field"><span>Date</span><input class="input" type="date" name="date" value="${todayISO()}" /></label>
              <label class="field"><span>Category</span><select class="input" name="category">
                <option>Equipment</option><option>Maintenance</option><option>Rent</option><option>Electricity</option><option>Water</option><option>Miscellaneous</option>
              </select></label>
              <label class="field"><span>Amount</span><input class="input" type="number" min="0" name="amount" required /></label>
              <label class="field"><span>Vendor</span><input class="input" name="vendor" /></label>
              <label class="field full"><span>Note</span><textarea class="input" name="note" rows="3"></textarea></label>
            </div>
            <div class="modal-actions">
              <button type="button" class="btn btn-secondary" data-modal-close>Cancel</button>
              <button type="submit" class="btn btn-primary">Save expense</button>
            </div>
          </form>
        </div>
      </div>
    `;
  }

  window.GymViews = {
    ICONS,
    analyticsView,
    appShell,
    dashboardView,
    escapeHtml,
    expenseFormModal,
    expensesView,
    memberFormModal,
    memberRows,
    membersView,
    paymentFormModal,
    paymentsView,
    plansView,
    renewFormModal,
    reportsView,
  };
})();
