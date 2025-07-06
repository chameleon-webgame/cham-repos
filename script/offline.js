document.addEventListener("DOMContentLoaded", () => {
  // === Тема и перевод ===
  const backBtn = document.getElementById("back-button");
  const backIcon = backBtn?.querySelector("img");
  const currentTheme = localStorage.getItem("theme") || "dark";
  if (backIcon) {
    backIcon.src = currentTheme === "dark" ? "img/back.png" : "img/back2.png";
  }

  const translations = {
    en: {
      playersLabel: "NUMBER OF PLAYERS:",
      chameleonsLabel: "NUMBER OF CHAMELEONS:",
      geckosLabel: "NUMBER OF GECKOS:",
      startLabel: "START",
    },
    ru: {
      playersLabel: "КОЛИЧЕСТВО ИГРОКОВ:",
      chameleonsLabel: "КОЛИЧЕСТВО ХАМЕЛЕОНОВ:",
      geckosLabel: "КОЛИЧЕСТВО ГЕККОНОВ:",
      startLabel: "НАЧАТЬ",
    },
  };

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

  // === Счётчики ===
  const playerCountEl = document.querySelector(".players-count");
  const chameleonCountEl = document.querySelector(".chameleons-count");
  const geckoCountEl = document.querySelector(".geckos-count");

  let players = 3;
  let chameleons = 1;
  let geckos = 0;

  function updateUI() {
    playerCountEl.textContent = players;
    chameleonCountEl.textContent = chameleons;
    geckoCountEl.textContent = geckos;
  }

  document.querySelector(".plus-p").addEventListener("click", () => {
    players++;
    updateUI();
  });

  document.querySelector(".minus-p").addEventListener("click", () => {
    if (players > 3) {
      players--;
      const maxSpecial = Math.max(1, players - 2);
      while (chameleons + geckos > maxSpecial) {
        if (geckos > 0) {
          geckos--;
        } else if (chameleons > 1) {
          chameleons--;
        }
      }
      if (chameleons + geckos < 1) {
        chameleons = 1;
      }
      updateUI();
    }
  });

  document.querySelector(".plus-c").addEventListener("click", () => {
    const maxSpecial = Math.max(1, players - 2);
    if (chameleons + geckos < maxSpecial) {
      chameleons++;
      updateUI();
    }
  });

  document.querySelector(".minus-c").addEventListener("click", () => {
    if (chameleons > 0 && chameleons + geckos > 1) {
      chameleons--;
      updateUI();
    }
  });

  document.querySelector(".plus-g").addEventListener("click", () => {
    const maxSpecial = Math.max(1, players - 2);
    if (chameleons + geckos < maxSpecial) {
      geckos++;
      updateUI();
    }
  });

  document.querySelector(".minus-g").addEventListener("click", () => {
    if (geckos > 0 && chameleons + geckos > 1) {
      geckos--;
      updateUI();
    }
  });

  document.getElementById("start-button").addEventListener("click", (e) => {
    e.preventDefault();

    fetch("topics.json")
      .then(res => res.json())
      .then(data => {
        const topics = data.topics;

        const randomTopic = topics[Math.floor(Math.random() * topics.length)];
        const randomWord = randomTopic.words[Math.floor(Math.random() * randomTopic.words.length)];

        const roles = Array(players).fill("обычный");
        const geckoWords = new Array(players).fill(null);

        let addedChameleons = 0;
        while (addedChameleons < chameleons) {
          const idx = Math.floor(Math.random() * players);
          if (roles[idx] === "обычный") {
            roles[idx] = "хамелеон";
            addedChameleons++;
          }
        }

        const otherWords = randomTopic.words
          .map(w => w[currentLang])
          .filter(w => w !== randomWord[currentLang]);

        let addedGeckos = 0;
        while (addedGeckos < geckos) {
          const idx = Math.floor(Math.random() * players);
          if (roles[idx] === "обычный") {
            roles[idx] = "геккон";
            geckoWords[idx] = otherWords[Math.floor(Math.random() * otherWords.length)] || "???";
            addedGeckos++;
          }
        }

        const gameData = {
          topic: randomTopic.topic?.[currentLang] || randomTopic.name?.[currentLang],
          word: randomWord[currentLang],
          roles: roles,
          geckoWords: geckoWords
        };

        sessionStorage.setItem("gameData", JSON.stringify(gameData));
        location.href = "offline-game.html";
      })
      .catch(err => {
        alert("Ошибка загрузки списка тем");
        console.error(err);
      });
  });

  updateUI();
});
