document.addEventListener("DOMContentLoaded", () => {
  
  // === ТЕМА И НАЗАД КНОПКА ===
  const backBtn = document.getElementById("back-button");
  const backIcon = backBtn?.querySelector("img");
  const currentTheme = localStorage.getItem("theme") || "dark";
  if (backIcon) {
    backIcon.src = currentTheme === "dark" ? "img/back.png" : "img/back2.png";
  }

  // === ПЕРЕВОДЫ (должны быть объявлены раньше, чем applyLang) ===
  const translations = {
    en: {
      oopsLabel: "Online game mode is not working yet . . .",
    },
    ru: {
      oopsLabel: "Онлайн режим пока что не работает . . .",
    },
  };

  // === ЯЗЫК ===
  const currentLang = localStorage.getItem("lang") || "en";
  applyLang(currentLang);

  function applyLang(lang) {
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      if (translations[lang][key]) {
        el.textContent = translations[lang][key];
      }
    });
  }
  updateUI();
});
  
