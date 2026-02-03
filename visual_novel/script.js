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
    mapa: false,
    llave: false,
    adivinanza1: false,
    adivinanza2: false
  };
}

const scenes = {
  start: {
    text: () => `¡Hola, ${VALENTINE_NAME}! Hoy es San Valentín y comienza la caza del tesoro. Tu objetivo: encontrar la caja de chocolates secreta. ¿Por dónde empiezas?`,
    image: "img/alone.jpg",
    choices: [
      { text: "Interrogar a tu mascota 🐶", next: "pet" },
      { text: "Buscar pistas en la calle 🕵️‍♂️", next: "street" },
      { text: "Revisar la nevera 🍫", next: "fridge" },
    ]
  },
  street: {
    text: () => `La calle está llena de parejas. No hay ni un solo informático a la vista. Sin embargo, ves un mapa arrugado en el suelo. ¿Lo recoges?`,
    image: "img/street.jpg",
    choices: [
      { text: "Recoger el mapa", next: "mapa", effect: () => { state.mapa = true; } },
      { text: "Ignorar y seguir", next: "stranger" }
    ]
  },
  mapa: {
    text: () => `¡Bien hecho, ${VALENTINE_NAME}! El mapa tiene marcas misteriosas y una X en el armario. ¿Sigues el mapa o buscas más pistas?`,
    image: "img/clue.jpg",
    choices: [
      { text: "Seguir el mapa", next: "armario" },
      { text: "Buscar más pistas", next: "stranger" }
    ]
  },
  ducha: {
    text: () => `Ducha en proceso...`,
    image: "img/shower.jpg",
    choices: [
      { text: "Listo para intentrarlo de nuevo", next: "start" }
    ]
  },
  stranger: {
    text: () => `Un extraño te detiene y te lanza dos preguntas. Si aciertas ambas, te dará la llave de la caja. Primera: 'Pequeñito, oscuro y siempre enfadado; si te descuidas, te deja marcado.'`,
    image: "img/mistery.jpg",
    choices: [
      { text: "Responder: Trozo de carbón", next: "adivinanza2", effect: () => { state.adivinanza1 = true; } },
      { text: "Responder: Hormiga con mal humor", next: "fail1" },
      { text: "Responder: Cynthia", next: "fail2" }
    ]
  },
  adivinanza2: {
    text: () => `¡Correcto, ${VALENTINE_NAME}! Segunda adivinanza: ¿Cuál de estas imágenes representa el verdadero tesoro de San Valentín?`,
    image: null,
    choices: [
      { text: "", next: "fail4", img: "img/jordi.jpg", alt: "Jordi" },
      { text: "", next: "fail5", img: "img/berserk.jpg", alt: "Berserk" }
      { text: "", next: "llave", effect: () => { state.adivinanza2 = true; }, img: "img/estudiante.jpg", alt: "Estudiante" }
    ]
  },
  llave: {
    text: () => `¡Genial, ${VALENTINE_NAME}! El extraño te da una llave dorada y te susurra: 'La caja solo se abre con la llave y el código secreto.'`,
    image: "img/clue.jpg",
    choices: [
      { text: "Volver a casa", next: "start", effect: () => { state.llave = true; state.pistas = 1; } }
    ]
  },
  fail1: {
    text: () => `El extraño se ríe y desaparece. Sin acertar la adivinanza, no obtienes nada.`,
    image: "img/fail.jpg",
    choices: [
      { text: "Volver a casa", next: "start" }
    ]
  },
  fail2: {
    text: () => `Te has quedado MUY cerca, pero no todo lo pequeño y enfadado es Cynthia. No obtienes la llave, ${VALENTINE_NAME}.`,
    image: "img/fail.jpg",
    choices: [
      { text: "Volver a casa", next: "start" }
    ]
  },
  fail4: {
    text: () => `Deja de acosar a mujeres. Castigado sin llave, ${VALENTINE_NAME}.`,
    image: "img/fail.jpg",
    choices: [
      { text: "Volver a casa", next: "start" }
    ]
  },
  fail5: {
    text: () => `Hueles desde aquí. Primero ve a ducharte.`,
    image: "img/fail.jpg",
    choices: [
      { text: "Volver a casa", next: "ducha" }
    ]
  },
  pet: {
    text: () => `Tu mascota te mira con cara de misterio, ${VALENTINE_NAME}. ¿Le das una galleta para que te ayude?`,
    image: "img/pet.jpg",
    choices: [
      { text: "Sí, darle galleta (-1€)", next: "petClue", effect: () => { state.dinero -= 1; } },
      { text: "No, solo acariciar", next: "petNoClue" }
    ]
  },
  petClue: {
    text: () => `Tu mascota ladra y corre hacia el armario. Parece que quiere que lo abras, ${VALENTINE_NAME}.`,
    image: "img/clue.jpg",
    choices: [
      { text: "Abrir el armario", next: "armario" }]
  },
  petNoClue: {
    text: () => `Tu mascota se duerme. No obtienes nada, ${VALENTINE_NAME}...`,
    image: "img/sleep.jpg",
    choices: [
      { text: "Volver a pensar", next: "start" }]
  },
  armario: {
    text: () => `¡${VALENTINE_NAME}, encuentras la caja del tesoro! Pero está cerrada con llave y código. ¿Intentas abrirla?`,
    image: "img/box.jpg",
    choices: [
      { text: "Sí, intentar abrir", next: "code" },
      { text: "No, buscar otra pista", next: "start" }]
  },
  code: {
    text: function() {
      if (state.llave && state.pistas === 1) {
        return `Tienes la llave dorada y la pista del código, ${VALENTINE_NAME}. El código indica lo más importante de San Valentín. ¿Cuál es?`;
      } else if (!state.llave && state.pistas === 1) {
        return `Tienes la pista del código pero te falta la llave, ${VALENTINE_NAME}.`;
      } else if (state.llave && state.pistas !== 1) {
        return `Tienes la llave pero te falta la pista del código, ${VALENTINE_NAME}.`;
      } else {
        return `La caja tiene un código y una cerradura, pero te faltan cosas, ${VALENTINE_NAME}...`;
      }
    },
    image: "img/code.jpg",
    choices: function() {
      if (state.llave && state.pistas === 1) {
        return [
          { text: "SAM", next: "chocoBox" },
          { text: "AMOR", next: "fail3" }
        ];
      } else {
        return [
          { text: "Volver a buscar pistas", next: "start" }
        ];
      }
    }
  },
  chocoBox: {
    text: () => `¡La caja se abre y hay chocolates! ${VALENTINE_NAME}, has conseguido el tesoro de San Valentín tras superar todas las pruebas.`,
    image: "img/choco.jpg",
    choices: [
      { text: "Celebrar 🎉", next: "celebrate" }]
  },
  fail3: {
    text: () => `No sé si eres demasiado mayor o simplemente ingenuo. No has abierto la caja, ${VALENTINE_NAME}.`,
    image: "img/fail.jpg",
    choices: [
      { text: "Volver a buscar", next: "start" }]
  },
  fridge: {
    text: () => `La nevera está vacía... salvo una nota que dice: 'El tesoro está donde menos lo esperas, ${VALENTINE_NAME}'.`,
    image: "img/fridge.jpg",
    choices: [
      { text: "Ir al armario", next: "armario" },
      { text: "Cerrar la nevera", next: "start" }]
  },
  celebrate: {
    text: () => `¡FELICIDADES, ${VALENTINE_NAME}! Has conseguido la caja de chocolates y resuelto la caza del tesoro de San Valentín. ¿Quieres jugar otra vez y probar otros caminos?`,
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

  // Mostrar imagen principal solo si no es una escena de selección de imagen
  if (scene.image) {
    const img = document.createElement("img");
    img.src = scene.image;
    imageDiv.appendChild(img);
  }

  choicesDiv.innerHTML = "";
  const sceneChoices = typeof scene.choices === "function" ? scene.choices() : scene.choices;

  // Si la escena tiene imágenes en las opciones, mostrar como galería
  if (key === "adivinanza2") {
    const gallery = document.createElement("div");
    gallery.style.display = "flex";
    gallery.style.justifyContent = "center";
    gallery.style.gap = "18px";
    sceneChoices.forEach(choice => {
      const imgBtn = document.createElement("button");
      imgBtn.style.background = "none";
      imgBtn.style.border = "none";
      imgBtn.style.padding = "0";
      imgBtn.style.cursor = "pointer";
      imgBtn.style.borderRadius = "14px";
      imgBtn.style.boxShadow = "0 2px 8px rgba(255, 105, 135, 0.10)";
      imgBtn.onmouseover = () => imgBtn.style.boxShadow = "0 4px 16px #ffb6c1";
      imgBtn.onmouseout = () => imgBtn.style.boxShadow = "0 2px 8px rgba(255, 105, 135, 0.10)";
      const img = document.createElement("img");
      img.src = choice.img;
      img.alt = choice.alt;
      img.style.width = "110px";
      img.style.height = "110px";
      img.style.objectFit = "cover";
      img.style.borderRadius = "14px";
      imgBtn.appendChild(img);
      imgBtn.onclick = () => {
        if (choice.effect) choice.effect();
        showScene(choice.next);
      };
      gallery.appendChild(imgBtn);
    });
    choicesDiv.appendChild(gallery);
  } else {
    sceneChoices.forEach(choice => {
      const btn = document.createElement("button");
      btn.textContent = choice.text;
      btn.onclick = () => {
        if (choice.effect) choice.effect();
        showScene(choice.next);
      };
      choicesDiv.appendChild(btn);
    });
  }

  statsDiv.textContent =
    `🕵️‍♂️ Pistas: ${state.pistas} | 💰 Dinero: ${state.dinero}€`;
}
