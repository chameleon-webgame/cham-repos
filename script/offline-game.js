document.addEventListener("DOMContentLoaded", () => {
  const translations = {
    en: {
      player: "PLAYER",
      chameleon: "You are a CHAMELEON",
      gecko: "You are a GECKO",
      topic: "Topic",
      playAgain: "Restart",
      endGame: "Finish the game",
      confirmEnd: "Are you sure you want to end the game?"
    },
    ru: {
      player: "ИГРОК",
      chameleon: "Вы — ХАМЕЛЕОН",
      gecko: "Вы — ГЕККОН",
      topic: "Тема",
      playAgain: "Заново",
      endGame: "Завершить игру",
      confirmEnd: "Вы точно хотите завершить игру?"
    }
  };

  const currentLang = localStorage.getItem("lang") || "en";
  const t = translations[currentLang];

  const backBtn = document.getElementById("back-button");
  const backIcon = backBtn?.querySelector("img");
  const currentTheme = localStorage.getItem("theme") || "dark";
  if (backBtn) {
    backIcon.src = currentTheme === "dark" ? "img/back.png" : "img/back2.png";
    backBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const confirmBack = confirm(t.confirmEnd);
      if (confirmBack) {
        window.history.back();
      }
    });
  }

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
  </div>
`;
;
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

  document.getElementById("restart-button").textContent = t.playAgain;
  document.getElementById("end-game-btn").textContent = t.endGame;

  document.getElementById("restart-button").addEventListener("click", () => {
    location.reload();
  });

  document.getElementById("end-game-btn").addEventListener("click", () => {
    if (confirm(t.confirmEnd)) {
      location.href = "index.html";
    }
  });
});
