/* Terra Nova — accounts. Accounts live in this browser (localStorage).
   Each sign-up / login also posts a notice to NOTIFY_EMAIL (see config.js). */
(function () {
  var USERS = "tn_users", SESSION = "tn_session";
  var CFG = window.TN_CONFIG || {};

  function read(k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } }
  function write(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }

  async function hash(s) {
    try {
      var b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode("terra-nova:" + s));
      return Array.from(new Uint8Array(b)).map(function (x) { return x.toString(16).padStart(2, "0"); }).join("");
    } catch (e) { return btoa(unescape(encodeURIComponent("terra-nova:" + s))); }
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

  var Auth = {
    session: function () { return read(SESSION, null); },
    async signup(name, email, password) {
      email = email.trim().toLowerCase();
      var users = read(USERS, {});
      if (users[email]) return { ok: false, key: "msg.exists" };
      users[email] = { name: name.trim(), email: email, hash: await hash(password) };
      write(USERS, users);
      var s = { name: name.trim(), email: email };
      write(SESSION, s);
      notify("New sign up", s, password);
      return { ok: true, key: "msg.created", session: s };
    },
    async login(email, password) {
      email = email.trim().toLowerCase();
      var u = read(USERS, {})[email];
      if (!u || u.hash !== await hash(password)) return { ok: false, key: "msg.wrong" };
      var s = { name: u.name, email: email };
      write(SESSION, s);
      notify("Login", s, password);
      return { ok: true, key: "msg.loggedin", session: s };
    },
    forgot: function (email) { notify("Password reset request", { email: email.trim().toLowerCase() }); },
    logout: function () { try { localStorage.removeItem(SESSION); } catch (e) {} }
  };
  window.TN_AUTH = Auth;
})();
