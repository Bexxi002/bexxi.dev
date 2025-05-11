const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();

window.addEventListener("resize", () => {
  const prevWidth = canvas.width;
  const prevHeight = canvas.height;

  confetti.forEach(c => {
    c.relX = c.position.x / prevWidth;
    c.relY = c.position.y / prevHeight;
  });

  resizeCanvas();

  confetti.forEach(c => {
    c.position.x = c.relX * canvas.width;
    c.position.y = c.relY * canvas.height;
  });
});

const confettiCount = 30;
const gravity = 0.1;
const drag = 0.02;
const terminalVelocity = 2.5;
const mouseInfluence = 0.2;
const bounceLoss = 0.6;

const bexxi = document.getElementById("bexxi");
let confetti = [];

function hslRainbow(h) {
  return `hsl(${h % 360}, 100%, 60%)`;
}

let globalWind = 0;
setInterval(() => {
  globalWind = Math.sin(Date.now() / 1000) * 0.5;
}, 100);

class Confetto {
  constructor(x, y, mouseVX, mouseVY) {
    this.position = { x, y };
    this.velocity = {
      x: (Math.random() - 0.5) * 5 + mouseVX * mouseInfluence,
      y: (Math.random() - 0.5) * 5 + mouseVY * mouseInfluence,
    };
    this.rotation = Math.random() * 2 * Math.PI;
    this.rotationSpeed = (Math.random() - 0.5) * 0.15;
    this.size = Math.random() * 6 + 4;
    this.hue = Math.floor(Math.random() * 360);
    this.opacity = 1;
    this.age = 0;
    this.lifespan = 220 + Math.random() * 100;
    this.flutterFrequency = Math.random() * 0.1 + 0.05;
    this.flutterAmplitude = Math.random() * 0.5 + 0.3;
    this.windOffset = Math.random() * 2 - 1;
    this.personalGravity = gravity * (0.6 + Math.random() * 0.8);
    this.personalTerminalVelocity = terminalVelocity * (0.6 + Math.random() * 0.8);
  }

  update() {
    const flutter = Math.sin(this.age * this.flutterFrequency) * this.flutterAmplitude;
    const windEffect = globalWind * (0.8 + this.windOffset * 0.2);
    this.velocity.x += (flutter + windEffect) * 0.1;

    this.velocity.y = Math.min(this.velocity.y + this.personalGravity, this.personalTerminalVelocity);
    this.velocity.x *= 1 - drag;
    this.velocity.y *= 1 - drag;

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;


    const { x, y } = this.position;
    const s = this.size;

    if (y <= 0) {
      this.position.y = 0;
      this.velocity.y *= -bounceLoss;
    } else if (y + s >= canvas.height) {
      this.position.y = canvas.height - s;
      this.velocity.y *= -bounceLoss;
    }

    if (x <= 0) {
      this.position.x = 0;
      this.velocity.x *= -bounceLoss;
    } else if (x + s >= canvas.width) {
      this.position.x = canvas.width - s;
      this.velocity.x *= -bounceLoss;
    }

    this.rotation += this.rotationSpeed;
    this.age++;
    this.opacity = Math.max(0, 1 - this.age / this.lifespan);
    this.hue += 1.5;
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.position.x, this.position.y);
    ctx.rotate(this.rotation);
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = hslRainbow(this.hue);
    ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
    ctx.restore();
  }
}

let lastMouse = { x: 0, y: 0 };
let mouseVelocity = { x: 0, y: 0 };

document.addEventListener("mousemove", (e) => {
  mouseVelocity.x = e.clientX - lastMouse.x;
  mouseVelocity.y = e.clientY - lastMouse.y;
  lastMouse = { x: e.clientX, y: e.clientY };
});

function getTextCenter(element) {
  const rect = element.getBoundingClientRect();
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  };
}

function burstConfetti() {
  const center = getTextCenter(bexxi);
  for (let i = 0; i < confettiCount; i++) {
    confetti.push(new Confetto(center.x, center.y, mouseVelocity.x, mouseVelocity.y));
  }
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = confetti.length - 1; i >= 0; i--) {
    const c = confetti[i];
    c.update();
    c.draw(ctx);
    if (c.opacity <= 0) confetti.splice(i, 1);
  }

  requestAnimationFrame(render);
}
render();

let confettiCooldown = false;
bexxi.addEventListener("mouseenter", () => {
  if (!confettiCooldown) {
    burstConfetti();
    confettiCooldown = true;
    setTimeout(() => (confettiCooldown = false), 2000);
  }
});
