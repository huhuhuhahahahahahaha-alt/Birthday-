// === Stage Logic ===
const stages = ["loader", "terminal", "cutscene", "celebration", "assistant", "finale"];
const secretCode = "joy2025";
let aiIndex = 0;

// Show selected stage
function showStage(stageId) {
  stages.forEach(id => document.getElementById(id).style.display = "none");
  document.getElementById(stageId).style.display = "flex";
}

// Initial loading
showStage("loader");
setTimeout(() => showStage("terminal"), 3000);

// Terminal code entry
document.getElementById("codeInput").addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const val = e.target.value.trim();
    if (val === secretCode) {
      document.getElementById("unlockSound").play();
      showStage("cutscene");
      document.getElementById("cutsceneVideo").play();
      setTimeout(() => showStage("celebration"), 8000);
      setTimeout(() => document.getElementById("confettiSound").play(), 8200);
      setTimeout(() => launchConfetti(), 8200);
    } else {
      document.getElementById("error").textContent = "❌ Incorrect Code. Try Again.";
    }
  }
});

// === Confetti Animation ===
function launchConfetti() {
  const canvas = document.getElementById("confettiCanvas");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let particles = Array.from({ length: 200 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * -canvas.height,
    r: Math.random() * 8 + 2,
    color: `hsl(${Math.random() * 360}, 100%, 60%)`,
    speed: Math.random() * 4 + 2,
    drift: Math.random() * 2 - 1
  }));

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.y += p.speed;
      p.x += p.drift;
      if (p.y > canvas.height) {
        p.y = -10;
        p.x = Math.random() * canvas.width;
      }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
    });
    requestAnimationFrame(animate);
  }

  animate();
}

// === AI Assistant Chat ===
const chatbox = document.getElementById("chatbox");
const userInput = document.getElementById("userInput");

const assistantReplies = [
  "Hello, Ma’am Joy. I am your birthday assistant 🤖",
  "You've reached the final stage of your journey.",
  "This celebration was designed with 💖 by your crew.",
  "You are the spark in every room, the light in every mission. ✨",
  "🎉 Happy Birthday again, Commander Joy!"
];

userInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && userInput.value.trim() !== "") {
    const userMsg = userInput.value.trim();
    chatbox.innerHTML += `<div class="msg"><strong>You:</strong> ${userMsg}</div>`;
    userInput.value = "";
    chatbox.scrollTop = chatbox.scrollHeight;

    setTimeout(() => {
      if (aiIndex < assistantReplies.length) {
        const reply = assistantReplies[aiIndex++];
        typeMessage(reply);
        speak(reply);
      } else if (aiIndex === assistantReplies.length) {
        showStage("finale");
        aiIndex++;
      }
    }, 1000);
  }
});

function typeMessage(msg) {
  let i = 0;
  const interval = setInterval(() => {
    if (i < msg.length) {
      chatbox.innerHTML += `<span>${msg.charAt(i)}</span>`;
      chatbox.scrollTop = chatbox.scrollHeight;
      i++;
    } else {
      chatbox.innerHTML += `<br/>`;
      clearInterval(interval);
    }
  }, 30);
}

// === Voice Synthesis ===
function speak(text) {
  const msg = new SpeechSynthesisUtterance(text);
  msg.rate = 1;
  msg.pitch = 1.2;
  msg.lang = 'en-US';
  window.speechSynthesis.speak(msg);
}

// === Starfield Background ===
const starCanvas = document.getElementById("stars");
const ctx = starCanvas.getContext("2d");
starCanvas.width = window.innerWidth;
starCanvas.height = window.innerHeight;

let stars = Array.from({ length: 200 }, () => ({
  x: Math.random() * starCanvas.width,
  y: Math.random() * starCanvas.height,
  r: Math.random() * 1.5 + 0.5,
  d: Math.random() * 0.5 + 0.05
}));

function animateStars() {
  ctx.clearRect(0, 0, starCanvas.width, starCanvas.height);
  ctx.fillStyle = "#ffffff";
  stars.forEach(star => {
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
    ctx.fill();
    star.y += star.d;
    if (star.y > starCanvas.height) {
      star.y = 0;
      star.x = Math.random() * starCanvas.width;
    }
  });
  requestAnimationFrame(animateStars);
}

animateStars();

// === Final Replay Button ===
function nextStage(stage) {
  showStage(stage);
  if (stage === "assistant") {
    const greeting = assistantReplies[0];
    chatbox.innerHTML += `<div class="msg"><strong>AI:</strong> ${greeting}</div>`;
    speak(greeting);
    aiIndex = 1;
  }
}

function replay() {
  location.reload();
}
