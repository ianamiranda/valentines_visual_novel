const story = document.getElementById("story");
const choicesDiv = document.getElementById("choices");
const imageDiv = document.getElementById("image");
const statsDiv = document.getElementById("stats");
const intro = document.getElementById("intro");
const game = document.getElementById("game");
const VALENTINE_NAME = "Alex"; // o el nombre que quieras

game.style.display = "none";

let state;

const music = document.getElementById("music");

function fakeVibration() {
  document.body.classList.add("glitch");
  setTimeout(() => document.body.classList.remove("glitch"), 300);
}

function spawnHeart() {
  const heart = document.createElement("div");
  heart.className = "heart";
  heart.textContent = Math.random() > 0.5 ? "💘" : "❤️";
  heart.style.left = Math.random() * 100 + "vw";
  heart.style.animationDuration = 3 + Math.random() * 3 + "s";
  heart.style.fontSize = 14 + Math.random() * 30 + "px";
  document.getElementById("hearts").appendChild(heart);

  setTimeout(() => heart.remove(), 6000);
}

function launchConfetti() {
  for (let i = 0; i < 120; i++) {
    const c = document.createElement("div");
    c.className = "confetti";
    c.style.left = Math.random() * 100 + "vw";
    c.style.top = "-10px";
    c.style.setProperty("--hue", Math.random() * 360);
    c.style.animationDuration = 2 + Math.random() * 3 + "s";
    document.getElementById("confetti").appendChild(c);

    setTimeout(() => c.remove(), 5000);
  }
}


function resetState(worse = false) {
  state = {
    memes: 0,
    money: worse ? 10 : 20,
    dignity: worse ? 60 : 100,
    worseRun: worse
  };
}

resetState();

const scenes = {
  start: {
    text: "Antes de empezar, un besito y unas flores para que no te sientas solito :) \n💘 Es 14 de febrero.\nNetflix sigue preguntando si sigues ahí.",
    image: "img/alone.jpg",
    choices: [
      { text: "Salir a la calle 🚶", next: "street" },
      { text: "Mandar memes 📱", next: "memes" },
      { text: "Ignorar el día 🎮", next: "games" }
    ]
  },

  street: {
    text: "Sales a la calle.\nDemasiadas parejas. Demasiado contacto visual.",
    image: "img/street.jpg",
    choices: [
      {
        text: "Comprar chocolates (-10€)",
        effect: () => state.money -= 10,
        next: "chocolate"
      },
      { text: "Volver a casa", next: "start" }
    ]
  },

  memes: {
    text: "Empiezas a mandar memes.\nAlgunos funcionan. Otros… no.",
    image: "img/meme.jpg",
    choices: [
      {
        text: "Mandar otro meme",
        effect: () => {
          state.memes++;
          state.dignity -= 10;
        },
        next: "memes"
      },
      {
        text: "Parar y esperar respuesta",
        next: "checkMemes"
      }
    ]
  },

  checkMemes: {
    text: () => {
      if (state.memes >= 4 && state.dignity <= 40) {
        return "Nadie responde.\nHas cruzado una línea invisible.";
      }
      return "Alguien responde con un emoji.\nNo sabes cuál es el tono.";
    },
    image: "img/chat.jpg",
    choices: [
      { text: "Aceptar el destino", next: "endingCheck" }
    ]
  },

  chocolate: {
    text: "Compras chocolates caros.\nNo tienes un plan.",
    image: "img/chocolate.jpg",
    choices: [
      { text: "Comértelos tú", next: "endingSelf" },
      { text: "Regalarlos igual", next: "endingAwkward" }
    ]
  },

  games: {
    text: "Te pones a jugar.\nEl tiempo deja de existir.",
    image: "img/gaming.jpg",
    choices: [
      { text: "Seguir jugando", next: "endingPeace" }
    ]
  },

  endingCheck: {
    text: () => {
      if (state.memes >= 5) {
        return "FINAL SECRETO:\nSilenciado en múltiples chats \nUna leyenda";
      }
      return "FINAL:\nSobreviviste socialmente.\nPor poco.";
    },
    image: () =>
      state.memes >= 5 ? "img/end_secret.jpg" : "img/end_porpoco.jpg",
    choices: []
  },

  endingSelf: {
    text: "FINAL:\nAmor propio.\nChocolate caro. Decisión correcta.",
    image: "img/end_ok.jpg",
    choices: []
  },

  endingAwkward: {
    text: "FINAL:\neeeeeeeee ok¿",
    image: "img/end_awkward.jpg",
    choices: []
  },

  endingPeace: {
    text: "FINAL:\nPaz mental.\nNadie te molestó.\nUn besito para ti",
    image: "img/end_peace.jpg",
    choices: []
  }
};

function showStartMessage() {
  fakeVibration();

  intro.innerHTML = `
    <div class="intro-content glitch">
      <h1>💘 FELIZ SAN VALENTÍN 💘</h1>
      <p class="subtitle">
        ${VALENTINE_NAME}, el algoritmo ha decidido que hoy sientas cosas
      </p>
      <p class="tap">cargando emociones artificiales...</p>
    </div>
  `;

  launchConfetti();

  setTimeout(() => {
    intro.innerHTML = `
      <div class="intro-content">
        <h1>⚠️ AVISO ⚠️</h1>
        <p class="subtitle">
          Este juego puede contener:<br>
          💔 cringe<br>
          📱 memes malos<br>
          🧠 decisiones cuestionables
        </p>
      </div>
    `;
  }, 2500);

  setTimeout(() => {
    intro.style.display = "none";
    game.style.display = "block";
    showScene("start");
  }, 5000);
}


function showScene(key) {
  const scene = scenes[key];

  const text =
    typeof scene.text === "function" ? scene.text() : scene.text;
  story.textContent = text;

  imageDiv.innerHTML = "";
  const imgSrc =
    typeof scene.image === "function" ? scene.image() : scene.image;
  if (imgSrc) {
    const img = document.createElement("img");
    img.src = imgSrc;
    img.classList.add("fade");
    imageDiv.appendChild(img);
  }

  choicesDiv.innerHTML = "";
  scene.choices.forEach(choice => {
    const btn = document.createElement("button");
    btn.textContent = choice.text;
    btn.onclick = () => {
      if (choice.effect) choice.effect();
      showScene(choice.next);
    };
    choicesDiv.appendChild(btn);
  });

  updateStats();

  if (scene.choices.length === 0) {
    addEndButtons();
  }
}

function updateStats() {
  statsDiv.textContent =
    `💰 Dinero: ${state.money}€ | 📱 Memes: ${state.memes} | 🧠 Dignidad: ${state.dignity}`;
}

function addEndButtons() {
  const retry = document.createElement("button");
  retry.textContent = "Reintentar (pero peor)";
  retry.onclick = () => {
    resetState(true);
    showScene("start");
  };

  const restart = document.createElement("button");
  restart.textContent = "Reiniciar normal";
  restart.onclick = () => {
    resetState(false);
    showScene("start");
  };

  choicesDiv.appendChild(retry);
  choicesDiv.appendChild(restart);
}

intro.addEventListener("click", () => {
  music.volume = 0.5;
  music.play();
  setInterval(spawnHeart, 300);
  showStartMessage();
});

