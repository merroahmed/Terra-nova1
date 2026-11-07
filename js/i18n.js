/* Terra Nova — English / Français / العربية */
(function () {
  var DICT = {
    en: {
      "doc.title": "Terra Nova",
      "nav.login": "Login", "nav.signup": "Sign up", "nav.logout": "Log out",
      "scroll": "Scroll",
      "hero.title": "Discover Earth’s|Hidden Worlds.",
      "hero.text": "Explore extraordinary places on Earth that mirror the landscapes of the Moon and Mars. Uncover the similarities, discover their scientific significance, and experience the wonders of planetary exploration — right here on Earth.",
      "hero.cta": "Start exploring",
      "auth.welcome": "Welcome",
      "auth.login.title": "Login", "auth.signup.title": "Sign up",
      "auth.name": "Full name", "auth.email": "Email", "auth.password": "Password",
      "auth.forgot": "Forgot password?",
      "auth.login.btn": "Login", "auth.signup.btn": "Create account",
      "auth.noacct": "Don’t have an account?", "auth.signuplink": "Sign up",
      "auth.haveacct": "Already have an account?", "auth.loginlink": "Login",
      "msg.email": "Enter a valid email address.",
      "msg.pass": "Password must be at least 6 characters.",
      "msg.name": "Enter your name.",
      "msg.exists": "An account with this email already exists. Try logging in.",
      "msg.wrong": "Email or password is incorrect.",
      "msg.created": "Account created. Welcome aboard!",
      "msg.loggedin": "Logged in. Welcome back!",
      "msg.reset": "If an account exists for this email, reset instructions will be sent."
    },
    fr: {
      "doc.title": "Terra Nova",
      "nav.login": "Connexion", "nav.signup": "Inscription", "nav.logout": "Déconnexion",
      "scroll": "Défiler",
      "hero.title": "Découvrez les mondes|cachés de la Terre.",
      "hero.text": "Explorez des lieux extraordinaires sur Terre qui reflètent les paysages de la Lune et de Mars. Découvrez leurs similitudes, comprenez leur importance scientifique et vivez les merveilles de l’exploration planétaire, ici même sur Terre.",
      "hero.cta": "Commencer l’exploration",
      "auth.welcome": "Bienvenue",
      "auth.login.title": "Connexion", "auth.signup.title": "Inscription",
      "auth.name": "Nom complet", "auth.email": "E-mail", "auth.password": "Mot de passe",
      "auth.forgot": "Mot de passe oublié ?",
      "auth.login.btn": "Se connecter", "auth.signup.btn": "Créer un compte",
      "auth.noacct": "Vous n’avez pas de compte ?", "auth.signuplink": "S’inscrire",
      "auth.haveacct": "Vous avez déjà un compte ?", "auth.loginlink": "Se connecter",
      "msg.email": "Saisissez une adresse e-mail valide.",
      "msg.pass": "Le mot de passe doit contenir au moins 6 caractères.",
      "msg.name": "Saisissez votre nom.",
      "msg.exists": "Un compte existe déjà avec cet e-mail. Essayez de vous connecter.",
      "msg.wrong": "E-mail ou mot de passe incorrect.",
      "msg.created": "Compte créé. Bienvenue à bord !",
      "msg.loggedin": "Connecté. Content de vous revoir !",
      "msg.reset": "Si un compte existe pour cet e-mail, les instructions de réinitialisation seront envoyées."
    },
    ar: {
      "doc.title": "تيرا نوفا",
      "nav.login": "تسجيل الدخول", "nav.signup": "إنشاء حساب", "nav.logout": "تسجيل الخروج",
      "scroll": "مرّر للأسفل",
      "hero.title": "اكتشف عوالم|الأرض الخفية.",
      "hero.text": "استكشف أماكن استثنائية على الأرض تحاكي تضاريس القمر والمريخ. اكتشف أوجه التشابه، وتعرّف على أهميتها العلمية، وعِش عجائب استكشاف الكواكب هنا على كوكب الأرض.",
      "hero.cta": "ابدأ الاستكشاف",
      "auth.welcome": "أهلاً بك",
      "auth.login.title": "تسجيل الدخول", "auth.signup.title": "إنشاء حساب",
      "auth.name": "الاسم الكامل", "auth.email": "البريد الإلكتروني", "auth.password": "كلمة المرور",
      "auth.forgot": "نسيت كلمة المرور؟",
      "auth.login.btn": "دخول", "auth.signup.btn": "إنشاء الحساب",
      "auth.noacct": "ليس لديك حساب؟", "auth.signuplink": "أنشئ حساباً",
      "auth.haveacct": "لديك حساب بالفعل؟", "auth.loginlink": "تسجيل الدخول",
      "msg.email": "أدخل بريداً إلكترونياً صحيحاً.",
      "msg.pass": "يجب ألا تقل كلمة المرور عن 6 أحرف.",
      "msg.name": "أدخل اسمك.",
      "msg.exists": "يوجد حساب بهذا البريد بالفعل. جرّب تسجيل الدخول.",
      "msg.wrong": "البريد الإلكتروني أو كلمة المرور غير صحيحة.",
      "msg.created": "تم إنشاء الحساب. أهلاً بك!",
      "msg.loggedin": "تم تسجيل الدخول. مرحباً بعودتك!",
      "msg.reset": "إذا كان هناك حساب بهذا البريد، فستصلك تعليمات إعادة التعيين."
    }
  };
  var CODES = { en: "EN", fr: "FR", ar: "AR" };
  var current = "en";

  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) {} return null; }

  function buildLines(el, text) {
    el.textContent = "";
    text.split("|").forEach(function (part, i, all) {
      var line = document.createElement("span");
      line.className = "line" + (i === all.length - 1 ? " line--accent" : "");
      var inner = document.createElement("span");
      inner.textContent = part;
      line.appendChild(inner);
      el.appendChild(line);
    });
  }

  function apply(lang) {
    if (!DICT[lang]) lang = "en";
    current = lang;
    var root = document.documentElement;
    root.lang = lang;
    root.dir = lang === "ar" ? "rtl" : "ltr";
    var d = DICT[lang];
    document.querySelectorAll("[data-i18n]").forEach(function (el) { var v = d[el.getAttribute("data-i18n")]; if (v) el.textContent = v; });
    document.querySelectorAll("[data-i18n-ph]").forEach(function (el) { var v = d[el.getAttribute("data-i18n-ph")]; if (v) { el.placeholder = v; el.setAttribute("aria-label", v); } });
    document.querySelectorAll("[data-i18n-lines]").forEach(function (el) { var v = d[el.getAttribute("data-i18n-lines")]; if (v) buildLines(el, v); });
    document.title = d["doc.title"];
    var code = document.getElementById("langCode"); if (code) code.textContent = CODES[lang];
    document.querySelectorAll("#langMenu [data-lang]").forEach(function (b) { b.setAttribute("aria-selected", b.getAttribute("data-lang") === lang ? "true" : "false"); });
    store("tn_lang", lang);
    document.dispatchEvent(new CustomEvent("tn:lang", { detail: lang }));
  }

  function initial() {
    var saved = store("tn_lang");
    if (saved && DICT[saved]) return saved;
    var nav = (navigator.language || "en").slice(0, 2).toLowerCase();
    return DICT[nav] ? nav : "en";
  }

  window.TN_I18N = {
    t: function (k) { return (DICT[current] && DICT[current][k]) || DICT.en[k] || k; },
    set: apply,
    get: function () { return current; },
    init: function () { apply(initial()); }
  };
})();
