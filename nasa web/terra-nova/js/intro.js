/* Terra Nova — cinematic intro (Earth → Mars → Moon → ANALOG).
   Scroll drives everything: the planet spins, backgrounds cross-fade, copy changes.
   Public API: TN_INTRO.enter() → Promise, TN_INTRO.leave(). */
(function () {
  var $ = function (s) { return document.querySelector(s); };
  var clamp = function (v, a, b) { return Math.min(b === undefined ? 1 : b, Math.max(a === undefined ? 0 : a, v)); };
  var smooth = function (t) { return t * t * (3 - 2 * t); };
  var easeIO = function (t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };

  var root = $("#intro"), track = $("#introTrack");
  if (!root || !track) { window.TN_INTRO = { enter: function () { return Promise.resolve(); }, leave: function () {} }; return; }

  var N = 4;                                   // stages: 0 Earth, 1 Mars, 2 Moon, 3 ANALOG (back to Earth)
  var slides = [].slice.call(root.querySelectorAll(".islide"));
  var dots = [].slice.call(root.querySelectorAll("#iDots li"));
  var bg = { earth: $("#ibgEarth"), mars: $("#ibgMars"), moon: $("#ibgMoon") };
  var pl = { earth: $("#ipEarth"), mars: $("#ipMars"), moon: $("#ipMoon") };
  var plImg = { earth: pl.earth.firstElementChild, mars: pl.mars.firstElementChild, moon: pl.moon.firstElementChild };
  var flash = $("#iFlash"), cue = $("#iCue"), barProg = $("#barProgress");
  var FLASH = ["255,176,110", "150,190,255", "120,170,255"];   // warm Earth→Mars, cool Mars→Moon, blue Moon→Earth
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  var active = false, raf = 0, lastT = 0, idleSpin = 0, lastKey = "";
  var idleTimer = null, autoRAF = null, autoScrolling = false, lastScrollY = 0, ignoreUntil = 0, lastDir = 1;
  var preloaded = false;

  function span() { return track.offsetHeight - window.innerHeight; }
  function position() {                       // 0 … N-1 (fractional stage index)
    var s = span();
    if (s <= 0) return 0;
    var r = track.getBoundingClientRect();
    return clamp(-r.top / s) * (N - 1);
  }

  /* weight (0…1) of each stage at fractional position x; each stage holds, then cross-fades */
  function stageWeights(x) {
    var w = [], i, d, t;
    for (i = 0; i < N; i++) {
      d = Math.abs(x - i);
      t = clamp((d - 0.18) / 0.64);           // hold ±0.18, gone at ±0.82
      w.push(1 - smooth(t));
    }
    return w;
  }

  function render() {
    var x = position(), p = x / (N - 1);
    var w = stageWeights(x);
    var wE = clamp(w[0] + w[3]), wM = w[1], wL = w[2];

    bg.earth.style.opacity = wE.toFixed(3);
    bg.mars.style.opacity = wM.toFixed(3);
    bg.moon.style.opacity = wL.toFixed(3);

    var ang = p * 420 + idleSpin;
    place("earth", wE, nearest(x, [0, 3]), x, ang);
    place("mars", wM, 1, x, ang * 1.15);
    place("moon", wL, 2, x, ang * 0.9);

    /* a soft flash in the middle of each transition */
    var seg = clamp(Math.floor(x), 0, N - 2), t = x - seg;
    var f = Math.sin(Math.PI * clamp(t)) * 0.5;
    flash.style.opacity = (f * f * 1.1).toFixed(3);
    var key = FLASH[seg];
    if (key !== lastKey) { lastKey = key; flash.style.background = "radial-gradient(70% 55% at 50% 72%, rgba(" + key + ",.55), rgba(" + key + ",0) 70%)"; }

    /* copy */
    var near = Math.round(x);
    slides.forEach(function (el, i) {
      var d = x - i, a = clamp(1 - (Math.abs(d) - 0.1) / 0.24);
      a = smooth(a);
      el.style.opacity = a.toFixed(3);
      el.style.transform = "translateY(" + (-d * 70).toFixed(1) + "px)";
      el.style.filter = a < 0.98 ? "blur(" + ((1 - a) * 6).toFixed(1) + "px)" : "none";
      el.style.visibility = a < 0.01 ? "hidden" : "visible";
      el.style.pointerEvents = a > 0.6 ? "auto" : "none";
      el.setAttribute("aria-hidden", a > 0.5 ? "false" : "true");
    });
    dots.forEach(function (el, i) { el.classList.toggle("is-on", i === near); });
    cue.style.opacity = (1 - clamp(x / 0.25)).toFixed(3);
    if (barProg) barProg.style.transform = "scaleX(" + p.toFixed(4) + ")";
  }

  function nearest(x, list) { return Math.abs(x - list[0]) <= Math.abs(x - list[1]) ? list[0] : list[1]; }

  function place(name, wgt, c, x, ang) {
    var el = pl[name], d = x - c, sc, ty, blur;
    if (d < 0) { sc = 0.9 + 0.1 * wgt; ty = (1 - wgt) * 46; }       // arriving: rises from below
    else       { sc = 1 + (1 - wgt) * 0.12; ty = -(1 - wgt) * 34; }  // leaving: swells and drifts away
    blur = (1 - wgt) * 12;
    el.style.opacity = wgt.toFixed(3);
    el.style.visibility = wgt < 0.005 ? "hidden" : "visible";
    el.style.transform = "translate3d(0," + ty.toFixed(1) + "px,0) scale(" + sc.toFixed(4) + ")";
    el.style.filter = blur > 0.2 ? "blur(" + blur.toFixed(1) + "px)" : "none";
    plImg[name].style.transform = "rotate(" + ang.toFixed(2) + "deg)";
  }

  function loop(now) {
    if (!active) return;
    if (!reduce) { idleSpin += Math.min(now - lastT, 64) * 0.0035; }   // very slow drift so the planet never looks frozen
    lastT = now;
    render();
    raf = requestAnimationFrame(loop);
  }

  /* ---------- snapping: finish the stage the reader was heading to ---------- */
  function scrollToStage(i, fast) {
    var s = span(); if (s <= 0) return;
    var startY = window.pageYOffset, endY = (i / (N - 1)) * s, dist = Math.abs(endY - startY);
    if (dist < 3) return;
    var dur = clamp(700 + dist * 0.9, 800, fast ? 1600 : 2600), t0 = performance.now();
    autoScrolling = true;
    cancelAnimationFrame(autoRAF);
    autoRAF = requestAnimationFrame(function step(now) {
      var k = clamp((now - t0) / dur);
      window.scrollTo(0, startY + (endY - startY) * easeIO(k));
      if (k < 1) autoRAF = requestAnimationFrame(step); else endAuto();
    });
  }
  function endAuto() {
    cancelAnimationFrame(autoRAF); autoRAF = null; autoScrolling = false;
    ignoreUntil = performance.now() + 250; lastScrollY = window.pageYOffset;
  }
  function snap() {
    if (!active || autoScrolling) return;
    var x = position();
    var target = lastDir > 0 ? Math.ceil(x - 0.14) : Math.floor(x + 0.14);
    scrollToStage(clamp(target, 0, N - 1), false);
  }

  function onScroll() {
    if (!active) return;
    var y = window.pageYOffset;
    if (autoScrolling || performance.now() < ignoreUntil) { lastScrollY = y; return; }
    var dy = y - lastScrollY; lastScrollY = y;
    if (!dy) return;
    lastDir = dy > 0 ? 1 : -1;
    clearTimeout(idleTimer);
    idleTimer = setTimeout(snap, 130);
  }
  function interrupt() {
    if (!active) return;
    clearTimeout(idleTimer);
    if (autoScrolling) endAuto();
    ignoreUntil = 0;
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  ["wheel", "touchstart"].forEach(function (ev) { window.addEventListener(ev, interrupt, { passive: true }); });

  window.addEventListener("keydown", function (e) {
    if (!active) return;
    var k = e.key, cur = Math.round(position()), to = null;
    if (k === "ArrowDown" || k === "PageDown" || k === " ") to = cur + 1;
    else if (k === "ArrowUp" || k === "PageUp") to = cur - 1;
    else if (k === "Home") to = 0;
    else if (k === "End") to = N - 1;
    if (to === null) return;
    if ((e.target.tagName === "BUTTON" || e.target.tagName === "A") && k === " ") return;
    e.preventDefault();
    clearTimeout(idleTimer);
    scrollToStage(clamp(to, 0, N - 1), true);
  });

  /* ---------- preload so the first frame is never empty ---------- */
  function preload(onProgress) {
    if (preloaded) { onProgress && onProgress(1); return Promise.resolve(); }
    var urls = [].slice.call(root.querySelectorAll(".iplanet img")).map(function (i) { return i.src; });
    ["bg-earth", "bg-mars", "bg-moon"].forEach(function (n) { urls.push(new URL("assets/" + n + ".jpg", document.baseURI).href); });
    var done = 0;
    return Promise.all(urls.map(function (u) {
      return new Promise(function (res) {
        var im = new Image();
        im.onload = im.onerror = function () { done++; onProgress && onProgress(done / urls.length); res(); };
        im.src = u;
      });
    })).then(function () { preloaded = true; });
  }

  window.TN_INTRO = {
    enter: function (onProgress) {
      return preload(onProgress).then(function () {
        if (active) return;
        active = true; lastT = performance.now(); lastKey = "";
        lastScrollY = window.pageYOffset; lastDir = 1; ignoreUntil = 0;
        render();
        raf = requestAnimationFrame(loop);
      });
    },
    leave: function () {
      active = false; cancelAnimationFrame(raf);
      clearTimeout(idleTimer); cancelAnimationFrame(autoRAF); autoScrolling = false;
    },
    isActive: function () { return active; }
  };

  window.addEventListener("resize", function () { if (active) render(); });
})();
