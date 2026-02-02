const story = document.getElementById("story");
const choicesDiv = document.getElementById("choices");
const imageDiv = document.getElementById("image");
const statsDiv = document.getElementById("stats");

let state;

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

showScene("start");
