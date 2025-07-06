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
    en: {
      titleLabel: "GAME RULES",
      gameLabel: "Game",
      chamLabel: "Chameleon",
      geckLabel: "Gecko",
      gameplayersLabel: "Game / players",
      tx1Label: "All regular players receive cards with the same word that matches the given theme. One or more players receive a hidden role - a chameleon or a gecko.",
      tx2Label: "The players task - is to say words or phrases that are associated with the hidden word without revealing it completely. The goal is to figure out the liar based on suspicious or incorrect associations and vote for him.",
      tx3Label: "Starting from the second round, after the circle is over and everyone has said their associations, everyone votes on who they think is lying.",
      tx4Label: "Players win if they drive out the chameleon and receive 1 point.",
      chameleonLabel: "Chameleons",
      tx5Label: "The chameleon does not know the hidden word and must guess it by carefully listening to the associations of other players.",
      tx6Label: "His goal is not to give himself away and to come up with an association to seem like a normal player. If he is exposed at the end, he still has a chance to win - he can try to guess the word.",
      tx7Label: "The Chameleon wins and gets 3 points if he is not exposed or if he guesses the word.",
      geckoLabel: "Geckos",
      tx8Label: "The gecko also does not know the hidden word, but, unlike the chameleon, receives another word on the same topic.",
      tx9Label: "The gecko's task is to confuse the players and to confuse the chameleon and the regular players by giving tricky associations close to the hidden word.",
      tx10Label: "The gecko wins and gets 2 points if it remains uncovered until the end of the game."
    },
    ru: {
      titleLabel: "ПРАВИЛА ИГРЫ",
      gameLabel: "Игра",
      chamLabel: "Хамелеон",
      geckLabel: "Геккон",
      gameplayersLabel: "Игра / игроки",
      tx1Label: "Все обычные игроки получают карточки с одним и тем же словом, которое соответствует заданной теме. Один или несколько игроков получают скрытую роль — хамелеона или геккона.",
      tx2Label: "Задача игроков — говорить слова или словосочетания, которые ассоциируются с загаданным словом и при этом не раскрывать его полностью. Цель — вычислить лжеца, основываясь на подозрительных или неверных ассоциациях, и проголосовать за него.",
      tx3Label: "Начиная со второго раунда, после того как закончится круг и все скажут свои ассоциации, все голосуют, кто, по их мнению, лжет.",
      tx4Label: "Игроки выигрывают если изгнали хамелеона и получают по 1 очку.",
      chameleonLabel: "Хамелеоны",
      tx5Label: "Хамелеон не знает загаданного слова и должен угадывать его, внимательно слушая ассоциации других игроков.",
      tx6Label: "Его цель — не выдать себя и придумать такую ассоциацию, чтобы казаться обычным игроком. Если в конце его раскрывают, у него всё ещё есть шанс победить — он может попытаться угадать слово.",
      tx7Label: "Хамелеон побеждает и получает 3 очка, если его не разоблачат или если он угадает слово.",
      geckoLabel: "Гекконы",
      tx8Label: "Геккон также не знает загаданного слова, но, в отличии от хамелеона, получает другое слово по той же теме.",
      tx9Label: "Задача геккона — путать игроков и сбивать с толку хамелеона и обычных игроков, давая хитрые ассоциации, близкие к загаданному слову.",
      tx10Label: "Геккон выигрывает и получает 2 очка, если остаётся нераскрытым до конца игры."
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

  // === ПЕРЕКЛЮЧАТЕЛЬ БЛОКОВ ===
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      // Снять активность со всех кнопок
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      // Скрыть все блоки
      document.querySelectorAll('.tab-content').forEach(content => content.classList.add('hidden'));
      // Добавить активность к текущей кнопке
      btn.classList.add('active');
      // Показать нужный блок
      const tabId = btn.getAttribute('data-tab');
      document.getElementById(tabId).classList.remove('hidden');
    });
  });

});
