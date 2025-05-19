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

const confettiCount = 33;
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
  globalWind = Math.sin(Date.now() / 2000) * 0.3;
}, 150);

const shapes = ['square', 'triangle', 'star', 'rectangle'];

class Confetto {
  constructor(x, y, mouseVX, mouseVY) {
    this.position = { x, y };
    this.velocity = {
      x: (Math.random() - 0.5) * 5 + mouseVX * mouseInfluence,
      y: (Math.random() - 0.5) * 5 + mouseVY * mouseInfluence,
    };
    this.rotation = Math.random() * 2 * Math.PI;
    this.rotationSpeed = (Math.random() - 0.5) * 0.15;
    
    this.shape = shapes[Math.floor(Math.random() * shapes.length)];
    this.baseSize = Math.random() * 8 + 3;
    this.size = this.baseSize * (this.shape === 'star' ? 1.2 : 1);
    
    this.hue = Math.floor(Math.random() * 360);
    this.opacity = 1;
    this.age = 0;
    this.lifespan = 220 + Math.random() * 100;
    this.flutterFrequency = Math.random() * 0.04 + 0.02;
    this.flutterAmplitude = Math.random() * 0.25 + 0.2;
    this.windOffset = Math.random() * 2 - 1;
    this.personalGravity = gravity * (0.6 + Math.random() * 0.8);
    this.personalTerminalVelocity = terminalVelocity * (0.6 + Math.random() * 0.8);
    
    // Glow properties
    this.glowIntensity = Math.random() * 0.3 + 0.1;
    this.glowSize = this.size * (0.5 + Math.random() * 0.5);
  }

  update() {
    const flutter = Math.sin(this.age * this.flutterFrequency) * this.flutterAmplitude;
    const windEffect = globalWind * (0.6 + this.windOffset * 0.15);
    this.velocity.x += (flutter + windEffect) * 0.08;

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
    
    this.glowIntensity = (Math.random() * 0.2 + 0.2) * this.opacity;
  }

  drawShape(ctx) {
    const half = this.size / 2;
    const color = hslRainbow(this.hue);
    
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    
    switch (this.shape) {
      case 'square':
        ctx.fillRect(-half, -half, this.size, this.size);
        break;
        
      case 'triangle':
        ctx.beginPath();
        ctx.moveTo(0, -half);
        ctx.lineTo(-half, half);
        ctx.lineTo(half, half);
        ctx.closePath();
        ctx.fill();
        break;
        
      case 'rectangle':
        const width = this.size;
        const height = this.size * 0.6;
        ctx.fillRect(-width/2, -height/2, width, height);
        break;
        
      case 'star':
        const spikes = 5;
        const outerRadius = half;
        const innerRadius = half * 0.5;
        
        ctx.beginPath();
        for (let i = 0; i < spikes * 2; i++) {
          const radius = i % 2 === 0 ? outerRadius : innerRadius;
          const angle = (i * Math.PI) / spikes;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
        break;
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.position.x, this.position.y);
    ctx.rotate(this.rotation);
    ctx.globalAlpha = this.opacity;
    
    const color = hslRainbow(this.hue);
    ctx.shadowColor = color;
    ctx.shadowBlur = this.glowSize * this.glowIntensity;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    
    this.drawShape(ctx);
    
    ctx.shadowBlur = this.glowSize * this.glowIntensity * 0.5;
    this.drawShape(ctx);
    
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
    setTimeout(() => (confettiCooldown = false), 1333);
  }
});