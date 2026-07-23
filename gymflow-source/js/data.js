// GymFlow - local data, helpers, and seed records.
(function () {
  const STORAGE_KEY = 'gymflow_data_v3';

  const SEED = {
    gym: {
      name: 'FitCore Gym',
      phone: '+91 98765 43210',
      address: 'Main Road, Hyderabad',
    },
    plans: [
      { id: 'plan-monthly', name: 'Monthly', months: 1, price: 800, color: '#0F766E' },
      { id: 'plan-quarterly', name: 'Quarterly', months: 3, price: 1000, color: '#2563EB' },
      { id: 'plan-half-yearly', name: 'Half-yearly', months: 6, price: 5000, color: '#9333EA' },
      { id: 'plan-yearly', name: 'Yearly', months: 12, price: 10000, color: '#EA580C' },
    ],
    members: [
      {
        id: 'mem-1',
        name: 'Aarav Sharma',
        phone: '+91 98765 11111',
        email: 'aarav@example.com',
        planId: 'plan-monthly',
        startDate: '2026-06-12',
        endDate: '2026-07-12',
        joinedAt: '2026-02-08',
        due: 0,
        status: 'active',
        notes: 'Morning batch',
      },
      {
        id: 'mem-2',
        name: 'Meera Rao',
        phone: '+91 98765 22222',
        email: 'meera@example.com',
        planId: 'plan-quarterly',
        startDate: '2026-05-10',
        endDate: '2026-08-10',
        joinedAt: '2026-01-18',
        due: 0,
        status: 'active',
        notes: 'Personal training lead',
      },
      {
        id: 'mem-3',
        name: 'Rohan Kapoor',
        phone: '+91 98765 33333',
        email: 'rohan@example.com',
        planId: 'plan-monthly',
        startDate: '2026-06-04',
        endDate: '2026-07-04',
        joinedAt: '2026-03-01',
        due: 500,
        status: 'active',
        notes: 'Renewal pending',
      },
      {
        id: 'mem-4',
        name: 'Ananya Iyer',
        phone: '+91 98765 44444',
        email: 'ananya@example.com',
        planId: 'plan-half-yearly',
        startDate: '2026-04-01',
        endDate: '2026-10-01',
        joinedAt: '2026-04-01',
        due: 0,
        status: 'active',
        notes: '',
      },
      {
        id: 'mem-5',
        name: 'Kabir Khan',
        phone: '+91 98765 55555',
        email: 'kabir@example.com',
        planId: 'plan-yearly',
        startDate: '2026-01-15',
        endDate: '2027-01-15',
        joinedAt: '2026-01-15',
        due: 0,
        status: 'active',
        notes: 'Annual member',
      },
      {
        id: 'mem-6',
        name: 'Priya Menon',
        phone: '+91 98765 66666',
        email: 'priya@example.com',
        planId: 'plan-monthly',
        startDate: '2026-05-28',
        endDate: '2026-06-28',
        joinedAt: '2026-05-28',
        due: 1500,
        status: 'active',
        notes: 'Call before archiving',
      },
      {
        id: 'mem-7',
        name: 'Vikram Das',
        phone: '+91 98765 77777',
        email: 'vikram@example.com',
        planId: 'plan-quarterly',
        startDate: '2026-03-15',
        endDate: '2026-06-15',
        joinedAt: '2026-03-15',
        due: 0,
        status: 'archived',
        notes: 'Paused membership',
      },
    ],
    payments: [
      { id: 'pay-1', memberId: 'mem-1', planId: 'plan-monthly', date: '2026-06-12', amount: 1500, method: 'UPI', renewalFrom: '2026-06-12', renewalTo: '2026-07-12', status: 'paid', note: 'Monthly renewal' },
      { id: 'pay-2', memberId: 'mem-2', planId: 'plan-quarterly', date: '2026-05-10', amount: 4000, method: 'Cash', renewalFrom: '2026-05-10', renewalTo: '2026-08-10', status: 'paid', note: 'Quarterly plan' },
      { id: 'pay-3', memberId: 'mem-3', planId: 'plan-monthly', date: '2026-06-04', amount: 1000, method: 'UPI', renewalFrom: '2026-06-04', renewalTo: '2026-07-04', status: 'partial', note: 'Partial payment' },
      { id: 'pay-4', memberId: 'mem-4', planId: 'plan-half-yearly', date: '2026-04-01', amount: 7200, method: 'Card', renewalFrom: '2026-04-01', renewalTo: '2026-10-01', status: 'paid', note: 'Half-yearly plan' },
      { id: 'pay-5', memberId: 'mem-5', planId: 'plan-yearly', date: '2026-01-15', amount: 13200, method: 'Bank Transfer', renewalFrom: '2026-01-15', renewalTo: '2027-01-15', status: 'paid', note: 'Yearly plan' },
      { id: 'pay-6', memberId: 'mem-6', planId: 'plan-monthly', date: '2026-05-28', amount: 0, method: 'Pending', renewalFrom: '2026-05-28', renewalTo: '2026-06-28', status: 'pending', note: 'Pending dues' },
      { id: 'pay-7', memberId: 'mem-1', planId: 'plan-monthly', date: '2026-07-05', amount: 1500, method: 'UPI', renewalFrom: '2026-07-12', renewalTo: '2026-08-12', status: 'paid', note: 'Advance renewal' },
      { id: 'pay-8', memberId: 'mem-3', planId: 'plan-monthly', date: '2026-07-03', amount: 1000, method: 'Cash', renewalFrom: '2026-07-04', renewalTo: '2026-08-04', status: 'partial', note: 'Partial renewal' },
    ],
    expenses: [
      { id: 'exp-1', date: '2026-07-01', category: 'Rent', amount: 35000, vendor: 'Building Owner', note: 'July rent' },
      { id: 'exp-2', date: '2026-07-02', category: 'Electricity', amount: 8200, vendor: 'Power board', note: 'Monthly bill' },
      { id: 'exp-3', date: '2026-07-03', category: 'Water', amount: 1200, vendor: 'Water supply', note: 'Water cans and bill' },
      { id: 'exp-4', date: '2026-06-21', category: 'Maintenance', amount: 6500, vendor: 'Service team', note: 'Treadmill repair' },
      { id: 'exp-5', date: '2026-06-14', category: 'Equipment', amount: 24000, vendor: 'Fitness Pro', note: 'Dumbbell set' },
      { id: 'exp-6', date: '2026-07-06', category: 'Miscellaneous', amount: 2300, vendor: 'Local store', note: 'Cleaning supplies' },
    ],
  };

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function todayISO() {
    const now = new Date();
    const offset = now.getTimezoneOffset();
    const local = new Date(now.getTime() - offset * 60000);
    return local.toISOString().slice(0, 10);
  }

  function dateOnly(value) {
    return new Date(`${value}T00:00:00`);
  }

  function addDays(date, days) {
    const result = dateOnly(date);
    result.setDate(result.getDate() + Number(days || 0));
    return result.toISOString().slice(0, 10);
  }

  function addMonths(date, months) {
    const result = dateOnly(date);
    const day = result.getDate();
    result.setMonth(result.getMonth() + Number(months || 0));
    if (result.getDate() < day) result.setDate(0);
    return result.toISOString().slice(0, 10);
  }

  function daysUntil(date) {
    if (!date) return 0;
    const today = dateOnly(todayISO());
    return Math.ceil((dateOnly(date) - today) / 86400000);
  }

  function monthKey(date) {
    return String(date || todayISO()).slice(0, 7);
  }

  function monthLabel(key) {
    const date = new Date(`${key}-01T00:00:00`);
    return date.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
  }

  function lastMonthKeys(count = 6) {
    const date = new Date(`${todayISO().slice(0, 7)}-01T00:00:00`);
    const keys = [];
    for (let i = count - 1; i >= 0; i -= 1) {
      const d = new Date(date);
      d.setMonth(date.getMonth() - i);
      keys.push(d.toISOString().slice(0, 7));
    }
    return keys;
  }

  function fmtINR(value) {
    const n = Number(value || 0);
    return `Rs ${n.toLocaleString('en-IN')}`;
  }

  function fmtDate(value) {
    if (!value) return '-';
    return new Date(`${value}T00:00:00`).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }

  function uid(prefix = 'id') {
    return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
  }

  function getPlan(data, planId) {
    return data.plans.find((plan) => plan.id === planId) || data.plans[0];
  }

  function getMember(data, memberId) {
    return data.members.find((member) => member.id === memberId);
  }

  function normalizePhone(phone) {
    const digits = String(phone || '').replace(/\D/g, '');
    if (digits.length === 10) return `91${digits}`;
    return digits;
  }

  function memberState(member) {
    if (member.status === 'archived') return 'archived';
    const diff = daysUntil(member.endDate);
    if (diff < 0) return 'expired';
    if (diff <= 7) return 'expiring';
    return 'active';
  }

  function isActiveMember(member) {
    return member.status !== 'archived' && daysUntil(member.endDate) >= 0;
  }

  function isExpiringMember(member) {
    const diff = daysUntil(member.endDate);
    return member.status !== 'archived' && diff >= 0 && diff <= 7;
  }

  function sum(list, picker) {
    return list.reduce((total, item) => total + Number(picker(item) || 0), 0);
  }

  function monthlyTotals(data, key = monthKey()) {
    const payments = data.payments.filter((payment) => monthKey(payment.date) === key);
    const expenses = data.expenses.filter((expense) => monthKey(expense.date) === key);
    const revenue = sum(payments, (payment) => payment.amount);
    const expenseTotal = sum(expenses, (expense) => expense.amount);
    const active = data.members.filter(isActiveMember).length;
    const archived = data.members.filter((member) => member.status === 'archived').length;
    const dues = sum(data.members.filter((member) => member.status !== 'archived'), (member) => member.due);

    return {
      key,
      label: monthLabel(key),
      payments,
      expenses,
      revenue,
      expensesTotal: expenseTotal,
      profit: revenue - expenseTotal,
      active,
      archived,
      totalMembers: data.members.length,
      expiring: data.members.filter(isExpiringMember).length,
      expired: data.members.filter((member) => memberState(member) === 'expired').length,
      dues,
    };
  }

  function monthlySeries(data, count = 6) {
    return lastMonthKeys(count).map((key) => monthlyTotals(data, key));
  }

  function buildDemoMembers() {
    const names = [
      'Aarav Sharma', 'Meera Rao', 'Rohan Kapoor', 'Ananya Iyer', 'Kabir Khan',
      'Priya Menon', 'Vikram Das', 'Nisha Patel', 'Arjun Reddy', 'Sneha Nair',
      'Rahul Verma', 'Ishita Sen', 'Karan Malhotra', 'Pooja Singh', 'Aditya Rao',
      'Tanvi Joshi', 'Mohit Gupta', 'Neha Kulkarni', 'Sameer Khan', 'Riya Shah',
      'Dev Mehta', 'Aditi Pillai', 'Varun Bhat', 'Kavya Jain', 'Sahil Chopra',
      'Diya Thomas', 'Nikhil Bose', 'Maya Krishnan', 'Harsh Agarwal', 'Sara Ali',
      'Yash Desai', 'Tara George', 'Manav Sethi', 'Leena Roy', 'Om Prakash',
      'Avni Saxena', 'Jay Menon', 'Naina Dutta', 'Rudra Patil', 'Mira Chawla',
      'Akash Nair', 'Kiara Soni', 'Parth Shah', 'Zoya Ansari', 'Neil Fernandes',
      'Sanya Kapoor', 'Vihaan Rao', 'Aisha Khan', 'Raghav Jain', 'Tanya Bedi',
    ];
    const batches = ['Morning batch', 'Evening batch', 'Strength training', 'Cardio focus', 'Personal training'];
    const planPattern = [
      ...Array(25).fill('plan-monthly'),
      ...Array(20).fill('plan-quarterly'),
      ...Array(4).fill('plan-half-yearly'),
      'plan-yearly',
    ];

    return names.map((name, index) => {
      const planId = planPattern[index] || 'plan-monthly';
      const plan = SEED.plans.find((item) => item.id === planId) || SEED.plans[0];
      const isExpiring = index < 10;
      const endDate = isExpiring ? addDays(todayISO(), (index % 7) + 1) : addDays(todayISO(), 25 + index * 3);
      const startDate = addMonths(endDate, -plan.months);
      const phone = `+91 90000 ${String(10000 + index).slice(0, 5)}`;
      const email = `${name.toLowerCase().replace(/[^a-z]+/g, '.').replace(/\.$/, '')}@example.com`;

      return {
        id: `mem-${index + 1}`,
        name,
        phone,
        email,
        planId,
        startDate,
        endDate,
        joinedAt: addMonths(startDate, -((index % 5) + 1)),
        due: index % 13 === 0 ? 200 : 0,
        status: 'active',
        notes: batches[index % batches.length],
      };
    });
  }

  function buildDemoPayments(members) {
    const currentMonth = monthKey();
    const currentPayments = members.slice(0, 49).map((member, index) => {
      const plan = SEED.plans.find((item) => item.id === member.planId) || SEED.plans[0];
      return {
        id: `pay-${index + 1}`,
        memberId: member.id,
        planId: plan.id,
        date: `${currentMonth}-${String((index % 7) + 1).padStart(2, '0')}`,
        amount: plan.price,
        method: ['UPI', 'Cash', 'Card', 'Bank Transfer'][index % 4],
        renewalFrom: member.startDate,
        renewalTo: member.endDate,
        status: 'paid',
        note: 'Membership payment',
      };
    });

    const previousMonth = (() => {
      const date = new Date(`${currentMonth}-01T00:00:00`);
      date.setMonth(date.getMonth() - 1);
      return date.toISOString().slice(0, 7);
    })();

    const previousPayments = members.slice(0, 12).map((member, index) => {
      const plan = SEED.plans.find((item) => item.id === member.planId) || SEED.plans[0];
      return {
        id: `pay-prev-${index + 1}`,
        memberId: member.id,
        planId: plan.id,
        date: `${previousMonth}-${String((index % 9) + 3).padStart(2, '0')}`,
        amount: plan.price,
        method: 'UPI',
        renewalFrom: addMonths(member.startDate, -1),
        renewalTo: addMonths(member.endDate, -1),
        status: 'paid',
        note: 'Previous month payment',
      };
    });

    return [...currentPayments, ...previousPayments];
  }

  function buildDemoExpenses() {
    const currentMonth = monthKey();
    return [
      { id: 'exp-1', date: `${currentMonth}-01`, category: 'Rent', amount: 5000, vendor: 'Building Owner', note: 'Monthly rent' },
      { id: 'exp-2', date: `${currentMonth}-02`, category: 'Electricity', amount: 2000, vendor: 'Power board', note: 'Electricity bill' },
      { id: 'exp-3', date: `${currentMonth}-03`, category: 'Water', amount: 800, vendor: 'Water supply', note: 'Water bill' },
      { id: 'exp-4', date: `${currentMonth}-04`, category: 'Maintenance', amount: 1200, vendor: 'Service team', note: 'Machine servicing' },
      { id: 'exp-5', date: `${currentMonth}-05`, category: 'Miscellaneous', amount: 1000, vendor: 'Local store', note: 'Cleaning and small items' },
      { id: 'exp-prev-1', date: addMonths(`${currentMonth}-08`, -1), category: 'Equipment', amount: 8500, vendor: 'Fitness Pro', note: 'Bench repair' },
      { id: 'exp-prev-2', date: addMonths(`${currentMonth}-15`, -1), category: 'Electricity', amount: 1900, vendor: 'Power board', note: 'Previous bill' },
    ];
  }

  function applyDemoSeed() {
    SEED.members = buildDemoMembers();
    SEED.payments = buildDemoPayments(SEED.members);
    SEED.expenses = buildDemoExpenses();
  }

  applyDemoSeed();

  function migrate(data) {
    const migrated = { ...clone(SEED), ...clone(data || {}) };
    migrated.gym = { ...SEED.gym, ...(migrated.gym || {}) };
    migrated.plans = Array.isArray(migrated.plans) && migrated.plans.length ? migrated.plans : clone(SEED.plans);
    migrated.members = Array.isArray(migrated.members) ? migrated.members : [];
    migrated.payments = Array.isArray(migrated.payments) ? migrated.payments : [];
    migrated.expenses = Array.isArray(migrated.expenses) ? migrated.expenses : [];
    migrated.members = migrated.members.map((member) => ({
      joinedAt: member.startDate || todayISO(),
      due: 0,
      status: 'active',
      notes: '',
      ...member,
    }));
    migrated.payments = migrated.payments.map((payment) => ({
      status: 'paid',
      note: '',
      ...payment,
    }));
    migrated.expenses = migrated.expenses.map((expense) => ({
      vendor: '',
      note: '',
      ...expense,
    }));
    return migrated;
  }

  const DB = {
    load() {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        const seeded = migrate(SEED);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
        return clone(seeded);
      }
      try {
        return migrate(JSON.parse(raw));
      } catch {
        const seeded = migrate(SEED);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
        return clone(seeded);
      }
    },
    save(data) {
      const migrated = migrate(data);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
      return clone(migrated);
    },
    reset() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(migrate(SEED)));
      return clone(SEED);
    },
  };

  window.GymFlow = {
    DB,
    SEED,
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
    normalizePhone,
    todayISO,
    uid,
  };
})();
