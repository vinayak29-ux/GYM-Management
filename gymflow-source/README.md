# GymFlow - Gym Management Software

A clean, simple gym management app that runs directly in the browser and saves data in localStorage.

## Modules

| Module | What it does |
| --- | --- |
| Dashboard | Active members, expiring memberships, monthly revenue, expenses, and profit |
| Member Management | Add, edit, renew, search, WhatsApp reminder, and archive members |
| Membership Plans | Monthly, quarterly, half-yearly, and yearly plans |
| Payment Tracking | Record payments, renewal dates, partial payments, and pending dues |
| Expense Management | Equipment, maintenance, rent, electricity, water, and miscellaneous expenses |
| Profit & Loss Analytics | Automatic monthly income, expense, and profit/loss charts |
| Reports | Monthly reports and downloadable CSV exports |

## Running It

Open `index.html` in a modern browser.

Optional local server:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Reset Data

Open the browser console and run:

```js
GymFlow.DB.reset();
location.reload();
```
changed notion api

