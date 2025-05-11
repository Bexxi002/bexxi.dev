const dotdev = document.getElementById("dotdev");

const intro = ".dev";
let currentPhrase = intro;
let currentChar = 0;
let isDeleting = false;
let started = false;
let lastPhrase = "";

const seasonalPhrases = {
  spring: [
    " (blooming)",
    " :flower:",
    " fresh!",
    " new start!",
    " chirp~",
  ],
  summer: [
    " :sun:",
    " is hot!",
    " beach++",
    " sunglasses: on.",
  ],
  autumn: [
    " :leaves:",
    " cozy~",
    " hoodie szn",
    " pumpkin!",
    " leaves++",
  ],
  winter: [
    " :snow:",
    " is chilly!",
    " cocoa <3",
    " brrr!",
    " snowww",
  ],
  neutral: [
    " (he/him)",
    " <3",
    " ^^",
    " is cool!",
    " loves code!",
    "!!!!",
    "++",
    "~",
    ".exe",
    "; 404!",
    " is dreaming~",
    " is typing...",
    ": moo!",
    ".dev",
    " :3",
    ": meow!"
  ],
  halloween: [
    " :pumpkin:!",
    " spooked!",
    " boo~",
    " :candy:",
    " :ghost:",
  ],
  pride: [
    ": u r valid!",
    " pride <3",
  ]
};

function getSeasonOrEvent() {
  const now = new Date();
  const month = now.getMonth(); // 0 = Jan; 11 = Dec
  const date = now.getDate();

  if (month === 5) return "pride"; // June
  if (month === 9) return "halloween"; // October
  if (month >= 2 && month < 5) return "spring";
  if (month >= 5 && month < 8) return "summer";
  if (month >= 8 && month < 11) return "autumn";
  return "winter";
}

function pickRandomPhrase(season) {
  const pool = [
    ...(seasonalPhrases[season] || []),
    ...seasonalPhrases.neutral,
  ];
  let phrase;
  do {
    phrase = pool[Math.floor(Math.random() * pool.length)];
  } while (phrase === lastPhrase);
  lastPhrase = phrase;
  return phrase;
}

function typeEffect() {
  const display = currentPhrase.slice(0, currentChar);
  dotdev.textContent = display;

  let speed = isDeleting ? 40 : 100;

  if (!isDeleting && currentChar === currentPhrase.length) {
    speed = 5000;
    isDeleting = true;
  } else if (isDeleting && currentChar === 0) {
    isDeleting = false;
    started = true;
    currentPhrase = started ? pickRandomPhrase(getSeasonOrEvent()) : intro;
    speed = 500;
  } else {
    currentChar += isDeleting ? -1 : 1;
  }

  setTimeout(typeEffect, speed);
}

typeEffect();