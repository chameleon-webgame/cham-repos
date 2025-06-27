document.addEventListener("DOMContentLoaded", () => {

  document
  .querySelector('meta[name="theme-color"]')
  .setAttribute("content", "#0A0A0A");
  // === ЯЗЫКОВОЙ СЛОВАРЬ ===
  const translations = {
    en: {
      onlineBtn: "ONLINE",
      offlineBtn: "OFFLINE",
      howToPlayBtn: "GAME RULES",
    },
    ru: {
      onlineBtn: "ОНЛАЙН",
      offlineBtn: "ОФЛАЙН",
      howToPlayBtn: "ПРАВИЛА ИГРЫ",
    },
  };

  // === КНОПКА ТЕМЫ ===
  const themeBtn = document.getElementById("theme-toggle");
  const themeIcon = themeBtn.querySelector("img");

  // === КНОПКА ЯЗЫКА ===
  const langBtn = document.getElementById("lang-toggle");
  const langIcon = langBtn.querySelector("img");


  // === НАСТРОЙКИ ПО УМОЛЧАНИЮ ===
  let currentTheme = localStorage.getItem("theme") || "dark";
  let currentLang = localStorage.getItem("lang") || "en";

  // === ПРИМЕНИТЬ ТЕМУ И ЯЗЫК ===
  applyTheme(currentTheme);
  applyLang(currentLang);

  // === ОБРАБОТЧИК СМЕНЫ ТЕМЫ ===
  themeBtn.addEventListener("click", () => {
    currentTheme = currentTheme === "dark" ? "light" : "dark";
    localStorage.setItem("theme", currentTheme);
    applyTheme(currentTheme);
    updateLanguageIcon(currentLang, currentTheme); // обновим иконку языка после смены темы
  });

  // === ОБРАБОТЧИК СМЕНЫ ЯЗЫКА ===
  langBtn.addEventListener("click", () => {
    currentLang = currentLang === "en" ? "ru" : "en";
    localStorage.setItem("lang", currentLang);
    applyLang(currentLang);
  });

  // === ПРИМЕНИТЬ ТЕМУ ===
  function applyTheme(theme) {
    document.body.classList.remove("light", "dark");
    document.body.classList.add(theme);
    themeIcon.src = theme === "dark" ? "img/sun.png" : "img/moon2.png";
    updateLanguageIcon(currentLang, theme);

    
    const themeMetaTag = document.querySelector('meta[name="theme-color"]');
    if (themeMetaTag) {
        themeMetaTag.setAttribute("content", "#0A0A0A");
    }
  }

  // === ПРИМЕНИТЬ ЯЗЫК ===
  function applyLang(lang) {
    updateLanguageIcon(lang, currentTheme);
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      if (translations[lang][key]) {
        el.textContent = translations[lang][key];
      }
    });
  }

  // === СМЕНА ИКОНКИ ЯЗЫКА В ЗАВИСИМОСТИ ОТ ТЕМЫ ===
  function updateLanguageIcon(lang, theme) {
    if (lang === "ru") {
      langIcon.src = theme === "dark" ? "/cham-repos/img/EN.png" : "/cham-repos/img/EN1.png";
    } else {
      langIcon.src = theme === "dark" ? "/cham-repos/img/RU.png" : "/cham-repos/img/RU1.png";
    }
  }

  // === РЕГИСТРАЦИЯ SERVICE WORKER ===
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
      .then(reg => console.log('✅ Service Worker зарегистрирован:', reg.scope))
      .catch(err => console.error('❌ Ошибка регистрации Service Worker:', err));
  }
});
