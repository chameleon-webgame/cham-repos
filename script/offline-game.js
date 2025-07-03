document.addEventListener("DOMContentLoaded", () => {
  // === Локализация ===
  const translations = {
    en: {
      player: "PLAYER",
      chameleon: "You are a CHAMELEON",
      topic: "Topic",
      playAgain: "Play Again",
      endGame: "End Game",
      confirmEnd: "Are you sure you want to end the game?"
    },
    ru: {
      player: "ИГРОК",
      chameleon: "Вы — ХАМЕЛЕОН",
      topic: "Тема",
      playAgain: "Играть снова",
      endGame: "Завершить игру",
      confirmEnd: "Вы точно хотите завершить игру?"
    }
  };

  const currentLang = localStorage.getItem("lang") || "en";

  // === Кнопка назад и тема ===
  const backBtn = document.getElementById("back-button");
  const backIcon = backBtn?.querySelector("img");
  const currentTheme = localStorage.getItem("theme") || "dark";
  if (backBtn) {
    backIcon.src = currentTheme === "dark" ? "img/back.png" : "img/back2.png";
    backBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const confirmBack = confirm(translations[currentLang].confirmEnd);
      if (confirmBack) {
        window.history.back();
      }
    });
  }

  // === Данные игры ===
  const gameData = JSON.parse(sessionStorage.getItem("gameData"));
  if (!gameData) {
    location.href = "offline.html";
  }

  const container = document.getElementById("cards");
  const topicWord = gameData.word || "WORD";

  // === Карточки ===
  [...gameData.roles].reverse().forEach((role, index) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.style.zIndex = index + 1;

    if (role === "хамелеон") {
      card.classList.add("chameleon-card");
    }

    const playerLine = `
      <div class="player-line">
        <span class="player-text">${translations[currentLang].player}</span>
        <span class="player-number">№ ${gameData.roles.length - index}</span>
      </div>`;

    const wordLine = role === "хамелеон"
      ? `<p class="chameleon-label">${translations[currentLang].chameleon}</p>`
      : `<p>${topicWord}</p>`;

    const topicLine = `<p>${translations[currentLang].topic}: ${gameData.topic}</p>`;

    // === Добавляем cover сверху ===
    card.innerHTML = `
      <div class="cover"></div>
      <div class="card-content">
        ${playerLine}
        ${wordLine}
        ${topicLine}
      </div>
    `;

    container.appendChild(card);

    // === Логика открытия карточки ===
    const cover = card.querySelector(".cover");
    cover.addEventListener("click", (e) => {
      cover.classList.add("hidden");
      e.stopPropagation();
    });
  });

  container.querySelectorAll('.card').forEach(card => {
    const cover = card.querySelector(".cover");

    let startX = 0;
    let currentX = 0;

    card.addEventListener('touchstart', e => {
      if (!cover.classList.contains("hidden")) return;
      startX = e.touches[0].clientX;
    });

    card.addEventListener('touchmove', e => {
      if (!cover.classList.contains("hidden")) return;
      currentX = e.touches[0].clientX;
      const diffX = currentX - startX;
      card.style.transform = `translateX(${diffX}px) rotate(${diffX/20}deg)`;
    });

    card.addEventListener('touchend', () => {
      if (!cover.classList.contains("hidden")) return;
      const diffX = currentX - startX;
      if (Math.abs(diffX) > 50) {
        if (diffX > 0) {
          card.classList.add('swipe-right');
        } else {
          card.classList.add('swipe-left');
        }
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
        card.style.transform = `translateX(${diffX}px) rotate(${diffX/20}deg)`;
      };
      const onMouseUp = () => {
        if (!cover.classList.contains("hidden")) return;
        const diffX = currentX - startX;
        if (Math.abs(diffX) > 50) {
          if (diffX > 0) {
            card.classList.add('swipe-right');
          } else {
            card.classList.add('swipe-left');
          }
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

  // === Обработчики финальных кнопок ===
  document.getElementById("restart-button").textContent = translations[currentLang].playAgain;
  document.getElementById("end-game-btn").textContent = translations[currentLang].endGame;

  document.getElementById("restart-button").addEventListener("click", () => {
    location.reload();
  });

  document.getElementById("end-game-btn").addEventListener("click", () => {
    const confirmEnd = confirm(translations[currentLang].confirmEnd);
    if (confirmEnd) {
      window.location.href = "index.html";
    }
  });


});
