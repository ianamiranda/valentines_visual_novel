const story = document.getElementById("story");
const choicesDiv = document.getElementById("choices");

// Todas las escenas del juego
const scenes = {
  start: {
    text: "💘 Es 14 de febrero. Estás en casa viendo Netflix. ¿Qué haces?",
    choices: [
      { text: "Comprar chocolates 🍫", next: "chocolate" },
      { text: "Mandar memes 💀", next: "memes" },
      { text: "Jugar videojuegos 🎮", next: "games" }
    ]
  },

  chocolate: {
    text: "Vas a la tienda... los chocolates cuestan 3 veces más 😭",
    choices: [
      { text: "Igual los compro", next: "broke" },
      { text: "Mejor regreso a casa", next: "start" }
    ]
  },

  memes: {
    text: "Envías memes de San Valentín. Te bloquean 2 personas 💔",
    choices: [
      { text: "Mandar MÁS memes", next: "blocked" },
      { text: "Pedir perdón", next: "forgive" }
    ]
  },

  games: {
    text: "Te vicias jugando. Olvidas que es San Valentín. Final feliz 😎",
    choices: []
  },

  broke: {
    text: "Te quedas sin dinero pero con chocolates. Worth it.",
    choices: []
  },

  blocked: {
    text: "Ahora estás bloqueado, pero fiel a tu estilo 💀",
    choices: []
  },

  forgive: {
    text: "Te perdonan. Te mandan un corazón 🥹",
    choices: []
  }
};

// Función para mostrar escenas
function showScene(sceneKey) {
  const scene = scenes[sceneKey];
  story.textContent = scene.text;
  choicesDiv.innerHTML = "";

  scene.choices.forEach(choice => {
    const button = document.createElement("button");
    button.textContent = choice.text;
    button.onclick = () => showScene(choice.next);
    choicesDiv.appendChild(button);
  });
}

// Iniciar el juego
showScene("start");
