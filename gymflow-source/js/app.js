// GymFlow - router, events, and mutations.
(function () {
  const {
    DB,
    addDays,
    addMonths,
    daysUntil,
    fmtDate,
    fmtINR,
    getMember,
    getPlan,
    monthKey,
    monthLabel,
    monthlyTotals,
    normalizePhone,
    todayISO,
    uid,
  } = window.GymFlow;

  const V = window.GymViews;
  const Charts = window.GymCharts;
  const app = document.getElementById('app');
  const modalRoot = document.getElementById('modal-root');
  let chartInstances = [];

  function parseHash() {
    const hash = location.hash.replace(/^#/, '') || '/dashboard';
    return hash.split('?')[0] || '/dashboard';
  }

  function clearCharts() {
    chartInstances.forEach((chart) => {
      try { if (chart) chart.destroy(); } catch { }
    });
    chartInstances = [];
  }

  function toast(message, kind = 'info') {
    const el = document.createElement('div');
    el.className = `toast ${kind}`;
    el.textContent = message;
    document.getElementById('toasts').appendChild(el);
    setTimeout(() => el.classList.add('show'), 10);
    setTimeout(() => {
      el.classList.remove('show');
      setTimeout(() => el.remove(), 200);
    }, 2400);
  }

  function openModal(html) {
    modalRoot.innerHTML = html;
    document.body.classList.add('modal-open');
    bindModalEvents();
  }

  function closeModal() {
    modalRoot.innerHTML = '';
    document.body.classList.remove('modal-open');
  }

  function bindModalEvents() {
    modalRoot.querySelectorAll('[data-modal-close]').forEach((el) => {
      el.addEventListener('click', (event) => {
        if (event.target === el || event.target.closest('[data-modal-close]')) closeModal();
      });
    });
  }

  function render() {
    clearCharts();
    const data = DB.load();
    const path = parseHash();
    let content = '';

    switch (path) {
      case '/dashboard':
        content = V.dashboardView(data);
        break;
      case '/members':
        content = V.membersView(data);
        break;
      case '/plans':
        content = V.plansView(data);
        break;
      case '/payments':
        content = V.paymentsView(data);
        break;
      case '/expenses':
        content = V.expensesView(data);
        break;
      case '/analytics':
        content = V.analyticsView(data);
        break;
      case '/reports':
        content = V.reportsView(data);
        break;
      default:
        location.hash = '#/dashboard';
        return;
    }

    app.innerHTML = V.appShell(`#${path}`, content, data);
    bindPageEvents(path, data);
    setTimeout(() => initCharts(path, DB.load()), 30);
  }

  function initCharts(path, data) {
    if (path === '/dashboard') {
      chartInstances.push(Charts.pnl(document.getElementById('chart-dashboard-pnl'), data));
    }
    if (path === '/expenses') {
      chartInstances.push(Charts.expensesCategory(document.getElementById('chart-expenses-category'), data));
    }
    if (path === '/analytics') {
      chartInstances.push(Charts.pnl(document.getElementById('chart-analytics-pnl'), data));
      chartInstances.push(Charts.memberStatus(document.getElementById('chart-member-status'), data));
    }
  }

  function bindPageEvents(path, data) {
    document.querySelectorAll('[data-nav]').forEach((button) => {
      button.addEventListener('click', () => {
        const next = button.dataset.nav;
        if (location.hash === next) render();
        else location.hash = next;
      });
    });

    document.querySelectorAll('[data-action]').forEach((button) => {
      button.addEventListener('click', (event) => {
        const action = event.currentTarget.dataset.action;
        if (ACTIONS[action]) ACTIONS[action](event.currentTarget, DB.load());
      });
    });

    if (path === '/members') bindMemberFilters();
  }

  function bindMemberFilters() {
    const search = document.getElementById('member-search');
    const filters = document.querySelectorAll('#member-filters [data-filter]');
    const empty = document.getElementById('members-empty');
    let activeFilter = 'all';

    function refresh() {
      const query = String(search.value || '').trim().toLowerCase();
      const rows = Array.from(document.querySelectorAll('[data-member-row]'));
      let visible = 0;

      rows.forEach((row) => {
        const state = row.dataset.state;
        const due = Number(row.dataset.due || 0);
        const matchesSearch = !query || row.dataset.search.includes(query);
        const matchesFilter =
          activeFilter === 'all'
          || state === activeFilter
          || (activeFilter === 'active' && (state === 'active' || state === 'expiring'))
          || (activeFilter === 'dues' && due > 0);
        const show = matchesSearch && matchesFilter;
        row.classList.toggle('hidden', !show);
        if (show) visible += 1;
      });

      if (empty) empty.classList.toggle('hidden', visible > 0);
    }

    if (search) search.addEventListener('input', refresh);
    filters.forEach((button) => {
      button.addEventListener('click', () => {
        filters.forEach((item) => item.classList.remove('active'));
        button.classList.add('active');
        activeFilter = button.dataset.filter;
        refresh();
      });
    });
  }

  function bindPlanAutoFields(form, data) {
    const planInput = form.querySelector('[name="planId"]');
    const amountInput = form.querySelector('[name="amount"], [name="amountPaid"]');
    const startInput = form.querySelector('[name="renewalFrom"], [name="startDate"]');
    const endInput = form.querySelector('[name="renewalTo"], [name="endDate"]');

    function syncEnd(updateAmount = false) {
      if (!planInput || !startInput || !endInput) return;
      const plan = getPlan(data, planInput.value);
      if (updateAmount && amountInput) amountInput.value = plan.price;
      if (startInput.value) endInput.value = addMonths(startInput.value, plan.months);
    }

    if (planInput) planInput.addEventListener('change', () => syncEnd(true));
    if (startInput) startInput.addEventListener('change', () => syncEnd(false));
  }

  function bindPaymentMemberAuto(form, data) {
    const memberInput = form.querySelector('[name="memberId"]');
    const planInput = form.querySelector('[name="planId"]');
    const amountInput = form.querySelector('[name="amount"]');
    const startInput = form.querySelector('[name="renewalFrom"]');
    const endInput = form.querySelector('[name="renewalTo"]');

    if (!memberInput) return;
    const syncMember = () => {
      const member = getMember(data, memberInput.value);
      if (!member) return;
      const plan = getPlan(data, member.planId);
      if (planInput) planInput.value = plan.id;
      if (amountInput) amountInput.value = plan.price;
      const start = member.endDate && daysUntil(member.endDate) >= 0 ? addDays(member.endDate, 1) : todayISO();
      if (startInput) startInput.value = start;
      if (endInput) endInput.value = addMonths(start, plan.months);
    };

    memberInput.addEventListener('change', syncMember);
    syncMember();
  }

  function populatePaymentMemberOptions(form, data, query, preferredId = '') {
    const memberInput = form.querySelector('[name="memberId"]');
    if (!memberInput) return;

    const normalized = String(query || '').trim().toLowerCase();
    const activeMembers = data.members.filter((member) => member.status !== 'archived');
    const matches = activeMembers.filter((member) => {
      const plan = getPlan(data, member.planId);
      const haystack = `${member.name} ${member.phone} ${member.email} ${plan.name}`.toLowerCase();
      return !normalized || haystack.includes(normalized);
    });

    memberInput.innerHTML = '';
    if (!matches.length) {
      const option = document.createElement('option');
      option.value = '';
      option.textContent = 'No member found';
      option.disabled = true;
      memberInput.appendChild(option);
      return;
    }

    matches.forEach((member) => {
      const option = document.createElement('option');
      option.value = member.id;
      option.textContent = `${member.name} (${member.phone})`;
      memberInput.appendChild(option);
    });

    const preferredExists = matches.some((member) => member.id === preferredId);
    memberInput.value = preferredExists ? preferredId : matches[0].id;
    memberInput.dispatchEvent(new Event('change', { bubbles: true }));
  }

  function bindPaymentMemberSearch(form, data) {
    const searchInput = form.querySelector('#payment-member-search');
    const memberInput = form.querySelector('[name="memberId"]');
    if (!searchInput || !memberInput) return;

    searchInput.addEventListener('input', () => {
      populatePaymentMemberOptions(form, data, searchInput.value, memberInput.value);
    });
  }

  function paymentStatus(plan, amount) {
    if (Number(amount || 0) >= Number(plan.price || 0)) return 'paid';
    if (Number(amount || 0) > 0) return 'partial';
    return 'pending';
  }

  function savePayment(data, member, plan, values, updateRenewal) {
    const amount = Number(values.amount || 0);
    const renewalFrom = values.renewalFrom || todayISO();
    const renewalTo = values.renewalTo || addMonths(renewalFrom, plan.months);
    const due = Math.max(0, Number(plan.price || 0) - amount);

    data.payments.push({
      id: uid('pay'),
      memberId: member.id,
      planId: plan.id,
      date: values.date || todayISO(),
      amount,
      method: values.method || 'UPI',
      renewalFrom,
      renewalTo,
      status: paymentStatus(plan, amount),
      note: values.note || '',
    });

    if (updateRenewal) {
      Object.assign(member, {
        planId: plan.id,
        startDate: renewalFrom,
        endDate: renewalTo,
        due,
        status: 'active',
      });
    } else if (amount > 0) {
      member.due = Math.max(0, Number(member.due || 0) - amount);
    }
  }

  function formValues(form) {
    const fd = new FormData(form);
    return Object.fromEntries(fd.entries());
  }

  const ACTIONS = {
    'new-member': (_, data) => {
      openModal(V.memberFormModal(data));
      const form = document.getElementById('member-form');
      bindPlanAutoFields(form, data);
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        const values = formValues(form);
        const d = DB.load();
        const plan = getPlan(d, values.planId);
        const amount = Number(values.amountPaid || 0);
        const startDate = values.startDate || todayISO();
        const endDate = values.endDate || addMonths(startDate, plan.months);
        const member = {
          id: uid('mem'),
          name: values.name,
          phone: values.phone,
          email: values.email,
          planId: plan.id,
          startDate,
          endDate,
          joinedAt: startDate,
          due: Math.max(0, Number(plan.price || 0) - amount),
          status: values.status || 'active',
          notes: values.notes || '',
        };

        d.members.push(member);
        d.payments.push({
          id: uid('pay'),
          memberId: member.id,
          planId: plan.id,
          date: todayISO(),
          amount,
          method: values.method || 'UPI',
          renewalFrom: startDate,
          renewalTo: endDate,
          status: paymentStatus(plan, amount),
          note: 'Initial membership',
        });

        DB.save(d);
        closeModal();
        toast('Member added.', 'success');
        render();
      });
    },

    'edit-member': (button, data) => {
      const member = getMember(data, button.dataset.memberId);
      if (!member) return;
      openModal(V.memberFormModal(data, member));
      const form = document.getElementById('member-form');
      bindPlanAutoFields(form, data);
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        const values = formValues(form);
        const d = DB.load();
        const m = getMember(d, member.id);
        if (!m) return;
        Object.assign(m, {
          name: values.name,
          phone: values.phone,
          email: values.email,
          planId: values.planId,
          startDate: values.startDate,
          endDate: values.endDate,
          status: values.status || 'active',
          due: Number(values.due || 0),
          notes: values.notes || '',
        });
        DB.save(d);
        closeModal();
        toast('Member updated.', 'success');
        render();
      });
    },

    'renew-member': (button, data) => {
      const member = getMember(data, button.dataset.memberId);
      if (!member) return;
      openModal(V.renewFormModal(data, member));
      const form = document.getElementById('renew-form');
      bindPlanAutoFields(form, data);
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        const values = formValues(form);
        const d = DB.load();
        const m = getMember(d, member.id);
        if (!m) return;
        const plan = getPlan(d, values.planId);
        savePayment(d, m, plan, values, true);
        DB.save(d);
        closeModal();
        toast('Membership renewed.', 'success');
        render();
      });
    },

    'archive-member': (button, data) => {
      const d = DB.load();
      const member = getMember(d, button.dataset.memberId);
      if (!member) return;
      member.status = member.status === 'archived' ? 'active' : 'archived';
      DB.save(d);
      toast(member.status === 'archived' ? 'Member archived.' : 'Member restored.', 'success');
      render();
    },

    'whatsapp-member': (button, data) => {
      const member = getMember(data, button.dataset.memberId);
      if (!member) return;
      const phone = normalizePhone(member.phone);
      if (!phone) {
        toast('No phone number saved for this member.', 'error');
        return;
      }
      const message = `Hi ${member.name}, your gym membership renewal date is ${fmtDate(member.endDate)}. Please renew your plan to continue training without interruption. Thank you.`;
      window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
    },

    'new-payment': (_, data) => {
      if (!data.members.some((member) => member.status !== 'archived')) {
        toast('Add an active member before recording payments.', 'error');
        return;
      }
      openModal(V.paymentFormModal(data));
      const form = document.getElementById('payment-form');
      bindPlanAutoFields(form, data);
      bindPaymentMemberAuto(form, data);
      bindPaymentMemberSearch(form, data);
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        const values = formValues(form);
        const d = DB.load();
        const member = getMember(d, values.memberId);
        const plan = getPlan(d, values.planId);
        if (!member) {
          toast('Select a member before recording payment.', 'error');
          return;
        }
        savePayment(d, member, plan, values, values.updateRenewal === 'on');
        DB.save(d);
        closeModal();
        toast('Payment recorded.', 'success');
        render();
      });
    },

    'new-expense': () => {
      openModal(V.expenseFormModal());
      const form = document.getElementById('expense-form');
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        const values = formValues(form);
        const d = DB.load();
        d.expenses.push({
          id: uid('exp'),
          date: values.date || todayISO(),
          category: values.category,
          amount: Number(values.amount || 0),
          vendor: values.vendor || '',
          note: values.note || '',
        });
        DB.save(d);
        closeModal();
        toast('Expense saved.', 'success');
        render();
      });
    },

    'download-report': () => {
      const data = DB.load();
      const selector = document.getElementById('report-month');
      const key = selector ? selector.value : monthKey();
      downloadReport(data, key);
    },

    'download-members': () => downloadMembers(DB.load()),
    'download-payments': () => downloadPayments(DB.load()),
    'download-expenses': () => downloadExpenses(DB.load()),
  };

  function csvCell(value) {
    return `"${String(value ?? '').replace(/"/g, '""')}"`;
  }

  function toCsv(rows) {
    return rows.map((row) => row.map(csvCell).join(',')).join('\n');
  }

  function downloadCsv(filename, rows) {
    const blob = new Blob([toCsv(rows)], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    toast('Report downloaded.', 'success');
  }

  function downloadReport(data, key) {
    const totals = monthlyTotals(data, key);
    const rows = [
      ['GymFlow Monthly Report', monthLabel(key)],
      [],
      ['Summary', 'Value'],
      ['Income', totals.revenue],
      ['Expenses', totals.expensesTotal],
      ['Profit / Loss', totals.profit],
      ['Pending dues', totals.dues],
      [],
      ['Member Statistics', 'Count'],
      ['Total members', totals.totalMembers],
      ['Active members', totals.active],
      ['Expiring soon', totals.expiring],
      ['Expired', totals.expired],
      ['Archived', totals.archived],
      [],
      ['Payments'],
      ['Date', 'Member', 'Plan', 'Amount', 'Method', 'Renewal From', 'Renewal To', 'Status', 'Note'],
      ...totals.payments.map((payment) => {
        const member = getMember(data, payment.memberId);
        const plan = getPlan(data, payment.planId);
        return [payment.date, member ? member.name : '', plan.name, payment.amount, payment.method, payment.renewalFrom, payment.renewalTo, payment.status, payment.note];
      }),
      [],
      ['Expenses'],
      ['Date', 'Category', 'Vendor', 'Amount', 'Note'],
      ...totals.expenses.map((expense) => [expense.date, expense.category, expense.vendor, expense.amount, expense.note]),
    ];
    downloadCsv(`gymflow-report-${key}.csv`, rows);
  }

  function downloadMembers(data) {
    const rows = [
      ['Name', 'Phone', 'Email', 'Plan', 'Start Date', 'Renewal Date', 'Due', 'Status', 'Notes'],
      ...data.members.map((member) => {
        const plan = getPlan(data, member.planId);
        return [member.name, member.phone, member.email, plan.name, member.startDate, member.endDate, member.due, member.status, member.notes];
      }),
    ];
    downloadCsv('gymflow-members.csv', rows);
  }

  function downloadPayments(data) {
    const rows = [
      ['Date', 'Member', 'Plan', 'Amount', 'Method', 'Renewal From', 'Renewal To', 'Status', 'Note'],
      ...data.payments.map((payment) => {
        const member = getMember(data, payment.memberId);
        const plan = getPlan(data, payment.planId);
        return [payment.date, member ? member.name : '', plan.name, payment.amount, payment.method, payment.renewalFrom, payment.renewalTo, payment.status, payment.note];
      }),
    ];
    downloadCsv('gymflow-payments.csv', rows);
  }

  function downloadExpenses(data) {
    const rows = [
      ['Date', 'Category', 'Vendor', 'Amount', 'Note'],
      ...data.expenses.map((expense) => [expense.date, expense.category, expense.vendor, expense.amount, expense.note]),
    ];
    downloadCsv('gymflow-expenses.csv', rows);
  }

  window.addEventListener('hashchange', render);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeModal();
  });
  document.addEventListener('DOMContentLoaded', () => {
    if (!location.hash) location.hash = '#/dashboard';
    render();
  });
  if (document.readyState !== 'loading') {
    if (!location.hash) location.hash = '#/dashboard';
    render();
  }
})();
