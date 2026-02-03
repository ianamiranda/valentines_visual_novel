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
    memes: 0,
    money: 20,
    dignity: 100
  };
}

const scenes = {
  start: {
    text: `Netflix sigue preguntando si sigues ahí.`,
    image: "img/alone.jpg",
    choices: [
      { text: "Salir a la calle 🚶", next: "street" },
      { text: "Mandar memes 📱", next: "memes" },
      { text: "Ignorar el día 🎮", next: "games" }
    ]
  },
  street: {
    text: "Demasiadas parejas. Demasiado contacto visual.",
    image: "img/street.jpg",
    choices: [{ text: "Volver a casa", next: "start" }]
  },
  memes: {
    text: "Mandas memes.\nAlgunos no debieron nacer.",
    image: "img/meme.jpg",
    choices: [{ text: "Aceptar el destino", next: "ending" }]
  },
  games: {
    text: "Paz mental absoluta.",
    image: "img/gaming.jpg",
    choices: [{ text: "Final feliz", next: "ending" }]
  },
  ending: {
    text: `FINAL:\n${VALENTINE_NAME}, sobreviviste a San Valentín.`,
    image: "img/end_ok.jpg",
    choices: []
  }
};

function showScene(key) {
  const scene = scenes[key];

  story.textContent = scene.text;
  imageDiv.innerHTML = "";

  if (scene.image) {
    const img = document.createElement("img");
    img.src = scene.image;
    imageDiv.appendChild(img);
  }

  choicesDiv.innerHTML = "";
  scene.choices.forEach(choice => {
    const btn = document.createElement("button");
    btn.textContent = choice.text;
    btn.onclick = () => showScene(choice.next);
    choicesDiv.appendChild(btn);
  });

  statsDiv.textContent =
    `💰 ${state.money}€ | 📱 ${state.memes} memes | 🧠 ${state.dignity}`;
}
