document.addEventListener("DOMContentLoaded", () => {
  // === ТЕМА И НАЗАД КНОПКА ===
  const backBtn = document.getElementById("back-button");
  const backIcon = backBtn?.querySelector("img");
  const currentTheme = localStorage.getItem("theme") || "dark";
  if (backIcon) {
    backIcon.src = currentTheme === "dark" ? "img/back.png" : "img/back2.png";
  }

  const gameData = JSON.parse(sessionStorage.getItem("gameData"));
  if (!gameData) {
    location.href = "offline.html";
  }

  console.log(gameData);

  const container = document.getElementById("cards");

  const topicWord = gameData.word || "WORD"; // загаданное слово по теме

[...gameData.roles].reverse().forEach((role, index) => {
  const card = document.createElement("div");
  card.classList.add("card");
  card.style.zIndex = index + 1;

  if (role === "хамелеон") {
  card.classList.add("chameleon-card");
}

  // Строки внутри карточки
  const playerLine = `
  <div class="player-line">
    <span class="player-text">PLAYER</span>
    <span class="player-number">№ ${gameData.roles.length - index}</span>
  </div>
`;

const wordLine = role === "хамелеон"
  ? `<p class="chameleon-label">You are a CHAMELEON</p>`
  : `<p>${topicWord}</p>`;

const topicLine = `<p>Topic: ${gameData.topic}</p>`;

card.innerHTML = `${playerLine}${wordLine}${topicLine}`;

  container.appendChild(card);
});

container.addEventListener("click", () => {
  const topCard = container.querySelector(".card:last-child");
  if (topCard) topCard.remove();
});
});
