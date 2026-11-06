/* Terra Nova — scroll-scrubbed video, text reveal, routing, header, auth form. */
(function () {
  var $ = function (s) { return document.querySelector(s); };
  var I18N = window.TN_I18N, AUTH = window.TN_AUTH;
  var clamp = function (v, a, b) { return Math.min(b === undefined ? 1 : b, Math.max(a === undefined ? 0 : a, v)); };
  var ease = function (t) { return 1 - Math.pow(1 - t, 3); };

  var home = $("#home"), auth = $("#auth"), track = $("#track");
  var video = $("#heroVideo"), spaceL = $("#spaceLayer"), dimL = $("#dimLayer");
  var cue = $("#scrollCue"), title = $("#heroTitle"), text = $("#heroText"), cta = $("#heroCta");
  var barProg = $("#barProgress");

  /* ---------------- Timeline (fractions of the scroll track) ---------------- */
  var VIDEO_END = 0.62;           // video plays 0 → VIDEO_END
  var SPACE_IN = [0.50, 0.72];    // cross-fade to the star field
  var TITLE_AT = 0.56, LINE_GAP = 0.04, LINE_SPAN = 0.11;
  var TEXT_AT = [0.78, 0.90];
  var CTA_AT = [0.84, 0.96];

  var duration = 0, cur = 0, running = false, ready = false, lastP = -1;

  function progress() {
    var r = track.getBoundingClientRect();
    var span = track.offsetHeight - window.innerHeight;
    return span > 0 ? clamp(-r.top / span) : 0;
  }

  /* ---------------- Auto-advance to finish a section when scrolling stops ---------------- */
  var idleTimer = null, autoRAF = null, autoScrolling = false;
  var lastScrollY = window.pageYOffset, ignoreScrollUntil = 0, lastDir = 1;

  function endAuto() {
    if (autoRAF) cancelAnimationFrame(autoRAF);
    autoRAF = null;
    autoScrolling = false;
    ignoreScrollUntil = performance.now() + 300;
  }

  function autoAdvance() {
    if (autoScrolling || !ready || !running) return;
    var p = progress();
    var targetP = lastDir > 0 ? 1 : 0;
    if (Math.abs(targetP - p) < 0.01) return;
    var span = track.offsetHeight - window.innerHeight;
    if (span <= 0) return;
    var startY = window.pageYOffset;
    var endY = startY + (targetP - p) * span;
    var maxY = document.documentElement.scrollHeight - window.innerHeight;
    endY = clamp(endY, 0, maxY);
    var dist = Math.abs(endY - startY);
    if (dist < 4) return;
    var dur = lastDir > 0
      ? clamp(1100 + dist * 1.6, 1300, 4500)
      : clamp(500 + dist * 0.8, 600, 2500);
    var t0 = performance.now();
    autoScrolling = true;
    autoRAF = requestAnimationFrame(function step(now) {
      var k = clamp((now - t0) / dur);
      var e = 1 - Math.pow(1 - k, 3);
      window.scrollTo(0, startY + (endY - startY) * e);
      if (k < 1) autoRAF = requestAnimationFrame(step);
      else endAuto();
    });
  }

  window.addEventListener("scroll", function () {
    var y = window.pageYOffset;
    if (autoScrolling) { lastScrollY = y; return; }
    if (performance.now() < ignoreScrollUntil) { lastScrollY = y; return; }
    var dy = y - lastScrollY;
    lastScrollY = y;
    if (!dy) return;
    lastDir = dy > 0 ? 1 : -1;
    clearTimeout(idleTimer);
    idleTimer = setTimeout(autoAdvance, 100);
  }, { passive: true });

  ["wheel", "touchstart", "keydown"].forEach(function (ev) {
    window.addEventListener(ev, function () {
      clearTimeout(idleTimer);
      endAuto();
      ignoreScrollUntil = 0;
    }, { passive: true });
  });

  function render(force) {
    var p = progress();
    var target = clamp(p / VIDEO_END) * duration;
    var moved = Math.abs(target - cur);
    cur = target;
    seek();

    if (p === lastP && !force && moved < 0.02) return;
    lastP = p;

    var sp = ease(clamp((p - SPACE_IN[0]) / (SPACE_IN[1] - SPACE_IN[0])));
    spaceL.style.opacity = (sp * 0.95).toFixed(3);
    spaceL.style.transform = "scale(" + (1.08 - sp * 0.08).toFixed(4) + ")";
    dimL.style.opacity = (sp * 0.9).toFixed(3);
    cue.style.opacity = (1 - clamp(p / 0.04)).toFixed(3);
    barProg.style.transform = "scaleX(" + p.toFixed(4) + ")";

    var lines = title.querySelectorAll(".line > span");
    lines.forEach(function (el, i) {
      var t = ease(clamp((p - TITLE_AT - i * LINE_GAP) / LINE_SPAN));
      el.style.transform = "translateY(" + ((1 - t) * 115).toFixed(2) + "%)";
      el.style.opacity = t.toFixed(3);
    });
    var tt = ease(clamp((p - TEXT_AT[0]) / (TEXT_AT[1] - TEXT_AT[0])));
    text.style.opacity = tt.toFixed(3);
    text.style.transform = "translateY(" + ((1 - tt) * 48).toFixed(1) + "px)";
    var ct = ease(clamp((p - CTA_AT[0]) / (CTA_AT[1] - CTA_AT[0])));
    cta.style.opacity = ct.toFixed(3);
    cta.style.transform = "translateY(" + ((1 - ct) * 32).toFixed(1) + "px)";
    cta.style.pointerEvents = ct > 0.6 ? "auto" : "none";
  }

  /* Only issue a new seek when the previous one finished; always target the latest
     scroll position so seeks never queue up and jump. */
  function seek() {
    if (!duration || video.seeking) return;
    if (Math.abs(video.currentTime - cur) > 0.02) { try { video.currentTime = cur; } catch (e) {} }
  }
  video.addEventListener("seeked", seek);

  function loop() { if (!running) return; render(false); requestAnimationFrame(loop); }
  function start() { if (running || !ready) return; running = true; requestAnimationFrame(loop); }
  function stop() { running = false; }

  /* ---------------- Video loading (whole file in memory → instant seeking) ---------------- */
  var loader = $("#loader"), bar = $("#loaderBar"), pct = $("#loaderPct");
  function setPct(f) { bar.style.transform = "scaleX(" + f + ")"; pct.textContent = Math.round(f * 100) + "%"; }

  function finishLoad() {
    if (ready) return;
    duration = video.duration || 10.95;
    ready = true;
    try { video.pause(); video.currentTime = 0; } catch (e) {}
    setPct(1);
    render(true);
    setTimeout(function () { loader.classList.add("is-done"); }, 250);
    route();
  }

  function loadVideo() {
    var url = "assets/terra.webm", done = false;
    var safety = setTimeout(function () { if (!done) { done = true; video.src = url; finishLoad(); } }, 30000);
    video.addEventListener("loadedmetadata", function () { duration = video.duration; });
    fetch(url).then(function (res) {
      if (!res.ok) throw new Error("http " + res.status);
      var total = +res.headers.get("content-length") || 0, got = 0, chunks = [];
      if (!res.body || !res.body.getReader) return res.blob();
      var reader = res.body.getReader();
      return (function pump() {
        return reader.read().then(function (r) {
          if (r.done) return new Blob(chunks, { type: "video/webm" });
          chunks.push(r.value); got += r.value.length;
          setPct(total ? Math.min(got / total, 0.98) : 0.5);
          return pump();
        });
      })();
    }).then(function (blob) {
      video.addEventListener("loadeddata", function () { if (!done) { done = true; clearTimeout(safety); finishLoad(); } }, { once: true });
      video.src = URL.createObjectURL(blob);
      video.load();
    }).catch(function () {
      if (done) return;
      video.addEventListener("loadeddata", function () { if (!done) { done = true; clearTimeout(safety); finishLoad(); } }, { once: true });
      video.src = url; video.load();
    });
  }

  /* ---------------- Routing (#home / #login / #signup) ---------------- */
  function route() {
    var h = (location.hash || "#home").replace("#", "");
    var isAuth = h === "login" || h === "signup";
    home.hidden = isAuth;
    auth.hidden = !isAuth;
    if (isAuth) {
      stop();
      setMode(h);
      window.scrollTo(0, 0);
    } else {
      if (ready) { start(); render(true); }
    }
  }

  function setMode(mode) {
    auth.dataset.mode = mode;
    var signup = mode === "signup";
    $("#authTitle").setAttribute("data-i18n", signup ? "auth.signup.title" : "auth.login.title");
    $("#authSubmit").setAttribute("data-i18n", signup ? "auth.signup.btn" : "auth.login.btn");
    $("#fPass").autocomplete = signup ? "new-password" : "current-password";
    $("#authTitle").textContent = I18N.t(signup ? "auth.signup.title" : "auth.login.title");
    $("#authSubmit").textContent = I18N.t(signup ? "auth.signup.btn" : "auth.login.btn");
    showMsg("");
  }

  /* ---------------- Auth form ---------------- */
  var msg = $("#authMsg"), lastMsgKey = null;
  function showMsg(key, ok) {
    lastMsgKey = key || null;
    msg.hidden = !key;
    msg.classList.toggle("is-ok", !!ok);
    msg.textContent = key ? I18N.t(key) : "";
  }
  var validEmail = function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()); };

  $("#authForm").addEventListener("submit", async function (e) {
    e.preventDefault();
    var signup = auth.dataset.mode === "signup";
    var name = $("#fName").value, email = $("#fEmail").value, pass = $("#fPass").value;
    if (signup && name.trim().length < 2) return showMsg("msg.name");
    if (!validEmail(email)) return showMsg("msg.email");
    if (pass.length < 6) return showMsg("msg.pass");
    var btn = $("#authSubmit"); btn.disabled = true;
    var r = signup ? await AUTH.signup(name, email, pass) : await AUTH.login(email, pass);
    btn.disabled = false;
    showMsg(r.key, r.ok);
    if (r.ok) {
      renderNav();
      setTimeout(function () { $("#authForm").reset(); location.hash = "#home"; }, 1100);
    }
  });

  $("#forgotBtn").addEventListener("click", function () {
    var email = $("#fEmail").value;
    if (!validEmail(email)) return showMsg("msg.email");
    AUTH.forgot(email);
    showMsg("msg.reset", true);
  });

  /* ---------------- Header ---------------- */
  function renderNav() {
    var s = AUTH.session();
    $("#guestNav").hidden = !!s;
    $("#userNav").hidden = !s;
    if (s) $("#userName").textContent = s.name || s.email;
  }
  $("#logoutBtn").addEventListener("click", function () { AUTH.logout(); renderNav(); });

  var langBtn = $("#langBtn"), langMenu = $("#langMenu");
  function toggleMenu(open) {
    langMenu.hidden = !open;
    langBtn.setAttribute("aria-expanded", open ? "true" : "false");
  }
  langBtn.addEventListener("click", function (e) { e.stopPropagation(); toggleMenu(langMenu.hidden); });
  langMenu.addEventListener("click", function (e) {
    var b = e.target.closest("[data-lang]");
    if (!b) return;
    I18N.set(b.getAttribute("data-lang"));
    toggleMenu(false);
    langBtn.focus();
  });
  document.addEventListener("click", function (e) { if (!$("#lang").contains(e.target)) toggleMenu(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") toggleMenu(false); });

  document.addEventListener("tn:lang", function () {
    if (lastMsgKey) msg.textContent = I18N.t(lastMsgKey);
    var signup = auth.dataset.mode === "signup";
    $("#authTitle").textContent = I18N.t(signup ? "auth.signup.title" : "auth.login.title");
    $("#authSubmit").textContent = I18N.t(signup ? "auth.signup.btn" : "auth.login.btn");
    lastP = -1; render(true);
  });

  /* ---------------- Boot ---------------- */
  I18N.init();
  renderNav();
  window.addEventListener("hashchange", route);
  window.addEventListener("resize", function () { lastP = -1; });
  if (!track) return;
  loadVideo();
  render(true);
})();
