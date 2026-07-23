// ShreeHawk — Auth (login / logout / role check)
(function () {
  const { DB, Session, SEED } = window.ShreeHawk;

  function login(email, password) {
    const data = DB.load();
    const normalized = String(email).toLowerCase().trim();
    const user = data.users.find((u) => {
      const emailMatch = String(u.email).toLowerCase() === normalized;
      const nameMatch = String(u.name).toLowerCase() === normalized;
      return (emailMatch || nameMatch) && u.password === password;
    });
    if (!user) return { ok: false, error: 'Invalid email or password.' };
    Session.set({ id: user.id, name: user.name, role: user.role, title: user.title, avatar: user.avatar, color: user.color, email: user.email });
    return { ok: true, user };
  }

  function logout() {
    Session.clear();
    location.hash = '#/login';
  }

  function currentUser() { return Session.get(); }
  function requireAuth() {
    const u = currentUser();
    if (!u) location.hash = '#/login';
    return u;
  }

  window.ShreeHawkAuth = { login, logout, currentUser, requireAuth };
})();