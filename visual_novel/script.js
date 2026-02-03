const intro = document.getElementById("intro");
const game = document.getElementById("game");
const music = document.getElementById("music");

const step1 = document.getElementById("intro-step-1");
const step2 = document.getElementById("intro-step-2");

const nameInput = document.getElementById("nameInput");
const confirmName = document.getElementById("confirmName");
const startGame = document.getElementById("startGame");

const story = document.getElementById("story");
const choicesDiv = document.getElementById("choices");
const imageDiv = document.getElementById("image");
const statsDiv = document.getElementById("stats");

game.style.display = "none";

let VALENTINE_NAME = "Criatura misteriosa";
let state;

/* ================= FX ================= */

function spawnHeart() {
  const h = document.createElement("div");
  h.className = "heart";
  h.style.left = Math.random() * 100 + "vw";
  h.style.animationDuration = 4 + Math.random() * 4 + "s";

  // 50% corazones grandes con foto, 50% corazones pequeños solo emoji
  if (Math.random() > 0.5) {
    // Corazón grande con foto y marco SVG de corazón
    const size = 90 + Math.random() * 40;
    h.style.width = size + "px";
    h.style.height = size + "px";
    h.style.position = "relative";
    h.style.display = "flex";
    h.style.justifyContent = "center";
    h.style.alignItems = "center";

    // SVG corazón como marco
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("width", size);
    svg.setAttribute("height", size);
    svg.setAttribute("viewBox", "0 0 100 100");
    svg.style.position = "absolute";
    svg.style.left = 0;
    svg.style.top = 0;
    svg.style.zIndex = 2;

    // Marco de corazón
    const path = document.createElementNS(svgNS, "path");
    path.setAttribute("d", "M50 85 L15 50 A25 25 0 1 1 50 25 A25 25 0 1 1 85 50 Z");
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", "#ff3e6c");
    path.setAttribute("stroke-width", "4");
    svg.appendChild(path);

    // ClipPath para la imagen
    const defs = document.createElementNS(svgNS, "defs");
    const clipPath = document.createElementNS(svgNS, "clipPath");
    const clipId = "heartClip" + Math.random().toString(36).substr(2, 9);
    clipPath.setAttribute("id", clipId);
    const clipPathShape = document.createElementNS(svgNS, "path");
    clipPathShape.setAttribute("d", "M50 85 L15 50 A25 25 0 1 1 50 25 A25 25 0 1 1 85 50 Z");
    clipPath.appendChild(clipPathShape);
    defs.appendChild(clipPath);
    svg.appendChild(defs);

    // Imagen besito recortada en forma de corazón
    const img = document.createElementNS(svgNS, "image");
    img.setAttributeNS('http://www.w3.org/1999/xlink', 'href', "img/besito.jpg");
    img.setAttribute("width", "100");
    img.setAttribute("height", "100");
    img.setAttribute("clip-path", `url(#${clipId})`);
    img.setAttribute("preserveAspectRatio", "xMidYMid slice");
    svg.appendChild(img);

    h.appendChild(svg);
  } else {
    // Corazón pequeño solo emoji
    const size = 32 + Math.random() * 18;
    h.style.width = size + "px";
    h.style.height = size + "px";
    h.style.display = "flex";
    h.style.justifyContent = "center";
    h.style.alignItems = "center";
    h.style.position = "relative";
    const emoji = document.createElement("span");
    emoji.textContent = Math.random() > 0.5 ? "💘" : "❤️";
    emoji.style.fontSize = size + "px";
    emoji.style.lineHeight = 1;
    emoji.style.zIndex = 1;
    h.appendChild(emoji);
  }

  document.getElementById("hearts").appendChild(h);
  setTimeout(() => h.remove(), 8000);
}

function launchConfetti() {
  for (let i = 0; i < 120; i++) {
    const c = document.createElement("div");
    c.className = "confetti";
    c.style.left = Math.random() * 100 + "vw";
    c.style.setProperty("--hue", Math.random() * 360);
    c.style.animationDuration = 3 + Math.random() * 3 + "s";
    document.getElementById("confetti").appendChild(c);
    setTimeout(() => c.remove(), 7000);
  }
}

/* ============ INTRO FLOW ============ */

let heartInterval = null;

function startIntroFX() {
  if (!heartInterval) {
    heartInterval = setInterval(spawnHeart, 500);
    launchConfetti();
  }
}

confirmName.addEventListener("click", () => {
  VALENTINE_NAME = nameInput.value.trim() || "criatura misteriosa";

  startIntroFX();

  music.volume = 0.4;
  music.play().catch(() => {});

  step1.classList.add("hidden");
  step2.classList.remove("hidden");
});

/* Enter también confirma nombre */
nameInput.addEventListener("keydown", e => {
  if (e.key === "Enter") confirmName.click();
});

startGame.addEventListener("click", () => {
  intro.style.display = "none";
  game.style.display = "block";

  resetState();
  showScene("start");
});

/* ================= GAME ================= */

function resetState() {
  state = {
    chocolates: 0,
    pistas: 0,
    dinero: 10,
    dignidad: 100,
    sospecha: 0
  };
}

const scenes = {
  start: {
    text: `Hoy es San Valentín. Tu objetivo: ¡conseguir chocolates! Pero no será fácil... ¿Qué harás primero?`,
    image: "img/alone.jpg",
    choices: [
      { text: "Buscar pistas en la calle 🕵️‍♂️", next: "street" },
      { text: "Interrogar a tu mascota 🐶", next: "pet" },
      { text: "Revisar la nevera 🍫", next: "fridge" }
    ]
  },
  street: {
    text: "La calle está llena de parejas y sospechosos. Ves a alguien con una caja misteriosa... ¿Te acercas?",
    image: "img/street.jpg",
    choices: [
      { text: "Sí, acercarse", next: "stranger" },
      { text: "No, mejor huir", next: "start" }
    ]
  },
  stranger: {
    text: "El extraño te mira y te pregunta una adivinanza: '¿Qué es dulce y desaparece rápido en San Valentín?' Si aciertas, te dará la pista clave para abrir la caja del armario.",
    image: "img/mistery.jpg",
    choices: [
      { text: "Responder: Chocolates", next: "pista1" },
      { text: "Responder: Amor", next: "fail1" }
    ]
  },
  pista1: {
    text: "¡Correcto! Te da la pista clave: 'El código es el número de letras de la palabra CHOCO.'",
    image: "img/clue.jpg",
    choices: [
      { text: "Volver a casa", next: "start", effect: () => { state.pistas = 1; } }
    ]
  },
  fail1: {
    text: "El extraño se ríe y desaparece. Te quedas sin pista y no puedes abrir la caja...",
    image: "img/fail.jpg",
    choices: [
      { text: "Volver a casa", next: "start" }
    ]
  },
  pet: {
    text: "Tu mascota te mira con cara de misterio. ¿Le das una galleta para que hable?",
    image: "img/pet.jpg",
    choices: [
      { text: "Sí, darle galleta (-1€)", next: "petClue", effect: () => { state.dinero -= 1; } },
      { text: "No, solo acariciar", next: "petNoClue" }
    ]
  },
  petClue: {
    text: "Tu mascota ladra y corre hacia el armario. ¿Será una pista?",
    image: "img/clue.jpg",
    choices: [
      { text: "Abrir el armario", next: "armario" }]
  },
  petNoClue: {
    text: "Tu mascota se duerme. No obtienes nada...",
    image: "img/sleep.jpg",
    choices: [
      { text: "Volver a pensar", next: "start" }]
  },
  armario: {
    text: "¡Encuentras una caja! Pero está cerrada con código. ¿Intentas abrirla?",
    image: "img/box.jpg",
    choices: [
      { text: "Sí, intentar abrir", next: "code" },
      { text: "No, buscar otra pista", next: "start" }]
  },
  code: {
    text: function() {
      if (state.pistas === 1) {
        return "¿Qué código usas? (Recuerda la pista del extraño: número de letras de 'choco')";
      } else {
        return "La caja tiene un código, pero no tienes la pista necesaria...";
      }
    },
    image: "img/code.jpg",
    choices: function() {
      if (state.pistas === 1) {
        return [
          { text: "5", next: "chocoBox" },
          { text: "6", next: "fail2" }
        ];
      } else {
        return [
          { text: "Volver a buscar la pista", next: "start" }
        ];
      }
    }
  },
  chocoBox: {
    text: "¡La caja se abre y hay chocolates! Has conseguido tu primer chocolate.",
    image: "img/choco.jpg",
    choices: [
      { text: "Celebrar 🎉", next: "celebrate" }]
  },
  fail2: {
    text: "La caja no se abre. Quizá necesitas la pista correcta...",
    image: "img/fail.jpg",
    choices: [
      { text: "Volver a buscar", next: "start" }]
  },
  fridge: {
    text: "La nevera está vacía... salvo una nota: 'Busca en el armario'.",
    image: "img/fridge.jpg",
    choices: [
      { text: "Ir al armario", next: "armario" },
      { text: "Cerrar la nevera", next: "start" }]
  },
  celebrate: {
    text: `¡FELICIDADES, ${VALENTINE_NAME}! Has conseguido chocolates y resuelto el misterio de San Valentín. ¿Quieres jugar otra vez?`,
    image: "img/end_ok.jpg",
    choices: [
      { text: "Volver a empezar", next: "start", effect: () => { resetState(); } }]
  }
};

function showScene(key) {
  const scene = scenes[key];

  // Permitir que text y choices sean funciones para escenas dinámicas
  const sceneText = typeof scene.text === "function" ? scene.text() : scene.text;
  story.textContent = sceneText;
  imageDiv.innerHTML = "";

  if (scene.image) {
    const img = document.createElement("img");
    img.src = scene.image;
    imageDiv.appendChild(img);
  }

  choicesDiv.innerHTML = "";
  const sceneChoices = typeof scene.choices === "function" ? scene.choices() : scene.choices;
  sceneChoices.forEach(choice => {
    const btn = document.createElement("button");
    btn.textContent = choice.text;
    btn.onclick = () => {
      if (choice.effect) choice.effect();
      showScene(choice.next);
    };
    choicesDiv.appendChild(btn);
  });

  statsDiv.textContent =
    `🕵️‍♂️ Pistas: ${state.pistas} | 💰 Dinero: ${state.dinero}€`;
}
