document.addEventListener("DOMContentLoaded", () => {

  // === ТЕМА И НАЗАД КНОПКА ===
  const backBtn = document.getElementById("back-button");
  const backIcon = backBtn?.querySelector("img");
  const currentTheme = localStorage.getItem("theme") || "dark";
  if (backIcon) {
    backIcon.src = currentTheme === "dark" ? "img/back.png" : "img/back2.png";
  }

  // === ПЕРЕВОДЫ ===
  const translations = {
    ru: {
      formTitle: "Предложить свою тему",
      labelTheme: "Тема:",
      placeholderTheme: "Фрукты",
      labelWords: "Слова:",
      placeholderWords: `Банан
Яблоко
Апельсин
. . .
. .
.`,
      submitBtn: "Отправить"
    },
    en: {
      formTitle: "Suggest Your Theme",
      labelTheme: "Theme:",
      placeholderTheme: "Fruits",
      labelWords: "Words:",
      placeholderWords: `Banana
Apple
Orange
. . .
. .
.`,
      submitBtn: "Send"
    }
  };

  const currentLang = localStorage.getItem("lang") || "en";
  applyLang(currentLang);

  function applyLang(lang) {
  // Перевод текста
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (translations[lang][key]) {
      el.textContent = translations[lang][key];
    }
  });

  // Перевод плейсхолдеров
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (translations[lang][key]) {
      el.setAttribute("placeholder", translations[lang][key]);
    }
  });
}

});