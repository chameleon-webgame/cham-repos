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
      playersLabel: "NUMBER OF PLAYERS:",
      chameleonsLabel: "NUMBER OF CHAMELEONS:",
      startLabel: "START",
    },
    ru: {
      playersLabel: "КОЛИЧЕСТВО ИГРОКОВ:",
      chameleonsLabel: "КОЛИЧЕСТВО ХАМЕЛЕОНОВ:",
      startLabel: "НАЧАТЬ",
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

  // === СЧЁТЧИКИ ===
  const playerCountEl = document.querySelector(".players-count");
  const chameleonCountEl = document.querySelector(".chameleons-count");

  const playerControls = document.querySelector(".contain2-1");
  const chameleonControls = document.querySelector(".contain2-2");

  let players = 3;
  let chameleons = 1;

  function updateUI() {
    playerCountEl.textContent = players;
    chameleonCountEl.textContent = chameleons;
  }

  playerControls.querySelector(".plus").addEventListener("click", () => {
    players++;
    updateUI();
  });

  playerControls.querySelector(".minus").addEventListener("click", () => {
    if (players > 3) {
      players--;
      if (chameleons >= players) {
        chameleons = players - 1;
        if (chameleons < 1) chameleons = 1;
      }
      updateUI();
    }
  });

  chameleonControls.querySelector(".plus").addEventListener("click", () => {
    if (chameleons < players - 1) {
      chameleons++;
      updateUI();
    }
  });

  chameleonControls.querySelector(".minus").addEventListener("click", () => {
    if (chameleons > 1) {
      chameleons--;
      updateUI();
    }
  });

  updateUI();
});
