document.addEventListener("DOMContentLoaded", () => {
  const backBtn = document.getElementById("openModal2");
  const backIcon = backBtn?.querySelector("img");
  const currentTheme = localStorage.getItem("theme") || "dark";
  if (backIcon) {
    backIcon.src = currentTheme === "dark" ? "img/back.png" : "img/back2.png";
  }
  const translations = {
    en: {
      player: "PLAYER",
      chameleon: "You are a CHAMELEON",
      gecko: "You are a GECKO",
      topic: "Topic",
      playAgain: "Restart",
      finishLabel: "Finish the game",
      confirmEnd: "Are you sure you want to end the game?",
      modalLabel1: "Finish the game?",
      modalLabel2: "No",
      modalLabel3: "Yes",
      modalLabel4: "Go back?",
      modalLabel5: "No",
      modalLabel6: "Yes",
      resultsTitle: "Results",
      chameleonResult: "Chameleon(s):",
      geckoResult: "Gecko(s):",
      wordResult: "Topic word:",
      finalExit: "Finish the game"
    },
    ru: {
      player: "ИГРОК",
      chameleon: "Вы — ХАМЕЛЕОН",
      gecko: "Вы — ГЕККОН",
      topic: "Тема",
      playAgain: "Заново",
      finishLabel: "Завершить игру",
      confirmEnd: "Вы точно хотите завершить игру?",
      modalLabel1: "Завершить игру?",
      modalLabel2: "Нет",
      modalLabel3: "Да",
      modalLabel4: "Вернуться назад?",
      modalLabel5: "Нет",
      modalLabel6: "Да",
      resultsTitle: "Результаты",
      chameleonResult: "Хамелеон(ы):",
      geckoResult: "Геккон(ы):",
      wordResult: "Загаданное слово:",
      finalExit: "Завершить игру"
    }
  };

  const currentLang = localStorage.getItem("lang") || "en";
  const t = translations[currentLang];

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (t[key]) {
      el.textContent = t[key];
    }
  });

  const gameData = JSON.parse(sessionStorage.getItem("gameData"));
  if (!gameData) {
    location.href = "offline.html";
  }

  const container = document.getElementById("cards");
  const topicWord = gameData.word || "WORD";

  [...gameData.roles].reverse().forEach((role, index) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.style.zIndex = index + 1;

    if (role === "хамелеон") card.classList.add("chameleon-card");
    if (role === "геккон") card.classList.add("gecko-card");

    card.innerHTML = `<div class="cover"></div><div class="card-content hidden"></div>`;
    container.appendChild(card);

    const content = card.querySelector(".card-content");
    const cover = card.querySelector(".cover");

    const playerLine = `
      <div class="player-line">
        <span class="player-text">${t.player}</span>
        <span class="player-number">№ ${gameData.roles.length - index}</span>
      </div>`;

    let wordLine = "";
    if (role === "хамелеон") {
      wordLine = `<p class="chameleon-label">${t.chameleon}</p>`;
    } else if (role === "геккон") {
      const geckoWord = gameData.geckoWords?.[gameData.roles.length - 1 - index] || "???";
      wordLine = `
        <div class="gecko-content">
          <p class="gecko-label">${t.gecko}</p>
          <p class="g-word-label">${geckoWord}</p>
        </div>`;
    } else {
      wordLine = `<p class="word-label">${topicWord}</p>`;
    }

    const topicLine = `<p>${t.topic}: ${gameData.topic}</p>`;
    content.innerHTML = `${playerLine}${wordLine}${topicLine}`;

    cover.addEventListener("click", (e) => {
      cover.classList.add("hidden");
      content.classList.remove("hidden");
      e.stopPropagation();
    });
  });

  container.querySelectorAll('.card').forEach(card => {
    const cover = card.querySelector(".cover");
    let startX = 0, currentX = 0;

    card.addEventListener('touchstart', e => {
      if (!cover.classList.contains("hidden")) return;
      startX = e.touches[0].clientX;
    });

    card.addEventListener('touchmove', e => {
      if (!cover.classList.contains("hidden")) return;
      currentX = e.touches[0].clientX;
      const diffX = currentX - startX;
      card.style.transform = `translateX(${diffX}px) rotate(${diffX / 20}deg)`;
    });

    card.addEventListener('touchend', () => {
      if (!cover.classList.contains("hidden")) return;
      const diffX = currentX - startX;
      if (Math.abs(diffX) > 50) {
        card.classList.add(diffX > 0 ? 'swipe-right' : 'swipe-left');
        setTimeout(() => {
          card.remove();
          if (container.querySelectorAll('.card').length === 0) {
            document.getElementById("end-screen").classList.remove("hidden");
          }
        }, 300);
      } else {
        card.style.transform = '';
      }
    });

    card.addEventListener('mousedown', e => {
      if (!cover.classList.contains("hidden")) return;
      startX = e.clientX;
      const onMouseMove = e => {
        currentX = e.clientX;
        const diffX = currentX - startX;
        card.style.transform = `translateX(${diffX}px) rotate(${diffX / 20}deg)`;
      };
      const onMouseUp = () => {
        if (!cover.classList.contains("hidden")) return;
        const diffX = currentX - startX;
        if (Math.abs(diffX) > 50) {
          card.classList.add(diffX > 0 ? 'swipe-right' : 'swipe-left');
          setTimeout(() => {
            card.remove();
            if (container.querySelectorAll('.card').length === 0) {
              document.getElementById("end-screen").classList.remove("hidden");
            }
          }, 300);
        } else {
          card.style.transform = '';
        }
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    });
  });

  document.getElementById("restart-button").addEventListener("click", () => {
    location.reload();
  });

  // Модалка «Завершить игру»
  const modal = document.getElementById('centerModal');
  const openBtn = document.getElementById('openModal');
  const closeBtn = document.getElementById('closeModal');
  const confirmEndBtn = document.getElementById('confirmEnd');

  if (openBtn && modal && closeBtn && confirmEndBtn) {
    openBtn.addEventListener('click', () => {
      modal.classList.add('open');
    });

    closeBtn.addEventListener('click', () => {
      modal.classList.remove('open');
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('open');
      }
    });

    confirmEndBtn.addEventListener('click', () => {
      // Скрыть end-screen
      document.getElementById('end-screen').classList.add('hidden');
      // Показать результаты
      document.getElementById('results').classList.remove('hidden');
      modal.classList.remove('open');

      // Заполнить результаты
      const chameleons = [];
    const geckos = [];

    gameData.roles.forEach((role, index) => {
      const playerNumber = index + 1;
      if (role === "хамелеон") chameleons.push(`${t.player} №${playerNumber}`);
      if (role === "геккон") geckos.push(`${t.player} №${playerNumber}`);
    });

    // Заполнить текст
    document.getElementById("chameleon-result-title").textContent = `${t.chameleonResult}`;
document.getElementById("gecko-result-title").textContent = `${t.geckoResult}`;

// Генерируем список построчно
const chamList = document.getElementById("chameleon-list");
const geckList = document.getElementById("gecko-list");

chamList.innerHTML = chameleons.length 
  ? chameleons.map(p => `<p>${p}</p>`).join('')
  : `<p>-</p>`;

geckList.innerHTML = geckos.length 
  ? geckos.map(p => `<p>${p}</p>`).join('')
  : `<p>-</p>`;
    document.getElementById("word-result").textContent = `${t.wordResult} ${gameData.word || '-'}`;
  });
  }

  // Модалка «Назад»
  const modal2 = document.getElementById('centerModal2');
  const openBtn2 = document.getElementById('openModal2');
  const closeBtn2 = document.getElementById('closeModal2');

  if (openBtn2 && modal2 && closeBtn2) {
    openBtn2.addEventListener('click', () => {
      modal2.classList.add('open');
    });

    closeBtn2.addEventListener('click', () => {
      modal2.classList.remove('open');
    });

    modal2.addEventListener('click', (e) => {
      if (e.target === modal2) {
        modal2.classList.remove('open');
      }
    });
  }
});
