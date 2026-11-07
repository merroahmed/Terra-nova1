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
      "msg.reset": "If an account exists for this email, reset instructions will be sent.",
      "snav.about": "About",
      "about.eyebrow": "About", "about.title": "Different Worlds. Connected Through Earth.",
      "about.lead": "Discover real places on Earth that help us understand the Moon and Mars. Explore their similarities and uncover the science behind them.",
      "about.earth.name": "Earth", "about.earth.text": "Our starting point: a living laboratory of landscapes.",
      "about.mars.name": "Mars", "about.mars.text": "The challenge: places on Earth help us prepare to explore it.",
      "about.moon.name": "Moon", "about.moon.text": "The connection: craters and volcanic terrain we can study at home.",
      "hero.guest": "Start without an account",
      "brand.name": "Terra Nova",
      "snav.home": "Home", "snav.language": "Language", "snav.profile": "Profile",
      "intro.skip": "Skip", "intro.enter": "Enter",
      "intro.s1.eyebrow": "Earth — The Beginning",
      "intro.s1.title": "Can Earth Help Us Explore Other Worlds?",
      "intro.s1.text": "Earth is full of unique landscapes that may hold clues to understanding other planets. What if the answers to space exploration are closer than we think?",
      "intro.s2.eyebrow": "Mars — The Challenge",
      "intro.s2.title": "How Can We Prepare for Mars?",
      "intro.s2.text": "Mars is a challenging world to explore. But some places on Earth share similar geological features, helping scientists study its environment and prepare for future missions.",
      "intro.s3.eyebrow": "Moon — The Connection",
      "intro.s3.title": "What Can Earth Teach Us About the Moon?",
      "intro.s3.text": "From impact craters to volcanic landscapes, Earth offers natural examples that help us understand the Moon and its surface.",
      "intro.s4.eyebrow": "ANALOG — The Solution",
      "intro.s4.title": "Different Worlds. Connected Through Earth.",
      "intro.s4.text": "Discover real places on Earth that help us understand the Moon and Mars. Explore their similarities and uncover the science behind them.",
      "intro.s4.tag": "Explore Earth. Understand Space.",
      "profile.title": "Profile", "profile.username": "Username", "profile.email": "Email", "profile.back": "Back to home"
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
      "msg.reset": "Si un compte existe pour cet e-mail, les instructions de réinitialisation seront envoyées.",
      "snav.about": "À propos",
      "about.eyebrow": "À propos", "about.title": "Des mondes différents. Reliés par la Terre.",
      "about.lead": "Découvrez de véritables lieux sur Terre qui nous aident à comprendre la Lune et Mars. Explorez leurs similitudes et découvrez la science qui les sous-tend.",
      "about.earth.name": "Terre", "about.earth.text": "Notre point de départ : un laboratoire vivant de paysages.",
      "about.mars.name": "Mars", "about.mars.text": "Le défi : des lieux sur Terre nous aident à préparer son exploration.",
      "about.moon.name": "Lune", "about.moon.text": "Le lien : cratères et terrains volcaniques à étudier chez nous.",
      "hero.guest": "Commencer sans compte",
      "brand.name": "Terra Nova",
      "snav.home": "Accueil", "snav.language": "Langue", "snav.profile": "Profil",
      "intro.skip": "Passer", "intro.enter": "Entrer",
      "intro.s1.eyebrow": "Terre — Le commencement",
      "intro.s1.title": "La Terre peut-elle nous aider à explorer d’autres mondes ?",
      "intro.s1.text": "La Terre regorge de paysages uniques qui pourraient receler des indices pour comprendre d’autres planètes. Et si les réponses à l’exploration spatiale étaient plus proches que nous le pensons ?",
      "intro.s2.eyebrow": "Mars — Le défi",
      "intro.s2.title": "Comment se préparer à Mars ?",
      "intro.s2.text": "Mars est un monde difficile à explorer. Mais certains lieux sur Terre partagent des caractéristiques géologiques similaires, ce qui aide les scientifiques à étudier son environnement et à préparer les futures missions.",
      "intro.s3.eyebrow": "Lune — Le lien",
      "intro.s3.title": "Que peut nous apprendre la Terre sur la Lune ?",
      "intro.s3.text": "Des cratères d’impact aux paysages volcaniques, la Terre offre des exemples naturels qui nous aident à comprendre la Lune et sa surface.",
      "intro.s4.eyebrow": "ANALOG — La solution",
      "intro.s4.title": "Des mondes différents. Reliés par la Terre.",
      "intro.s4.text": "Découvrez de véritables lieux sur Terre qui nous aident à comprendre la Lune et Mars. Explorez leurs similitudes et découvrez la science qui les sous-tend.",
      "intro.s4.tag": "Explorez la Terre. Comprenez l’espace.",
      "profile.title": "Profil", "profile.username": "Nom d’utilisateur", "profile.email": "E-mail", "profile.back": "Retour à l’accueil"
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
      "msg.reset": "إذا كان هناك حساب بهذا البريد، فستصلك تعليمات إعادة التعيين.",
      "snav.about": "عن الموقع",
      "about.eyebrow": "عن الموقع", "about.title": "عوالم مختلفة. تربطها الأرض.",
      "about.lead": "اكتشف أماكن حقيقية على الأرض تساعدنا على فهم القمر والمريخ. تعرّف على أوجه التشابه بينها واكشف العلم الكامن وراءها.",
      "about.earth.name": "الأرض", "about.earth.text": "نقطة انطلاقنا: مختبر حيّ من التضاريس.",
      "about.mars.name": "المريخ", "about.mars.text": "التحدي: أماكن على الأرض تساعدنا على الاستعداد لاستكشافه.",
      "about.moon.name": "القمر", "about.moon.text": "الصلة: فوهات وتضاريس بركانية يمكننا دراستها هنا.",
      "hero.guest": "ابدأ بدون حساب",
      "brand.name": "تيرا نوفا",
      "snav.home": "الرئيسية", "snav.language": "اللغة", "snav.profile": "الملف الشخصي",
      "intro.skip": "تخطّي", "intro.enter": "ادخل",
      "intro.s1.eyebrow": "الأرض — البداية",
      "intro.s1.title": "هل تستطيع الأرض مساعدتنا في استكشاف عوالم أخرى؟",
      "intro.s1.text": "الأرض مليئة بتضاريس فريدة قد تحمل مفاتيح لفهم الكواكب الأخرى. فماذا لو كانت إجابات استكشاف الفضاء أقرب مما نظن؟",
      "intro.s2.eyebrow": "المريخ — التحدي",
      "intro.s2.title": "كيف نستعد للمريخ؟",
      "intro.s2.text": "المريخ عالم صعب الاستكشاف. لكن توجد أماكن على الأرض تشترك معه في خصائص جيولوجية مشابهة، مما يساعد العلماء على دراسة بيئته والاستعداد للمهام المستقبلية.",
      "intro.s3.eyebrow": "القمر — الصلة",
      "intro.s3.title": "ماذا تستطيع الأرض أن تعلّمنا عن القمر؟",
      "intro.s3.text": "من فوهات الارتطام إلى المناظر البركانية، تقدّم الأرض أمثلة طبيعية تساعدنا على فهم القمر وسطحه.",
      "intro.s4.eyebrow": "أنالوج — الحل",
      "intro.s4.title": "عوالم مختلفة. تربطها الأرض.",
      "intro.s4.text": "اكتشف أماكن حقيقية على الأرض تساعدنا على فهم القمر والمريخ. تعرّف على أوجه التشابه بينها واكشف العلم الكامن وراءها.",
      "intro.s4.tag": "استكشف الأرض. افهم الفضاء.",
      "profile.title": "الملف الشخصي", "profile.username": "اسم المستخدم", "profile.email": "البريد الإلكتروني", "profile.back": "العودة إلى الرئيسية"
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
    document.querySelectorAll("[data-i18n-aria]").forEach(function (el) { var v = d[el.getAttribute("data-i18n-aria")]; if (v) el.setAttribute("aria-label", v); });
    document.querySelectorAll("[data-i18n-lines]").forEach(function (el) { var v = d[el.getAttribute("data-i18n-lines")]; if (v) buildLines(el, v); });
    document.title = d["doc.title"];
    var code = document.getElementById("langCode"); if (code) code.textContent = CODES[lang];
    document.querySelectorAll(".lang__menu [data-lang], .snav__menu [data-lang]").forEach(function (b) { b.setAttribute("aria-selected", b.getAttribute("data-lang") === lang ? "true" : "false"); });
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
